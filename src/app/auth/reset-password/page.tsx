'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Timer, Lock, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setSuccess(true);
      setLoading(false);
      setTimeout(() => {
        router.push('/inbox');
      }, 2000);
    }
  };

  if (success) {
    return (
      <div className="min-h-dvh flex items-center justify-center bg-[var(--bg-base)] px-4">
        <div className="w-full max-w-sm text-center">
          <div className="h-12 w-12 rounded-2xl bg-[var(--positive)] flex items-center justify-center mx-auto mb-4">
            <Lock size={24} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-[var(--fg)] mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
            Password updated
          </h1>
          <p className="text-sm text-[var(--fg-quieter)]">
            Redirecting to your dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh flex items-center justify-center bg-[var(--bg-base)] px-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <div className="h-12 w-12 rounded-2xl bg-[var(--accent)] flex items-center justify-center mb-4">
            <Timer size={24} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-[var(--fg)]" style={{ fontFamily: 'var(--font-heading)' }}>
            New password
          </h1>
          <p className="text-sm text-[var(--fg-quieter)] mt-1">
            Enter your new password
          </p>
        </div>

        <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-raised)] p-6">
          <form onSubmit={handleUpdate} className="space-y-3">
            <div>
              <label className="text-xs text-[var(--fg-quieter)] mb-1.5 block">New Password</label>
              <div className="relative">
                <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--fg-quieter)]" />
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min 6 characters"
                  required
                  minLength={6}
                  autoFocus
                  className="pl-9"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-[var(--fg-quieter)] mb-1.5 block">Confirm Password</label>
              <div className="relative">
                <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--fg-quieter)]" />
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat password"
                  required
                  minLength={6}
                  className="pl-9"
                />
              </div>
            </div>

            {error && (
              <p className="text-xs text-[var(--negative)]">{error}</p>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? <Loader2 size={16} className="animate-spin" /> : 'Update password'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
