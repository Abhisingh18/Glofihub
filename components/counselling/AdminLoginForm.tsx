'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Eye, EyeOff, Lock, Mail, ShieldCheck } from 'lucide-react';
import { adminSignIn } from '@/lib/actions/auth';
import { loginSchema, type LoginInput } from '@/lib/validations';
import { ROLE_HOME } from '@/lib/roles';
import { Button, FieldError, Input, Label } from '@/components/crm/ui';
import type { UserRole } from '@/lib/database.types';

/** Where to go after signing in: only /admin paths are honoured (no open redirects). */
function safeAdminRedirect(raw: string | null): string {
  return raw && raw.startsWith('/admin') && !raw.startsWith('//') ? raw : '/admin/dashboard';
}

function Form({ signedInAs }: { signedInAs: UserRole | null }) {
  const router = useRouter();
  const params = useSearchParams();
  const [showPw, setShowPw] = useState(false);
  const [notice, setNotice] = useState('');
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (values: LoginInput) => {
    setNotice('');
    const res = await adminSignIn(values);
    if (!res.ok) {
      setNotice(res.error || 'Invalid email or password.');
      return;
    }
    router.push(safeAdminRedirect(params.get('redirect')));
    router.refresh();
  };

  return (
    <>
      <div className="mb-7 text-center">
        <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent text-white shadow-lg shadow-primary/30">
          <ShieldCheck size={26} aria-hidden />
        </span>
        <h1 className="font-display text-2xl font-extrabold tracking-tight text-foreground">Admin Portal</h1>
        <p className="mt-1 text-sm font-medium text-foreground/60">GlofiHub Counselling — administrators only</p>
      </div>

      {signedInAs && (
        <div role="status" className="mb-5 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs font-medium text-amber-800 dark:text-amber-300">
          You are signed in with a {signedInAs === 'student' ? 'student' : 'staff'} account. This portal is for administrators —{' '}
          <Link href={ROLE_HOME[signedInAs]} className="font-semibold underline">
            go to your dashboard
          </Link>
          .
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <div>
          <Label htmlFor="admin-email">Admin email</Label>
          <div className="relative">
            <Mail size={15} aria-hidden className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40" />
            <Input id="admin-email" type="email" autoComplete="username" className="pl-9" placeholder="admin@glofihub.com" {...register('email')} />
          </div>
          <FieldError>{errors.email?.message}</FieldError>
        </div>

        <div>
          <Label htmlFor="admin-password">Password</Label>
          <div className="relative">
            <Lock size={15} aria-hidden className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40" />
            <Input
              id="admin-password"
              type={showPw ? 'text' : 'password'}
              autoComplete="current-password"
              className="pl-9 pr-10"
              placeholder="••••••••"
              {...register('password')}
            />
            <button
              type="button"
              onClick={() => setShowPw((v) => !v)}
              aria-label={showPw ? 'Hide password' : 'Show password'}
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-foreground/40 hover:text-foreground"
            >
              {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
          <FieldError>{errors.password?.message}</FieldError>
        </div>

        <Button type="submit" loading={isSubmitting} className="w-full">
          <ShieldCheck size={16} /> Sign in to Admin Portal
        </Button>

        <div role="alert" aria-live="assertive">
          {notice && (
            <div className="rounded-xl border border-rose-500/30 bg-rose-500/15 p-3 text-center text-xs font-medium text-rose-600">{notice}</div>
          )}
        </div>
      </form>

      <p className="mt-6 text-center text-[11px] font-medium text-foreground/45">Authorized personnel only. Activity is logged.</p>
    </>
  );
}

/** Full-page admin sign-in (no site navbar/footer). The page itself checks the role again on the server. */
export function AdminLoginForm({ signedInAs }: { signedInAs: UserRole | null }) {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#070b1f] p-4 text-white">
      <div aria-hidden className="absolute inset-0 bg-gradient-to-br from-[#0a1e5e] via-[#0b1533] to-[#0a0f2b]" />
      <div aria-hidden className="pointer-events-none absolute -left-24 -top-32 h-[30rem] w-[30rem] animate-aurora rounded-full bg-accent/30 blur-[120px]" />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-32 right-0 h-[28rem] w-[28rem] animate-aurora rounded-full bg-violet-600/25 blur-[120px]"
        style={{ animationDelay: '2.5s' }}
      />

      <div className="relative w-full max-w-md">
        <Link
          href="/counselling"
          className="mb-4 inline-flex items-center gap-2 rounded text-sm font-medium text-white/65 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          <ArrowLeft size={16} aria-hidden /> Back to GlofiHub Counselling
        </Link>
        <div className="rounded-3xl border border-white/10 bg-card p-7 text-foreground shadow-2xl sm:p-9">
          <Suspense>
            <Form signedInAs={signedInAs} />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
