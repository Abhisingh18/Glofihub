import { createClient } from '@/lib/supabase/server';
import { PageHeader, EmptyState } from '@/components/crm/widgets';
import { Card } from '@/components/crm/ui';
import { Activity } from 'lucide-react';
import type { ActivityLog } from '@/lib/database.types';

/* eslint-disable @typescript-eslint/no-explicit-any */
export default async function AdminAnalytics() {
  const supabase = await createClient();
  const { data } = await supabase
    .from('activity_logs')
    .select(`*, user:users!activity_logs_user_id_fkey ( full_name )`)
    .order('created_at', { ascending: false })
    .limit(100);
  const logs = (data as (ActivityLog & { user?: { full_name: string } })[]) ?? [];

  const fmt = (ts: string) => new Date(ts).toLocaleString([], { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

  return (
    <>
      <PageHeader title="Analytics & Audit" subtitle="Complete activity trail across the platform" />
      <Card className="p-5">
        <h3 className="font-display font-bold text-foreground mb-4 flex items-center gap-2"><Activity size={16} /> Audit Trail</h3>
        {logs.length === 0 ? (
          <EmptyState icon={Activity} title="No activity recorded yet" />
        ) : (
          <ul className="space-y-3">
            {logs.map((l) => (
              <li key={l.id} className="flex gap-3 text-sm">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                <div>
                  <p className="text-foreground/80">
                    <span className="font-semibold text-foreground">{l.user?.full_name ?? 'System'}</span> — {l.activity}
                  </p>
                  <p className="text-[10px] text-foreground/40">{fmt(l.created_at)}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </>
  );
}
