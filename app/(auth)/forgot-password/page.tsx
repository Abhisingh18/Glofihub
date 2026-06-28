import Link from 'next/link';
import { KeyRound } from 'lucide-react';
import { Button } from '@/components/crm/ui';

export default function ForgotPasswordPage() {
  return (
    <div className="text-center">
      <span className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
        <KeyRound size={30} className="text-primary" />
      </span>
      <h1 className="font-display text-xl font-extrabold text-foreground">Reset your password</h1>
      <p className="text-sm text-foreground/60 font-medium mt-2 max-w-xs mx-auto">
        Please contact your GlofiHub administrator to reset your password.
        Email-based self-reset will be available soon.
      </p>
      <Link href="/login"><Button className="mt-6 w-full">Back to Login</Button></Link>
    </div>
  );
}
