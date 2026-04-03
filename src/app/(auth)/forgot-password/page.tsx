'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Timer, Mail, Loader2, ArrowLeft } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setSent(true);
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="w-full max-w-sm text-center">
        <div className="h-12 w-12 rounded-2xl bg-[var(--positive)] flex items-center justify-center mx-auto mb-4">
          <Mail size={24} className="text-white" />
        </div>
        <h1 className="text-2xl font-bold text-[var(--fg)] mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
          Check your email
        </h1>
        <p className="text-sm text-[var(--fg-quieter)] mb-6">
          We sent a password reset link to <strong className="text-[var(--fg)]">{email}</strong>
        </p>
        <Link href="/login" className="text-sm text-[var(--accent)] hover:underline">
          Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm">
      <div className="flex flex-col items-center mb-8">
        <div className="h-12 w-12 rounded-2xl bg-[var(--accent)] flex items-center justify-center mb-4">
          <Timer size={24} className="text-white" />
        </div>
        <h1 className="text-2xl font-bold text-[var(--fg)]" style={{ fontFamily: 'var(--font-heading)' }}>
          Reset password
        </h1>
        <p className="text-sm text-[var(--fg-quieter)] mt-1">
          Enter your email to receive a reset link
        </p>
      </div>

      <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-raised)] p-6">
        <form onSubmit={handleReset} className="space-y-3">
          <div>
            <label className="text-xs text-[var(--fg-quieter)] mb-1.5 block">Email</label>
            <div className="relative">
              <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--fg-quieter)]" />
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                autoFocus
                className="pl-9"
              />
            </div>
          </div>

          {error && (
            <p className="text-xs text-[var(--negative)]">{error}</p>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? <Loader2 size={16} className="animate-spin" /> : 'Send reset link'}
          </Button>
        </form>
      </div>

      <p className="text-center text-sm text-[var(--fg-quieter)] mt-4">
        <Link href="/login" className="text-[var(--accent)] hover:underline inline-flex items-center gap-1">
          <ArrowLeft size={14} />
          Back to sign in
        </Link>
      </p>
    </div>
  );
}
