'use client';

import { cn } from '@/lib/utils';

interface ViewHeaderProps {
  title: string;
  subtitle?: string;
  taskCount?: number;
  completedCount?: number;
  icon?: React.ReactNode;
}

export function ViewHeader({ title, subtitle, taskCount, completedCount, icon }: ViewHeaderProps) {
  const showProgress = completedCount !== undefined && taskCount !== undefined && taskCount > 0;
  const progressPercent = showProgress ? Math.round((completedCount / (taskCount + completedCount)) * 100) : 0;

  return (
    <div className="px-4 pt-6 pb-2">
      <div className="flex items-center gap-3 mb-1">
        {icon}
        <h1
          className="text-2xl font-bold text-[var(--fg)]"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          {title}
        </h1>
      </div>
      {subtitle && (
        <p className="text-sm text-[var(--fg-quieter)] ml-0">{subtitle}</p>
      )}
      {showProgress && (
        <div className="mt-3 flex items-center gap-3">
          <div className="flex-1 h-1.5 rounded-full bg-[var(--bg-quiet)] overflow-hidden">
            <div
              className="h-full rounded-full bg-[var(--accent)] transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="text-xs text-[var(--fg-quieter)] tabular-nums">{progressPercent}%</span>
        </div>
      )}
    </div>
  );
}
