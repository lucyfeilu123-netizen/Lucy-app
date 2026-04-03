'use client';

import { useEffect } from 'react';
import { useUIStore } from '@/stores/ui-store';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useUIStore((s) => s.theme);

  useEffect(() => {
    const root = document.documentElement;
    // Remove all theme classes
    root.classList.remove('dark', 'light', 'pink', 'red', 'green');
    // Add current theme class
    root.classList.add(theme);
  }, [theme]);

  return <>{children}</>;
}
