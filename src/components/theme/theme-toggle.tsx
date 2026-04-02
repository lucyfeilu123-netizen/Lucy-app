'use client';

import { Sun, Moon, Monitor } from 'lucide-react';
import { useUIStore } from '@/stores/ui-store';
import { cn } from '@/lib/utils';

const modes = ['dark', 'light', 'system'] as const;
const icons = { dark: Moon, light: Sun, system: Monitor };

export function ThemeToggle() {
  const theme = useUIStore((s) => s.theme);
  const setTheme = useUIStore((s) => s.setTheme);

  const cycle = () => {
    const idx = modes.indexOf(theme);
    setTheme(modes[(idx + 1) % modes.length]);
  };

  const Icon = icons[theme];

  return (
    <button
      onClick={cycle}
      className={cn(
        'flex items-center gap-2 rounded-lg px-3 py-2 text-sm',
        'text-[var(--fg-quiet)] hover:text-[var(--fg)] hover:bg-[var(--bg-quiet)]',
        'transition-colors'
      )}
      title={`Theme: ${theme}`}
    >
      <Icon size={16} />
      <span className="capitalize">{theme}</span>
    </button>
  );
}
