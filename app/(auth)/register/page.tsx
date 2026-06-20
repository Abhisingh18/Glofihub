'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { User, Mail, Phone, Lock, MapPin, Globe, GraduationCap, UserPlus, CheckCircle2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { registerSchema, type RegisterInput } from '@/lib/validations';
import { Button, FieldError, Input, Label, Select } from '@/components/crm/ui';

export default function RegisterPage() {
  const router = useRouter();
  const [notice, setNotice] = useState('');
  const [done, setDone] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (values: RegisterInput) => {
    setNotice('');
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      setNotice('Sign-up is not active yet — Supabase needs to be configured. See CRM_SETUP.md.');
      return;
    }
    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
      options: {
        data: {
          full_name: values.full_name,
          phone: values.phone,
          role: 'student',
          city: values.city,
          country_interest: values.country_interest,
          education_level: values.education_level,
        },
      },
    });
    if (error) {
      setNotice(error.message);
      return;
    }
    // If email confirmation is disabled, a session exists → go straight in.
    if (data.session) {
      router.push('/student/dashboard');
      router.refresh();
    } else {
      setDone(true);
    }
  };

  if (done) {
    return (
      <div className="text-center">
        <span className="w-16 h-16 rounded-full bg-emerald-500/15 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 size={34} className="text-emerald-600" />
        </span>
        <h1 className="font-display text-xl font-extrabold text-foreground">Check your email</h1>
        <p className="text-sm text-foreground/60 font-medium mt-2">
          We&apos;ve sent a confirmation link. Verify your email, then sign in.
        </p>
        <Link href="/login"><Button className="mt-6 w-full">Go to Login</Button></Link>
      </div>
    );
  }

  return (
    <>
      <div className="text-center mb-7">
        <h1 className="font-display text-2xl font-extrabold text-foreground tracking-tight">Create your account</h1>
        <p className="text-sm text-foreground/60 font-medium mt-1">Start your counselling journey with GlofiHub</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5">
        <div>
          <Label>Full name</Label>
          <div className="relative">
            <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40" />
            <Input className="pl-9" placeholder="Your name" {...register('full_name')} />
          </div>
          <FieldError>{errors.full_name?.message}</FieldError>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>Email</Label>
            <div className="relative">
              <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40" />
              <Input type="email" className="pl-9" placeholder="Email" {...register('email')} />
            </div>
            <FieldError>{errors.email?.message}</FieldError>
          </div>
          <div>
            <Label>Phone</Label>
            <div className="relative">
              <Phone size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40" />
              <Input className="pl-9" placeholder="Phone" {...register('phone')} />
            </div>
            <FieldError>{errors.phone?.message}</FieldError>
          </div>
        </div>

        <div>
          <Label>Password</Label>
          <div className="relative">
            <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40" />
            <Input type="password" className="pl-9" placeholder="Create a password" {...register('password')} />
          </div>
          <FieldError>{errors.password?.message}</FieldError>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>City</Label>
            <div className="relative">
              <MapPin size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40" />
              <Input className="pl-9" placeholder="City" {...register('city')} />
            </div>
          </div>
          <div>
            <Label>Interested in</Label>
            <div className="relative">
              <Globe size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40" />
              <Input className="pl-9" placeholder="e.g. Russia MBBS" {...register('country_interest')} />
            </div>
          </div>
        </div>

        <div>
          <Label>Education level</Label>
          <div className="relative">
            <GraduationCap size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40 z-10" />
            <Select className="pl-9" {...register('education_level')}>
              <option value="">Select…</option>
              <option>Class 12</option>
              <option>Diploma</option>
              <option>Undergraduate</option>
              <option>Graduate</option>
              <option>Postgraduate</option>
            </Select>
          </div>
        </div>

        <Button type="submit" loading={isSubmitting} className="w-full">
          <UserPlus size={16} /> Create Account
        </Button>

        {notice && (
          <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-600 text-xs font-medium text-center">
            {notice}
          </div>
        )}
      </form>

      <p className="text-center text-sm text-foreground/60 font-medium mt-5">
        Already have an account?{' '}
        <Link href="/login" className="font-semibold text-primary hover:underline">Sign in</Link>
      </p>
    </>
  );
}
