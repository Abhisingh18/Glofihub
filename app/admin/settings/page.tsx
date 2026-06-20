import { requireRole } from '@/lib/auth';
import { PageHeader } from '@/components/crm/widgets';
import { Card } from '@/components/crm/ui';
import { ShieldCheck, Mail, Database } from 'lucide-react';
import { isSupabaseConfigured } from '@/lib/supabase';

export default async function AdminSettings() {
  const user = await requireRole('super_admin');
  return (
    <>
      <PageHeader title="Settings" subtitle="Account & platform configuration" />
      <div className="grid md:grid-cols-2 gap-5">
        <Card className="p-5">
          <h3 className="font-display font-bold text-foreground mb-4">Admin Account</h3>
          <div className="space-y-3 text-sm">
            <p className="flex items-center gap-2 text-foreground/70"><ShieldCheck size={15} className="text-foreground/40" /> {user.full_name}</p>
            <p className="flex items-center gap-2 text-foreground/70"><Mail size={15} className="text-foreground/40" /> {user.email}</p>
          </div>
        </Card>
        <Card className="p-5">
          <h3 className="font-display font-bold text-foreground mb-4">Platform</h3>
          <div className="space-y-3 text-sm">
            <p className="flex items-center gap-2 text-foreground/70">
              <Database size={15} className="text-foreground/40" />
              Supabase: {isSupabaseConfigured ? <span className="text-emerald-600 font-semibold">Connected</span> : <span className="text-rose-600 font-semibold">Not configured</span>}
            </p>
            <p className="text-foreground/50 text-xs">Manage counsellors, students, payments and assignments from the sidebar.</p>
          </div>
        </Card>
      </div>
    </>
  );
}
