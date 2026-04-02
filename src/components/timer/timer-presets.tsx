'use client';

import { useTimerStore } from '@/stores/timer-store';
import { TIMER_PRESETS } from '@/lib/constants';
import { cn } from '@/lib/utils';

export function TimerPresets({ className }: { className?: string }) {
  const totalSeconds = useTimerStore((s) => s.totalSeconds);
  const setPreset = useTimerStore((s) => s.setPreset);

  return (
    <div className={cn('flex flex-wrap items-center justify-center gap-2', className)}>
      {TIMER_PRESETS.map((preset) => {
        const isActive = totalSeconds === preset.minutes * 60;
        return (
          <button
            key={preset.minutes}
            onClick={() => setPreset(preset.minutes)}
            className={cn(
              'px-3 py-1.5 rounded-full text-xs font-medium transition-colors',
              isActive
                ? 'bg-[var(--accent)] text-white'
                : 'bg-[var(--bg-quiet)] text-[var(--fg-quiet)] hover:text-[var(--fg)] hover:bg-[var(--bg-subtle)]'
            )}
          >
            {preset.label}
          </button>
        );
      })}
    </div>
  );
}
