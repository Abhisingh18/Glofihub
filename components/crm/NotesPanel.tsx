'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { StickyNote, Plus } from 'lucide-react';
import { Button, Textarea } from '@/components/crm/ui';
import { addNote } from '@/lib/actions/counsellor';
import type { Note } from '@/lib/database.types';

export function NotesPanel({ studentId, notes }: { studentId: string; notes: Note[] }) {
  const router = useRouter();
  const [text, setText] = useState('');
  const [pending, start] = useTransition();
  const [err, setErr] = useState('');

  const save = () => {
    if (!text.trim()) return;
    setErr('');
    start(async () => {
      const res = await addNote({ student_id: studentId, note: text.trim() });
      if (!res.ok) setErr(res.error || 'Failed');
      else { setText(''); router.refresh(); }
    });
  };

  const fmt = (ts: string) => new Date(ts).toLocaleString([], { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });

  return (
    <div>
      <h3 className="font-display font-bold text-foreground mb-3 flex items-center gap-2"><StickyNote size={16} /> Private Notes</h3>
      <p className="text-[11px] text-foreground/45 mb-3">Visible only to you and the admin — never the student.</p>
      <div className="space-y-2 mb-4">
        <Textarea rows={3} value={text} onChange={(e) => setText(e.target.value)} placeholder="Add a note about this student…" />
        <div className="flex items-center gap-3">
          <Button onClick={save} loading={pending} className="text-xs px-4 py-2"><Plus size={14} /> Add Note</Button>
          {err && <span className="text-[11px] text-rose-600">{err}</span>}
        </div>
      </div>
      {notes.length === 0 ? (
        <p className="text-sm text-foreground/45">No notes yet.</p>
      ) : (
        <ul className="space-y-2.5">
          {notes.map((n) => (
            <li key={n.id} className="text-sm bg-muted/40 rounded-lg p-3">
              <p className="text-foreground/80 whitespace-pre-wrap">{n.note}</p>
              <p className="text-[10px] text-foreground/40 mt-1">{fmt(n.created_at)}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
