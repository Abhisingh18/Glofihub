import { Inbox, Sparkles, CalendarClock, Megaphone } from 'lucide-react';
import { sql } from '@/lib/pg';
import { PageHeader, StatCard, EmptyState } from '@/components/crm/widgets';
import { Card } from '@/components/crm/ui';
import { LeadsTable, type LeadRow } from '@/components/crm/LeadsTable';

// Phone numbers are shown here, so this page stays admin-only (enforced by app/admin/layout.tsx).

type RawLead = Omit<LeadRow, 'created_at'> & { created_at: Date | string };

interface Stats {
  total: number;
  new_count: number;
  week_count: number;
}

async function loadLeads() {
  const [rows, stats, top] = await Promise.all([
    sql<RawLead>(`select * from leads order by created_at desc limit 500`),
    sql<Stats>(
      `select count(*)::int as total,
              count(*) filter (where status = 'new')::int as new_count,
              count(*) filter (where created_at >= now() - interval '7 days')::int as week_count
       from leads`
    ),
    sql<{ requirement: string; n: number }>(
      `select requirement, count(*)::int as n from leads group by requirement order by n desc, requirement limit 1`
    ),
  ]);

  const leads: LeadRow[] = rows.map((r) => ({
    ...r,
    // Plain strings cross the server → client boundary cleanly.
    created_at: r.created_at instanceof Date ? r.created_at.toISOString() : String(r.created_at),
  }));
  return { leads, stats: stats[0] ?? { total: 0, new_count: 0, week_count: 0 }, top: top[0] ?? null };
}

export default async function AdminLeads() {
  let data: Awaited<ReturnType<typeof loadLeads>> | null = null;
  let tableMissing = false;

  try {
    data = await loadLeads();
  } catch (err) {
    // 42P01 = undefined_table: the schema hasn't been applied yet.
    tableMissing = (err as { code?: string } | null)?.code === '42P01';
  }

  if (!data) {
    return (
      <>
        <PageHeader title="Leads" subtitle="Enquiries from the website contact form" />
        <Card>
          <EmptyState
            icon={Inbox}
            title={tableMissing ? 'The leads table has not been created yet' : 'Leads could not be loaded'}
            hint={
              tableMissing
                ? 'Run /api/setup once to create the leads table. New website enquiries will appear here after that.'
                : 'Run /api/setup once to create the leads table if you have not already, then check the database connection and refresh.'
            }
          />
        </Card>
      </>
    );
  }

  const { leads, stats, top } = data;

  return (
    <>
      <PageHeader title="Leads" subtitle={`${stats.total} total · enquiries from the website contact form`} />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total leads" value={stats.total} icon={Inbox} />
        <StatCard label="New (not yet contacted)" value={stats.new_count} icon={Sparkles} accent="from-sky-500 to-cyan-500" />
        <StatCard label="Received this week" value={stats.week_count} icon={CalendarClock} accent="from-emerald-500 to-teal-500" />
        <StatCard
          label={top ? `Top requirement: ${top.requirement}` : 'Top requirement'}
          value={top ? top.n : '—'}
          icon={Megaphone}
          accent="from-amber-500 to-orange-500"
        />
      </div>

      <LeadsTable leads={leads} total={stats.total} />
    </>
  );
}
