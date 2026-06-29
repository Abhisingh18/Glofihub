'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Clock, Check } from 'lucide-react';
import { Input, Button } from '@/components/crm/ui';
import { setStudentMinutes } from '@/lib/actions/admin';

const PRESETS = [10, 30, 60];

export function MinutesControl({ studentId, current }: { studentId: string; current: number }) {
  const router = useRouter();
  const [value, setValue] = useState(String(current ?? 0));
  const [pending, start] = useTransition();
  const [done, setDone] = useState(false);
  const [err, setErr] = useState('');

  const save = (mins?: number) => {
    const minutes = mins ?? Number(value);
    setErr(''); setDone(false);
    start(async () => {
      const res = await setStudentMinutes({ student_id: studentId, minutes });
      if (!res.ok) { setErr(res.error || 'Failed'); return; }
      setValue(String(minutes));
      setDone(true);
      router.refresh();
      setTimeout(() => setDone(false), 2000);
    });
  };

  return (
    <div>
      <p className="text-[11px] text-foreground/45 mb-2 flex items-center gap-1.5">
        <Clock size={12} /> Currently granted: <b className="text-foreground">{current} min</b> — granting new minutes resets the clock.
      </p>
      <div className="flex items-center gap-2 flex-wrap">
        {PRESETS.map((m) => (
          <Button key={m} variant="outline" className="text-xs px-3 py-2" onClick={() => save(m)} disabled={pending}>
            {m} min
          </Button>
        ))}
        <Input
          type="number"
          min={0}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-24"
        />
        <Button onClick={() => save()} loading={pending} className="text-xs px-4 py-2">Grant</Button>
        {done && <span className="text-xs font-medium text-emerald-600 flex items-center gap-1"><Check size={14} /> Saved</span>}
      </div>
      {err && <p className="text-[11px] text-rose-600 mt-1">{err}</p>}
    </div>
  );
}
