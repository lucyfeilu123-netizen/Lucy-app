'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface UserData {
  email: string;
  name: string;
}

export function UserMenu() {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setUser({
          email: user.email || '',
          name: user.user_metadata?.display_name || user.email?.split('@')[0] || 'User',
        });
      }
    });
  }, []);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  if (!user) return null;

  const initials = user.name.slice(0, 2).toUpperCase();

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-[var(--bg-quiet)] transition-colors w-full"
      >
        <div className="h-7 w-7 rounded-full bg-[var(--accent)] flex items-center justify-center text-white text-xs font-medium shrink-0">
          {initials}
        </div>
        <span className="text-sm text-[var(--fg)] truncate flex-1 text-left">{user.name}</span>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute bottom-full left-0 mb-1 z-50 w-full rounded-lg border border-[var(--border)] bg-[var(--bg-raised)] p-1 shadow-xl">
            <div className="px-3 py-2 border-b border-[var(--border)] mb-1">
              <p className="text-xs text-[var(--fg-quieter)] truncate">{user.email}</p>
            </div>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 w-full rounded-md px-3 py-2 text-sm text-[var(--fg-quiet)] hover:text-[var(--negative)] hover:bg-[var(--bg-quiet)] transition-colors"
            >
              <LogOut size={14} />
              Sign out
            </button>
          </div>
        </>
      )}
    </div>
  );
}
