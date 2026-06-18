'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ShieldCheck, Mail, Lock, Eye, EyeOff, ArrowLeft, LogIn, Loader2 } from 'lucide-react';
import { adminSignIn } from '@/lib/adminAuth';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [notice, setNotice] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setNotice('');
    setLoading(true);
    const res = await adminSignIn(email, password);
    setLoading(false);
    if (res.ok) {
      router.push('/admin/dashboard');
    } else {
      setNotice(res.error || 'Invalid email or password. Please try again.');
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-16 bg-gradient-to-br from-primary via-primary to-blue-950 relative overflow-hidden">
      {/* Ambient glows */}
      <div aria-hidden className="pointer-events-none absolute -top-24 -left-24 w-96 h-96 rounded-full bg-accent/20 blur-3xl animate-aurora" />
      <div aria-hidden className="pointer-events-none absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-emerald-500/20 blur-3xl animate-aurora" style={{ animationDelay: '3s' }} />

      <div className="relative w-full max-w-md">
        <Link href="/" className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm font-medium mb-6 transition-colors">
          <ArrowLeft size={16} /> Back to site
        </Link>

        <div className="bg-card border border-foreground/10 rounded-3xl shadow-2xl p-8 md:p-10">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-white shadow-lg shadow-primary/25 mx-auto mb-4">
              <ShieldCheck size={26} />
            </div>
            <h1 className="font-display text-2xl font-extrabold text-foreground tracking-tight">Admin Login</h1>
            <p className="text-sm text-foreground/60 font-medium mt-1.5">Sign in to the GlofiHub dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-foreground/60 mb-2 tracking-wide">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground/40" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@glofihub.com"
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-muted/40 border border-foreground/10 focus:bg-background focus:border-primary focus:outline-none transition-all text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground/60 mb-2 tracking-wide">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground/40" />
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-11 py-3 rounded-xl bg-muted/40 border border-foreground/10 focus:bg-background focus:border-primary focus:outline-none transition-all text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/40 hover:text-foreground transition-colors cursor-pointer"
                  aria-label={showPw ? 'Hide password' : 'Show password'}
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 text-foreground/60 font-medium cursor-pointer">
                <input type="checkbox" className="accent-primary w-3.5 h-3.5" /> Remember me
              </label>
              <a href="#" className="font-semibold text-primary hover:underline">Forgot password?</a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-shine group w-full py-3.5 rounded-full bg-gradient-to-r from-primary to-accent text-white font-semibold text-sm tracking-wide hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:hover:translate-y-0"
            >
              {loading ? <><Loader2 size={16} className="animate-spin" /> Signing in…</> : <><LogIn size={16} /> Sign In</>}
            </button>

            {notice && (
              <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-600 dark:text-rose-300 text-xs font-medium text-center">
                {notice}
              </div>
            )}
          </form>

          <div className="mt-6 p-3 rounded-xl bg-muted/40 border border-foreground/10 text-center">
            <p className="text-[11px] font-semibold text-foreground/50 tracking-wide mb-1">Demo credentials</p>
            <p className="text-xs font-medium text-foreground/70">admin@glofihub.com · Glofihub@123</p>
          </div>

          <p className="text-center text-[11px] text-foreground/40 font-medium mt-4">
            Authorized personnel only · GlofiHub Admin
          </p>
        </div>
      </div>
    </main>
  );
}
