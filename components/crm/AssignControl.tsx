'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Select, Button } from '@/components/crm/ui';
import { assignStudent } from '@/lib/actions/admin';

interface Props {
  studentId: string;
  current: string | null;
  counsellors: { id: string; full_name: string }[];
}

export function AssignControl({ studentId, current, counsellors }: Props) {
  const router = useRouter();
  const [value, setValue] = useState(current ?? '');
  const [pending, start] = useTransition();
  const [msg, setMsg] = useState('');

  const save = () => {
    if (!value) return;
    setMsg('');
    start(async () => {
      const res = await assignStudent({ student_id: studentId, counsellor_id: value });
      if (!res.ok) setMsg(res.error || 'Failed');
      else { setMsg('Assigned ✓'); router.refresh(); }
    });
  };

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <Select value={value} onChange={(e) => setValue(e.target.value)} className="w-52">
        <option value="">Select counsellor…</option>
        {counsellors.map((c) => <option key={c.id} value={c.id}>{c.full_name}</option>)}
      </Select>
      <Button onClick={save} loading={pending} disabled={!value || value === current}>
        {current ? 'Reassign' : 'Assign'}
      </Button>
      {msg && <span className="text-xs font-medium text-foreground/60">{msg}</span>}
    </div>
  );
}
