'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { UserPlus, Power, Trash2, Mail, Users as UsersIcon } from 'lucide-react';
import { Button, Card, FieldError, Input, Label } from '@/components/crm/ui';
import { counsellorSchema, type CounsellorInput } from '@/lib/validations';
import { createCounsellor, setCounsellorActive, deleteCounsellor } from '@/lib/actions/admin';
import type { CounsellorRow } from '@/lib/queries';

export function CounsellorsManager({ counsellors }: { counsellors: CounsellorRow[] }) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [notice, setNotice] = useState('');
  const [pending, start] = useTransition();
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<CounsellorInput>({
    resolver: zodResolver(counsellorSchema),
  });

  const onCreate = async (values: CounsellorInput) => {
    setNotice('');
    const res = await createCounsellor(values);
    if (!res.ok) { setNotice(res.error || 'Failed'); return; }
    reset(); setShowForm(false); router.refresh();
  };

  const toggle = (id: string, active: boolean) =>
    start(async () => { await setCounsellorActive(id, !active); router.refresh(); });

  const remove = (id: string) => {
    if (!confirm('Delete this counsellor? Their account will be removed.')) return;
    start(async () => { await deleteCounsellor(id); router.refresh(); });
  };

  return (
    <div className="space-y-5">
      <div className="flex justify-end">
        <Button onClick={() => setShowForm((v) => !v)}><UserPlus size={16} /> {showForm ? 'Close' : 'Add Counsellor'}</Button>
      </div>

      {showForm && (
        <Card className="p-5">
          <h3 className="font-display font-bold text-foreground mb-4">New Counsellor</h3>
          <form onSubmit={handleSubmit(onCreate)} className="grid sm:grid-cols-2 gap-3.5">
            <div><Label>Full name</Label><Input {...register('full_name')} /><FieldError>{errors.full_name?.message}</FieldError></div>
            <div><Label>Department</Label><Input placeholder="e.g. MBBS Abroad" {...register('department')} /><FieldError>{errors.department?.message}</FieldError></div>
            <div><Label>Email</Label><Input type="email" {...register('email')} /><FieldError>{errors.email?.message}</FieldError></div>
            <div><Label>Phone</Label><Input {...register('phone')} /></div>
            <div className="sm:col-span-2"><Label>Temporary password</Label><Input type="text" {...register('password')} /><FieldError>{errors.password?.message}</FieldError></div>
            <div className="sm:col-span-2 flex items-center gap-3">
              <Button type="submit" loading={isSubmitting}>Create Counsellor</Button>
              {notice && <span className="text-xs font-medium text-rose-600">{notice}</span>}
            </div>
          </form>
        </Card>
      )}

      {counsellors.length === 0 ? (
        <Card className="p-10 text-center text-sm text-foreground/50">No counsellors yet. Add your first one.</Card>
      ) : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {counsellors.map((c) => (
            <Card key={c.id} className="p-5">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="w-11 h-11 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-600 text-white flex items-center justify-center font-display font-bold shrink-0">
                    {c.full_name[0]?.toUpperCase()}
                  </span>
                  <div className="min-w-0">
                    <p className="font-display font-bold text-foreground truncate">{c.full_name}</p>
                    <p className="text-[11px] text-foreground/50">{c.department}</p>
                  </div>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${c.active ? 'bg-emerald-500/15 text-emerald-600' : 'bg-foreground/10 text-foreground/50'}`}>
                  {c.active ? 'Active' : 'Inactive'}
                </span>
              </div>

              <div className="mt-3 space-y-1.5 text-sm text-foreground/65">
                <p className="flex items-center gap-2"><Mail size={14} className="text-foreground/40" /> <span className="truncate">{c.email}</span></p>
                <p className="flex items-center gap-2"><UsersIcon size={14} className="text-foreground/40" /> {c.student_count} students</p>
              </div>

              <div className="mt-4 flex gap-2">
                <Button variant="outline" onClick={() => toggle(c.id, c.active)} disabled={pending} className="text-xs px-3 py-2">
                  <Power size={14} /> {c.active ? 'Deactivate' : 'Activate'}
                </Button>
                <Button variant="danger" onClick={() => remove(c.id)} disabled={pending} className="text-xs px-3 py-2">
                  <Trash2 size={14} />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
