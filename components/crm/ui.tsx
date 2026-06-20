'use client';

import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import * as React from 'react';

/* Lightweight, theme-matched primitives shared across the CRM. */

export function Label({ className, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={cn('block text-xs font-semibold text-foreground/60 mb-1.5 tracking-wide', className)}
      {...props}
    />
  );
}

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  function Input({ className, ...props }, ref) {
    return (
      <input
        ref={ref}
        className={cn(
          'w-full px-3.5 py-2.5 rounded-xl bg-muted/40 border border-foreground/10 text-sm',
          'focus:bg-background focus:border-primary focus:outline-none transition-all',
          'disabled:opacity-60',
          className
        )}
        {...props}
      />
    );
  }
);

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  function Textarea({ className, ...props }, ref) {
    return (
      <textarea
        ref={ref}
        className={cn(
          'w-full px-3.5 py-2.5 rounded-xl bg-muted/40 border border-foreground/10 text-sm',
          'focus:bg-background focus:border-primary focus:outline-none transition-all',
          className
        )}
        {...props}
      />
    );
  }
);

export const Select = React.forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(
  function Select({ className, ...props }, ref) {
    return (
      <select
        ref={ref}
        className={cn(
          'w-full px-3.5 py-2.5 rounded-xl bg-muted/40 border border-foreground/10 text-sm cursor-pointer',
          'focus:bg-background focus:border-primary focus:outline-none transition-all',
          className
        )}
        {...props}
      />
    );
  }
);

export function FieldError({ children }: { children?: React.ReactNode }) {
  if (!children) return null;
  return <p className="mt-1 text-[11px] font-medium text-rose-600">{children}</p>;
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost' | 'danger';
  loading?: boolean;
}
export function Button({ className, variant = 'primary', loading, children, disabled, ...props }: ButtonProps) {
  const styles: Record<string, string> = {
    primary: 'bg-gradient-to-r from-primary to-accent text-white hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/30',
    outline: 'bg-card border border-foreground/15 text-foreground hover:border-primary/40',
    ghost: 'text-foreground/70 hover:bg-muted',
    danger: 'bg-rose-500/10 border border-rose-500/20 text-rose-600 hover:bg-rose-500/20',
  };
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full font-semibold text-sm tracking-wide transition-all cursor-pointer disabled:opacity-60 disabled:hover:translate-y-0',
        styles[variant],
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 size={15} className="animate-spin" />}
      {children}
    </button>
  );
}

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('rounded-2xl bg-card border border-foreground/10 shadow-sm', className)}
      {...props}
    />
  );
}
