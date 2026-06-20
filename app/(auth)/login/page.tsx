'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, Lock, Eye, EyeOff, LogIn } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { loginSchema, type LoginInput } from '@/lib/validations';
import { ROLE_HOME } from '@/lib/roles';
import { Button, FieldError, Input, Label } from '@/components/crm/ui';
import type { UserRole } from '@/lib/database.types';

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [showPw, setShowPw] = useState(false);
  const [notice, setNotice] = useState('');
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (values: LoginInput) => {
    setNotice('');
    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithPassword(values);
    if (error) {
      setNotice(error.message || 'Invalid email or password.');
      return;
    }
    // Resolve role and route accordingly.
    const { data: profile } = await supabase
      .from('users').select('role').eq('id', data.user!.id).single();
    const role = (profile?.role ?? 'student') as UserRole;
    router.push(params.get('redirect') || ROLE_HOME[role]);
    router.refresh();
  };

  return (
    <>
      <div className="text-center mb-7">
        <h1 className="font-display text-2xl font-extrabold text-foreground tracking-tight">Welcome back</h1>
        <p className="text-sm text-foreground/60 font-medium mt-1">Sign in to your GlofiHub account</p>
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
          <LogIn size={16} /> Sign In
        </Button>

        {notice && (
          <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-600 text-xs font-medium text-center">
            {notice}
          </div>
        )}
      </form>

      <p className="text-center text-sm text-foreground/60 font-medium mt-6">
        New student?{' '}
        <Link href="/register" className="font-semibold text-primary hover:underline">Create an account</Link>
      </p>
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
