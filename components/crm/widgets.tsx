import { cn } from '@/lib/utils';
import { STATUS_META, type StudentStatus } from '@/lib/database.types';
import type { LucideIcon } from 'lucide-react';

export function PageHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 mb-6">
      <div>
        <h1 className="font-display text-2xl md:text-3xl font-extrabold text-foreground tracking-tight">{title}</h1>
        {subtitle && <p className="text-sm text-foreground/55 font-medium mt-1">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function StatCard({
  label, value, icon: Icon, accent = 'from-primary to-blue-600',
}: { label: string; value: React.ReactNode; icon: LucideIcon; accent?: string }) {
  return (
    <div className="p-5 rounded-2xl bg-card border border-foreground/10 shadow-sm">
      <div className="flex items-center gap-3">
        <span className={cn('w-11 h-11 rounded-xl bg-gradient-to-br text-white flex items-center justify-center shadow-md shrink-0', accent)}>
          <Icon size={20} />
        </span>
        <div className="min-w-0">
          <p className="font-display text-2xl md:text-3xl font-extrabold text-foreground leading-none truncate">{value}</p>
          <p className="text-xs font-medium text-foreground/55 mt-1">{label}</p>
        </div>
      </div>
    </div>
  );
}

export function StatusBadge({ status }: { status: StudentStatus }) {
  const m = STATUS_META[status];
  return (
    <span className={cn('inline-flex items-center px-2.5 py-1 rounded-full border text-[11px] font-semibold', m.className)}>
      {m.label}
    </span>
  );
}

export function EmptyState({ icon: Icon, title, hint }: { icon: LucideIcon; title: string; hint?: string }) {
  return (
    <div className="py-16 text-center">
      <span className="w-14 h-14 rounded-full bg-muted flex items-center justify-center mx-auto mb-3">
        <Icon size={26} className="text-foreground/30" />
      </span>
      <p className="font-display font-bold text-foreground">{title}</p>
      {hint && <p className="text-sm text-foreground/55 font-medium mt-1">{hint}</p>}
    </div>
  );
}

export function Money({ amount }: { amount: number }) {
  return <>₹{amount.toLocaleString('en-IN')}</>;
}
