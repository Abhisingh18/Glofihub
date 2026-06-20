'use client';

import { useEffect, useRef, useState } from 'react';
import { Send, ShieldCheck } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { sendMessage } from '@/lib/actions/chat';
import type { Message } from '@/lib/database.types';
import { cn } from '@/lib/utils';

interface Props {
  conversationId: string;
  me: { id: string; name: string };
  other: { id: string; name: string };
  initial: Message[];
}

export function ChatBox({ conversationId, me, other, initial }: Props) {
  const [messages, setMessages] = useState<Message[]>(initial);
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const [otherTyping, setOtherTyping] = useState(false);
  const supabase = useRef(createClient()).current;
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const typingTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const scrollDown = () => endRef.current?.scrollIntoView({ behavior: 'smooth' });

  const markRead = async () => {
    await supabase.from('messages').update({ read_status: true })
      .eq('conversation_id', conversationId).eq('receiver_id', me.id).eq('read_status', false);
  };

  useEffect(() => {
    scrollDown();
    markRead();

    const channel = supabase
      .channel(`chat:${conversationId}`)
      .on('postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages', filter: `conversation_id=eq.${conversationId}` },
        (payload) => {
          const m = payload.new as Message;
          setMessages((prev) => (prev.some((x) => x.id === m.id) ? prev : [...prev, m]));
          if (m.receiver_id === me.id) markRead();
        })
      .on('postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'messages', filter: `conversation_id=eq.${conversationId}` },
        (payload) => {
          const m = payload.new as Message;
          setMessages((prev) => prev.map((x) => (x.id === m.id ? m : x)));
        })
      .on('broadcast', { event: 'typing' }, (p) => {
        if (p.payload?.userId === other.id) {
          setOtherTyping(true);
          if (typingTimeout.current) clearTimeout(typingTimeout.current);
          typingTimeout.current = setTimeout(() => setOtherTyping(false), 2500);
        }
      })
      .subscribe();
    channelRef.current = channel;

    return () => { supabase.removeChannel(channel); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationId]);

  useEffect(() => { scrollDown(); }, [messages, otherTyping]);

  const onType = (v: string) => {
    setText(v);
    channelRef.current?.send({ type: 'broadcast', event: 'typing', payload: { userId: me.id } });
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const msg = text.trim();
    if (!msg || sending) return;
    setSending(true);
    setText('');
    const res = await sendMessage({ conversation_id: conversationId, receiver_id: other.id, message: msg });
    if (!res.ok) setText(msg); // restore on failure
    setSending(false);
  };

  const fmt = (ts: string) => new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const lastMine = [...messages].reverse().find((m) => m.sender_id === me.id);

  return (
    <div className="flex flex-col h-[calc(100dvh-9rem)] rounded-2xl bg-card border border-foreground/10 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-foreground/10 bg-muted/30">
        <span className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-blue-600 text-white flex items-center justify-center font-display font-bold">
          {other.name[0]?.toUpperCase() ?? '?'}
        </span>
        <div>
          <p className="font-display font-bold text-foreground leading-tight">{other.name}</p>
          <p className="text-[11px] text-emerald-600 font-medium">{otherTyping ? 'typing…' : 'Secure in-app chat'}</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        <div className="flex justify-center">
          <span className="inline-flex items-center gap-1.5 text-[10px] font-medium text-foreground/40 bg-muted px-2.5 py-1 rounded-full">
            <ShieldCheck size={11} /> Phone numbers are never shared in chat
          </span>
        </div>
        {messages.map((m) => {
          const mine = m.sender_id === me.id;
          return (
            <div key={m.id} className={cn('flex', mine ? 'justify-end' : 'justify-start')}>
              <div className={cn('max-w-[75%] px-3.5 py-2 rounded-2xl text-sm',
                mine ? 'bg-gradient-to-r from-primary to-accent text-white rounded-br-sm'
                     : 'bg-muted text-foreground rounded-bl-sm')}>
                <p className="whitespace-pre-wrap break-words">{m.message}</p>
                <p className={cn('text-[10px] mt-0.5', mine ? 'text-white/70' : 'text-foreground/40')}>{fmt(m.created_at)}</p>
              </div>
            </div>
          );
        })}
        {lastMine && (
          <p className="text-right text-[10px] text-foreground/40 pr-1">{lastMine.read_status ? 'Seen' : 'Delivered'}</p>
        )}
        {otherTyping && (
          <div className="flex justify-start">
            <div className="bg-muted rounded-2xl rounded-bl-sm px-3.5 py-2.5 flex gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-foreground/40 animate-bounce" />
              <span className="w-1.5 h-1.5 rounded-full bg-foreground/40 animate-bounce" style={{ animationDelay: '0.15s' }} />
              <span className="w-1.5 h-1.5 rounded-full bg-foreground/40 animate-bounce" style={{ animationDelay: '0.3s' }} />
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Composer */}
      <form onSubmit={submit} className="p-3 border-t border-foreground/10 flex items-center gap-2">
        <input
          value={text}
          onChange={(e) => onType(e.target.value)}
          placeholder="Type a message…"
          className="flex-1 px-4 py-2.5 rounded-full bg-muted/50 border border-foreground/10 text-sm focus:bg-background focus:border-primary focus:outline-none transition-all"
        />
        <button type="submit" disabled={!text.trim() || sending}
          className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-accent text-white flex items-center justify-center shrink-0 disabled:opacity-50 hover:scale-105 transition-transform cursor-pointer">
          <Send size={17} />
        </button>
      </form>
    </div>
  );
}
