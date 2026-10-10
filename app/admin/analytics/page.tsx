import Link from 'next/link';
import { sql } from '@/lib/pg';
import { PageHeader, EmptyState } from '@/components/crm/widgets';
import { Card } from '@/components/crm/ui';
import { Activity } from 'lucide-react';
import { cn } from '@/lib/utils';

type Row = { id: string; activity: string; created_at: string; full_name: string | null; role: string | null };

// "Activity" tabs: what students did, what staff did, what administrators did.
const FILTERS = [
  { key: 'all', label: 'All activity', role: null },
  { key: 'staff', label: 'Staff', role: 'counsellor' },
  { key: 'students', label: 'Students', role: 'student' },
  { key: 'admin', label: 'Admin', role: 'super_admin' },
] as const;

const ROLE_LABEL: Record<string, { label: string; className: string }> = {
  counsellor: { label: 'Staff', className: 'bg-violet-500/15 text-violet-600' },
  student: { label: 'Student', className: 'bg-sky-500/15 text-sky-600' },
  super_admin: { label: 'Admin', className: 'bg-amber-500/15 text-amber-600' },
};

export default async function AdminAnalytics({ searchParams }: { searchParams: Promise<{ view?: string }> }) {
  const { view } = await searchParams;
  const current = FILTERS.find((f) => f.key === view) ?? FILTERS[0];

  const logs = await sql<Row>(
    `select a.id, a.activity, a.created_at, u.full_name, u.role
     from activity_logs a
     left join users u on u.id = a.user_id
     ${current.role ? 'where u.role = $1' : ''}
     order by a.created_at desc limit 200`,
    current.role ? [current.role] : []
  );

  const fmt = (ts: string) =>
    new Date(ts).toLocaleString([], { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

  return (
    <>
      <PageHeader title="Activity & Audit" subtitle="Everything students, staff and administrators have done on the platform" />

      <nav aria-label="Activity filter" className="mb-4 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <Link
            key={f.key}
            href={f.key === 'all' ? '/admin/analytics' : `/admin/analytics?view=${f.key}`}
            aria-current={current.key === f.key ? 'true' : undefined}
            className={cn(
              'rounded-full border px-4 py-1.5 text-xs font-semibold transition-colors',
              current.key === f.key ? 'border-primary bg-primary/10 text-primary' : 'border-foreground/15 text-foreground/60 hover:border-primary/40'
            )}
          >
            {f.label}
          </Link>
        ))}
      </nav>

      <Card className="p-5">
        <h3 className="mb-4 flex items-center gap-2 font-display font-bold text-foreground">
          <Activity size={16} aria-hidden /> {current.label} <span className="text-xs font-medium text-foreground/40">(latest {logs.length})</span>
        </h3>
        {logs.length === 0 ? (
          <EmptyState icon={Activity} title="No activity recorded yet" />
        ) : (
          <ul className="space-y-3">
            {logs.map((l) => {
              const role = l.role ? ROLE_LABEL[l.role] : null;
              return (
                <li key={l.id} className="flex gap-3 text-sm">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden />
                  <div>
                    <p className="text-foreground/80">
                      <span className="font-semibold text-foreground">{l.full_name ?? 'System'}</span>
                      {role && <span className={cn('ml-2 rounded-full px-2 py-0.5 text-[10px] font-semibold', role.className)}>{role.label}</span>}
                      {' — '}
                      {l.activity}
                    </p>
                    <p className="text-[10px] text-foreground/40">{fmt(l.created_at)}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </Card>
    </>
  );
}
