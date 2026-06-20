'use client';

import { useEffect, useRef, useState } from 'react';
import { Bell } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import type { Notification } from '@/lib/database.types';

export function NotificationBell({ userId }: { userId: string }) {
  const [items, setItems] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const supabase = useRef(createClient()).current;

  const unread = items.filter((n) => !n.read).length;

  const load = async () => {
    const { data } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(20);
    setItems((data as Notification[]) ?? []);
  };

  useEffect(() => {
    load();
    const channel = supabase
      .channel(`notifications:${userId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${userId}` },
        (payload) => setItems((prev) => [payload.new as Notification, ...prev])
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const toggle = async () => {
    const next = !open;
    setOpen(next);
    if (next && unread > 0) {
      await supabase.from('notifications').update({ read: true }).eq('user_id', userId).eq('read', false);
      setItems((prev) => prev.map((n) => ({ ...n, read: true })));
    }
  };

  const fmt = (ts: string) =>
    new Date(ts).toLocaleString([], { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });

  return (
    <div className="relative" ref={ref}>
      <button onClick={toggle} className="relative p-2 rounded-lg hover:bg-muted transition-colors cursor-pointer" aria-label="Notifications">
        <Bell size={19} className="text-foreground/70" />
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-4 h-4 px-1 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto rounded-2xl bg-card border border-foreground/10 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="px-4 py-3 border-b border-foreground/10">
            <p className="font-display font-bold text-sm text-foreground">Notifications</p>
          </div>
          {items.length === 0 ? (
            <p className="p-6 text-center text-sm text-foreground/50 font-medium">No notifications yet</p>
          ) : (
            <ul className="divide-y divide-foreground/5">
              {items.map((n) => (
                <li key={n.id} className="px-4 py-3 hover:bg-muted/50 transition-colors">
                  <p className="text-sm font-semibold text-foreground">{n.title}</p>
                  {n.body && <p className="text-xs text-foreground/60 mt-0.5">{n.body}</p>}
                  <p className="text-[10px] text-foreground/40 font-medium mt-1">{fmt(n.created_at)}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
