'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, Lock, Eye, EyeOff, LogIn, GraduationCap, Headset, ShieldCheck } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { loginSchema, type LoginInput } from '@/lib/validations';
import { ROLE_HOME } from '@/lib/roles';
import { Button, FieldError, Input, Label } from '@/components/crm/ui';
import { cn } from '@/lib/utils';
import type { UserRole } from '@/lib/database.types';

type Portal = 'student' | 'staff' | 'admin';

const PORTALS: { key: Portal; label: string; role: UserRole; icon: typeof Mail; blurb: string }[] = [
  { key: 'student', label: 'Student', role: 'student', icon: GraduationCap, blurb: 'Access counselling, chat & payments' },
  { key: 'staff', label: 'Staff', role: 'counsellor', icon: Headset, blurb: 'Manage your assigned students' },
  { key: 'admin', label: 'Admin', role: 'super_admin', icon: ShieldCheck, blurb: 'Full control of the platform' },
];

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [portal, setPortal] = useState<Portal>('student');
  const [showPw, setShowPw] = useState(false);
  const [notice, setNotice] = useState('');
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const active = PORTALS.find((p) => p.key === portal)!;

  const onSubmit = async (values: LoginInput) => {
    setNotice('');
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      setNotice('Login is not active yet — Supabase needs to be configured. See CRM_SETUP.md.');
      return;
    }
    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithPassword(values);
    if (error) {
      setNotice(error.message || 'Invalid email or password.');
      return;
    }

    const { data: profile } = await supabase
      .from('users').select('role').eq('id', data.user!.id).single();
    const role = (profile?.role ?? 'student') as UserRole;

    // Admin has access to everything — allowed via any portal.
    // Other roles must use their own portal.
    if (role !== 'super_admin' && role !== active.role) {
      await supabase.auth.signOut();
      const need = PORTALS.find((p) => p.role === role)?.label ?? 'your';
      setNotice(`This is a ${need} account. Please switch to the ${need} portal to sign in.`);
      return;
    }

    router.push(params.get('redirect') || ROLE_HOME[role]);
    router.refresh();
  };

  return (
    <>
      {/* Portal switcher */}
      <div className="grid grid-cols-3 gap-1.5 p-1.5 rounded-2xl bg-muted/50 border border-foreground/10 mb-6">
        {PORTALS.map((p) => {
          const isActive = portal === p.key;
          const Icon = p.icon;
          return (
            <button
              key={p.key}
              type="button"
              onClick={() => { setPortal(p.key); setNotice(''); }}
              className={cn(
                'flex flex-col items-center gap-1 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer',
                isActive ? 'bg-card text-primary shadow-sm border border-foreground/10' : 'text-foreground/55 hover:text-foreground'
              )}
            >
              <Icon size={18} /> {p.label}
            </button>
          );
        })}
      </div>

      <div className="text-center mb-6">
        <h1 className="font-display text-2xl font-extrabold text-foreground tracking-tight">
          {active.label} Login
        </h1>
        <p className="text-sm text-foreground/60 font-medium mt-1">{active.blurb}</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label>Email</Label>
          <div className="relative">
            <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40" />
            <Input type="email" className="pl-9" placeholder="you@email.com" {...register('email')} />
          </div>
          <FieldError>{errors.email?.message}</FieldError>
        </div>

        <div>
          <Label>Password</Label>
          <div className="relative">
            <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40" />
            <Input type={showPw ? 'text' : 'password'} className="pl-9 pr-10" placeholder="••••••••" {...register('password')} />
            <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/40 hover:text-foreground cursor-pointer">
              {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
          <FieldError>{errors.password?.message}</FieldError>
        </div>

        <div className="flex justify-end">
          <Link href="/forgot-password" className="text-xs font-semibold text-primary hover:underline">Forgot password?</Link>
        </div>

        <Button type="submit" loading={isSubmitting} className="w-full">
          <LogIn size={16} /> Sign In as {active.label}
        </Button>

        {notice && (
          <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-600 text-xs font-medium text-center">
            {notice}
          </div>
        )}
      </form>

      {portal === 'student' && (
        <p className="text-center text-sm text-foreground/60 font-medium mt-6">
          New student?{' '}
          <Link href="/register" className="font-semibold text-primary hover:underline">Create an account</Link>
        </p>
      )}
      {portal !== 'student' && (
        <p className="text-center text-[11px] text-foreground/45 font-medium mt-6">
          {portal === 'staff' ? 'Staff accounts are created by the admin.' : 'Authorized personnel only.'}
        </p>
      )}
    </>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
