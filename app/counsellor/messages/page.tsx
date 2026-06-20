import Link from 'next/link';
import { getStudents } from '@/lib/queries';
import { PageHeader, EmptyState } from '@/components/crm/widgets';
import { Card } from '@/components/crm/ui';
import { MessagesSquare, ChevronRight } from 'lucide-react';

export default async function CounsellorMessages() {
  const students = await getStudents();
  return (
    <>
      <PageHeader title="Messages" subtitle="Chat with your assigned students" />
      {students.length === 0 ? (
        <EmptyState icon={MessagesSquare} title="No conversations yet" hint="Students assigned to you will appear here." />
      ) : (
        <Card className="divide-y divide-foreground/5">
          {students.map((s) => (
            <Link key={s.id} href={`/counsellor/students/${s.id}`}
              className="flex items-center justify-between gap-3 p-4 hover:bg-muted/40 transition-colors">
              <div className="flex items-center gap-3 min-w-0">
                <span className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-blue-600 text-white flex items-center justify-center font-display font-bold text-sm shrink-0">
                  {s.full_name[0]?.toUpperCase() ?? '?'}
                </span>
                <div className="min-w-0">
                  <p className="font-semibold text-foreground truncate">{s.full_name}</p>
                  <p className="text-[11px] text-foreground/50 truncate">{s.country_interest || 'Open chat'}</p>
                </div>
              </div>
              <ChevronRight size={18} className="text-foreground/30" />
            </Link>
          ))}
        </Card>
      )}
    </>
  );
}
