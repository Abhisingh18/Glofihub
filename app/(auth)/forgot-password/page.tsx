'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, Send, CheckCircle2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { forgotSchema, type ForgotInput } from '@/lib/validations';
import { Button, FieldError, Input, Label } from '@/components/crm/ui';

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  const [notice, setNotice] = useState('');
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ForgotInput>({
    resolver: zodResolver(forgotSchema),
  });

  const onSubmit = async (values: ForgotInput) => {
    setNotice('');
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      setNotice('This is not active yet — Supabase needs to be configured. See CRM_SETUP.md.');
      return;
    }
    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(values.email, {
      redirectTo: `${window.location.origin}/login`,
    });
    if (error) { setNotice(error.message); return; }
    setSent(true);
  };

  if (sent) {
    return (
      <div className="text-center">
        <span className="w-16 h-16 rounded-full bg-emerald-500/15 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 size={34} className="text-emerald-600" />
        </span>
        <h1 className="font-display text-xl font-extrabold text-foreground">Reset link sent</h1>
        <p className="text-sm text-foreground/60 font-medium mt-2">
          Check your inbox for a password-reset link.
        </p>
        <Link href="/login"><Button className="mt-6 w-full">Back to Login</Button></Link>
      </div>
    );
  }

  return (
    <>
      <div className="text-center mb-7">
        <h1 className="font-display text-2xl font-extrabold text-foreground tracking-tight">Forgot password?</h1>
        <p className="text-sm text-foreground/60 font-medium mt-1">We&apos;ll email you a reset link</p>
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

        <Button type="submit" loading={isSubmitting} className="w-full">
          <Send size={16} /> Send Reset Link
        </Button>

        {notice && (
          <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-600 text-xs font-medium text-center">
            {notice}
          </div>
        )}
      </form>

      <p className="text-center text-sm text-foreground/60 font-medium mt-6">
        Remembered it?{' '}
        <Link href="/login" className="font-semibold text-primary hover:underline">Sign in</Link>
      </p>
    </>
  );
}
