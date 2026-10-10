'use client';

import { useState, useTransition } from 'react';
import { Check, Dices, Eye, EyeOff, KeyRound } from 'lucide-react';
import { Button, Input } from '@/components/crm/ui';
import { resetUserPassword } from '@/lib/actions/admin';

// No look-alike characters (0/O, 1/l/I) so a generated password can be read out or typed without mistakes.
const CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';

function generatePassword(length = 12): string {
  const bytes = new Uint32Array(length);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => CHARS[b % CHARS.length]).join('');
}

/** Admin-only: set a new password for a student or staff member (shown only on admin pages). */
export function ResetPasswordControl({ userId }: { userId: string }) {
  const [pw, setPw] = useState('');
  const [show, setShow] = useState(false);
  const [pending, start] = useTransition();
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const submit = () => {
    setMsg(null);
    start(async () => {
      const res = await resetUserPassword({ user_id: userId, password: pw });
      if (res.ok) {
        setMsg({ ok: true, text: 'Password updated. Share the new password with them securely.' });
        setPw('');
      } else {
        setMsg({ ok: false, text: res.error || 'Could not reset the password.' });
      }
    });
  };

  return (
    <div>
      <p className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-foreground/55">
        <KeyRound size={13} aria-hidden /> Reset password
      </p>
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative">
          <Input
            type={show ? 'text' : 'password'}
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            autoComplete="new-password"
            placeholder="New password (min 8)"
            aria-label="New password"
            className="w-56 pr-9"
          />
          <button
            type="button"
            onClick={() => setShow((v) => !v)}
            aria-label={show ? 'Hide password' : 'Show password'}
            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-foreground/40 hover:text-foreground"
          >
            {show ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        </div>
        <Button
          type="button"
          variant="outline"
          className="px-3 py-2 text-xs"
          onClick={() => {
            setPw(generatePassword());
            setShow(true);
            setMsg(null);
          }}
        >
          <Dices size={14} aria-hidden /> Generate
        </Button>
        <Button type="button" onClick={submit} loading={pending} disabled={pw.length < 8} className="px-4 py-2 text-xs">
          Set password
        </Button>
      </div>
      <div role="status" aria-live="polite">
        {msg && (
          <p className={`mt-1.5 flex items-center gap-1 text-[11px] font-medium ${msg.ok ? 'text-emerald-600' : 'text-rose-600'}`}>
            {msg.ok && <Check size={13} aria-hidden />} {msg.text}
          </p>
        )}
      </div>
    </div>
  );
}
