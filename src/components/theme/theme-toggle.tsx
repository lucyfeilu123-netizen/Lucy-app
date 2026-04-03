'use client';

import { useUIStore } from '@/stores/ui-store';
import { cn } from '@/lib/utils';

const themes = [
  { id: 'dark' as const, label: 'Dark', color: '#1a1a1a' },
  { id: 'light' as const, label: 'Light', color: '#f5f0e8' },
  { id: 'pink' as const, label: 'Pink', color: '#d4647a' },
  { id: 'red' as const, label: 'Red', color: '#c44040' },
  { id: 'green' as const, label: 'Green', color: '#3a8a5c' },
];

export function ThemeToggle() {
  const theme = useUIStore((s) => s.theme);
  const setTheme = useUIStore((s) => s.setTheme);

  return (
    <div className="flex items-center gap-2 px-3 py-2">
      <span className="text-xs text-[var(--fg-quieter)] mr-1">Theme</span>
      {themes.map((t) => (
        <button
          key={t.id}
          onClick={() => setTheme(t.id)}
          title={t.label}
          className={cn(
            'h-5 w-5 rounded-full transition-transform border-2',
            theme === t.id
              ? 'scale-125 border-white shadow-lg'
              : 'border-transparent hover:scale-110'
          )}
          style={{ backgroundColor: t.color }}
        />
      ))}
    </div>
  );
}
