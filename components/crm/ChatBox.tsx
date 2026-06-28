'use client';

import { useEffect, useRef, useState } from 'react';
import { Send, ShieldCheck } from 'lucide-react';
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
  const endRef = useRef<HTMLDivElement>(null);

  const scrollDown = () => endRef.current?.scrollIntoView({ behavior: 'smooth' });

  const load = async () => {
    try {
      const res = await fetch(`/api/chat/messages?conversationId=${conversationId}`, { cache: 'no-store' });
      const data = await res.json();
      if (Array.isArray(data.items)) setMessages(data.items);
    } catch {
      /* ignore */
    }
  };

  useEffect(() => {
    scrollDown();
    const t = setInterval(load, 3000); // poll every 3s
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationId]);

  useEffect(() => { scrollDown(); }, [messages]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const msg = text.trim();
    if (!msg || sending) return;
    setSending(true);
    setText('');
    // Optimistic append
    const optimistic: Message = {
      id: `tmp-${Date.now()}`, conversation_id: conversationId, sender_id: me.id,
      receiver_id: other.id, message: msg, read_status: false, created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimistic]);
    const res = await sendMessage({ conversation_id: conversationId, receiver_id: other.id, message: msg });
    if (!res.ok) { setText(msg); setMessages((prev) => prev.filter((m) => m.id !== optimistic.id)); }
    else load();
    setSending(false);
  };

  const fmt = (ts: string) => new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const lastMine = [...messages].reverse().find((m) => m.sender_id === me.id);

  return (
    <div className="flex flex-col h-[calc(100dvh-9rem)] rounded-2xl bg-card border border-foreground/10 shadow-sm overflow-hidden">
      <div className="flex items-center gap-3 px-4 py-3 border-b border-foreground/10 bg-muted/30">
        <span className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-blue-600 text-white flex items-center justify-center font-display font-bold">
          {other.name[0]?.toUpperCase() ?? '?'}
        </span>
        <div>
          <p className="font-display font-bold text-foreground leading-tight">{other.name}</p>
          <p className="text-[11px] text-emerald-600 font-medium">Secure in-app chat</p>
        </div>
      </div>

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
        <div ref={endRef} />
      </div>

      <form onSubmit={submit} className="p-3 border-t border-foreground/10 flex items-center gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
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
