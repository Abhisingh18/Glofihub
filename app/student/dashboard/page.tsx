import Link from 'next/link';
import { getMyStudent } from '@/lib/queries';
import { PageHeader, StatusBadge } from '@/components/crm/widgets';
import { Card, Button } from '@/components/crm/ui';
import { UserCheck, MessagesSquare, CreditCard, Sparkles } from 'lucide-react';

/* eslint-disable @typescript-eslint/no-explicit-any */
export default async function StudentDashboard() {
  const student = (await getMyStudent()) as any;
  const counsellor = student?.counsellor;

  return (
    <>
      <PageHeader
        title={`Hi, ${student?.user?.full_name?.split(' ')[0] || 'there'} 👋`}
        subtitle="Your counselling journey"
        action={student && <StatusBadge status={student.status} />}
      />

      <div className="grid md:grid-cols-2 gap-5">
        <Card className="p-6">
          <h3 className="font-display font-bold text-foreground mb-4 flex items-center gap-2"><UserCheck size={18} /> Your Counsellor</h3>
          {counsellor ? (
            <div className="flex items-center gap-4">
              <span className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-blue-600 text-white flex items-center justify-center font-display font-bold text-xl">
                {counsellor.user?.full_name?.[0]?.toUpperCase() ?? '?'}
              </span>
              <div>
                <p className="font-display font-bold text-foreground">{counsellor.user?.full_name}</p>
                <p className="text-sm text-foreground/55">{counsellor.department}</p>
                <Link href="/student/chat"><Button className="mt-2 text-xs px-4 py-2"><MessagesSquare size={14} /> Message</Button></Link>
              </div>
            </div>
          ) : (
            <div className="text-center py-6">
              <Sparkles size={28} className="mx-auto text-foreground/30 mb-2" />
              <p className="text-sm text-foreground/60 font-medium">A counsellor will be assigned to you shortly.</p>
            </div>
          )}
        </Card>

        <Card className="p-6">
          <h3 className="font-display font-bold text-foreground mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            <Link href="/student/chat" className="p-4 rounded-xl bg-muted/40 hover:bg-muted transition-colors text-center">
              <MessagesSquare size={22} className="mx-auto text-primary mb-1.5" />
              <p className="text-sm font-semibold text-foreground">Chat</p>
            </Link>
            <Link href="/student/payments" className="p-4 rounded-xl bg-muted/40 hover:bg-muted transition-colors text-center">
              <CreditCard size={22} className="mx-auto text-primary mb-1.5" />
              <p className="text-sm font-semibold text-foreground">Payments</p>
            </Link>
          </div>
        </Card>
      </div>
    </>
  );
}
