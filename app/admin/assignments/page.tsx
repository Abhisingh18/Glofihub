import { getStudents, getCounsellors } from '@/lib/queries';
import { PageHeader, StatusBadge, EmptyState } from '@/components/crm/widgets';
import { Card } from '@/components/crm/ui';
import { AssignControl } from '@/components/crm/AssignControl';
import { Network } from 'lucide-react';

export default async function AdminAssignments() {
  const [students, counsellors] = await Promise.all([getStudents(), getCounsellors()]);
  const options = counsellors.filter((c) => c.active).map((c) => ({ id: c.id, full_name: c.full_name }));

  return (
    <>
      <PageHeader title="Assignments" subtitle="Assign or reassign students to counsellors" />
      {students.length === 0 ? (
        <EmptyState icon={Network} title="No students to assign yet" />
      ) : (
        <div className="space-y-3">
          {students.map((s) => (
            <Card key={s.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <span className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-blue-600 text-white flex items-center justify-center font-display font-bold text-sm shrink-0">
                  {s.full_name[0]?.toUpperCase() ?? '?'}
                </span>
                <div className="min-w-0">
                  <p className="font-semibold text-foreground truncate">{s.full_name}</p>
                  <p className="text-[11px] text-foreground/50 truncate">{s.country_interest || '—'} · <StatusBadge status={s.status} /></p>
                </div>
              </div>
              <AssignControl studentId={s.id} current={s.counsellor_id} counsellors={options} />
            </Card>
          ))}
        </div>
      )}
    </>
  );
}
