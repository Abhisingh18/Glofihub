'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Search, Users } from 'lucide-react';
import { StatusBadge, EmptyState } from '@/components/crm/widgets';
import { Input, Select } from '@/components/crm/ui';
import { STUDENT_STATUSES, STATUS_META, type StudentStatus } from '@/lib/database.types';
import type { StudentRow } from '@/lib/queries';

export function StudentsTable({ students, basePath }: { students: StudentRow[]; basePath: string }) {
  const [q, setQ] = useState('');
  const [status, setStatus] = useState<'all' | StudentStatus>('all');

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return students.filter((s) => {
      if (status !== 'all' && s.status !== status) return false;
      if (!query) return true;
      return [s.full_name, s.email, s.city, s.country_interest, s.counsellor_name]
        .filter(Boolean).some((v) => v!.toLowerCase().includes(query));
    });
  }, [students, q, status]);

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40" />
          <Input className="pl-9" placeholder="Search name, email, city…" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <Select className="sm:w-52" value={status} onChange={(e) => setStatus(e.target.value as StudentStatus | 'all')}>
          <option value="all">All statuses</option>
          {STUDENT_STATUSES.map((s) => <option key={s} value={s}>{STATUS_META[s].label}</option>)}
        </Select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={Users} title="No students found" hint="Try a different search or filter." />
      ) : (
        <div className="rounded-2xl bg-card border border-foreground/10 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[11px] uppercase tracking-wide text-foreground/45 border-b border-foreground/10">
                  <th className="px-4 py-3 font-semibold">Student</th>
                  <th className="px-4 py-3 font-semibold">Interest</th>
                  <th className="px-4 py-3 font-semibold">Counsellor</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-foreground/5">
                {filtered.map((s) => (
                  <tr key={s.id} className="hover:bg-muted/40 transition-colors">
                    <td className="px-4 py-3">
                      <Link href={`${basePath}/students/${s.id}`} className="flex items-center gap-3 group">
                        <span className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-blue-600 text-white flex items-center justify-center font-display font-bold text-xs shrink-0">
                          {s.full_name?.[0]?.toUpperCase() ?? '?'}
                        </span>
                        <span className="min-w-0">
                          <span className="block font-semibold text-foreground group-hover:text-primary transition-colors truncate">{s.full_name}</span>
                          <span className="block text-[11px] text-foreground/45 truncate">{s.email}</span>
                        </span>
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-foreground/70">{s.country_interest || '—'}{s.city ? ` · ${s.city}` : ''}</td>
                    <td className="px-4 py-3 text-foreground/70">{s.counsellor_name || <span className="text-foreground/35">Unassigned</span>}</td>
                    <td className="px-4 py-3"><StatusBadge status={s.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
