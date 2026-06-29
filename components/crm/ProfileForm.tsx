'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save, CheckCircle2 } from 'lucide-react';
import { Button, FieldError, Input, Label, Select } from '@/components/crm/ui';
import { profileSchema } from '@/lib/validations';
import { updateMyProfile } from '@/lib/actions/student';
import type { z } from 'zod';

type Values = z.infer<typeof profileSchema>;

export function ProfileForm({ defaults }: { defaults: Values }) {
  const router = useRouter();
  const [saved, setSaved] = useState(false);
  const [notice, setNotice] = useState('');
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<Values>({
    resolver: zodResolver(profileSchema),
    defaultValues: defaults,
  });

  const onSubmit = async (values: Values) => {
    setNotice(''); setSaved(false);
    const res = await updateMyProfile(values);
    if (!res.ok) { setNotice(res.error || 'Failed'); return; }
    setSaved(true);
    router.refresh();
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-xl">
      <div><Label>Full name</Label><Input {...register('full_name')} /><FieldError>{errors.full_name?.message}</FieldError></div>
      <div><Label>Phone</Label><Input {...register('phone')} /></div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div><Label>City</Label><Input {...register('city')} /></div>
        <div><Label>Country / course interest</Label><Input {...register('country_interest')} /></div>
      </div>
      <div>
        <Label>Education level</Label>
        <Select {...register('education_level')}>
          <option value="">Select…</option>
          <option>Class 12</option>
          <option>Diploma</option>
          <option>Undergraduate</option>
          <option>Graduate</option>
          <option>Postgraduate</option>
          <option>Other</option>
        </Select>
      </div>
      <div className="flex items-center gap-3">
        <Button type="submit" loading={isSubmitting}><Save size={16} /> Save Changes</Button>
        {saved && <span className="text-sm font-medium text-emerald-600 flex items-center gap-1"><CheckCircle2 size={15} /> Saved</span>}
        {notice && <span className="text-sm text-rose-600">{notice}</span>}
      </div>
    </form>
  );
}
