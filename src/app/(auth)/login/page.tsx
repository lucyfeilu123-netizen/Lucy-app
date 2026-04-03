'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Timer, Mail, Lock, Loader2 } from 'lucide-react';

function GithubIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
    </svg>
  );
}
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push('/inbox');
      router.refresh();
    }
  };

  const handleGithubLogin = async () => {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  const handleGoogleLogin = async () => {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  return (
    <div className="w-full max-w-sm">
      {/* Logo */}
      <div className="flex flex-col items-center mb-8">
        <div className="h-12 w-12 rounded-2xl bg-[var(--accent)] flex items-center justify-center mb-4">
          <Timer size={24} className="text-white" />
        </div>
        <h1
          className="text-2xl font-bold text-[var(--fg)]"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          Welcome back
        </h1>
        <p className="text-sm text-[var(--fg-quieter)] mt-1">
          Sign in to Pomodoro
        </p>
      </div>

      {/* Card */}
      <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-raised)] p-6">
        {/* Social logins */}
        <div className="space-y-2">
          <button
            onClick={handleGoogleLogin}
            className={cn(
              'w-full flex items-center justify-center gap-2 h-10 rounded-lg text-sm font-medium',
              'border border-[var(--border)] text-[var(--fg)] hover:bg-[var(--bg-quiet)] transition-colors'
            )}
          >
            <svg width={18} height={18} viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          <button
            onClick={handleGithubLogin}
            className={cn(
              'w-full flex items-center justify-center gap-2 h-10 rounded-lg text-sm font-medium',
              'bg-[var(--fg)] text-[var(--bg-base)] hover:opacity-90 transition-opacity'
            )}
          >
            <GithubIcon size={18} />
            Continue with GitHub
          </button>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-[var(--border)]" />
          <span className="text-xs text-[var(--fg-quieter)]">or</span>
          <div className="flex-1 h-px bg-[var(--border)]" />
        </div>

        {/* Email form */}
        <form onSubmit={handleEmailLogin} className="space-y-3">
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
                className="pl-9"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-[var(--fg-quieter)] mb-1.5 block">Password</label>
            <div className="relative">
              <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--fg-quieter)]" />
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                className="pl-9"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Link href="/forgot-password" className="text-xs text-[var(--accent)] hover:underline">
              Forgot password?
            </Link>
          </div>

          {error && (
            <p className="text-xs text-[var(--negative)]">{error}</p>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? <Loader2 size={16} className="animate-spin" /> : 'Sign in'}
          </Button>
        </form>
      </div>

      {/* Footer */}
      <p className="text-center text-sm text-[var(--fg-quieter)] mt-4">
        Don&apos;t have an account?{' '}
        <Link href="/signup" className="text-[var(--accent)] hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}
