'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Select } from '@/components/crm/ui';
import { Loader2 } from 'lucide-react';
import { STUDENT_STATUSES, STATUS_META, type StudentStatus } from '@/lib/database.types';

interface Props {
  studentId: string;
  current: StudentStatus;
  action: (input: { student_id: string; status: StudentStatus }) => Promise<{ ok: boolean; error?: string }>;
}

export function StatusChanger({ studentId, current, action }: Props) {
  const router = useRouter();
  const [value, setValue] = useState<StudentStatus>(current);
  const [pending, start] = useTransition();
  const [err, setErr] = useState('');

  const onChange = (next: StudentStatus) => {
    setValue(next);
    setErr('');
    start(async () => {
      const res = await action({ student_id: studentId, status: next });
      if (!res.ok) { setErr(res.error || 'Failed'); setValue(current); }
      else router.refresh();
    });
  };

  return (
    <div>
      <div className="flex items-center gap-2">
        <Select value={value} onChange={(e) => onChange(e.target.value as StudentStatus)} disabled={pending} className="w-44">
          {STUDENT_STATUSES.map((s) => <option key={s} value={s}>{STATUS_META[s].label}</option>)}
        </Select>
        {pending && <Loader2 size={16} className="animate-spin text-foreground/50" />}
      </div>
      {err && <p className="text-[11px] text-rose-600 mt-1">{err}</p>}
    </div>
  );
}
