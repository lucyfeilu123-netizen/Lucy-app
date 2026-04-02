'use client';

import { Play, Pause, RotateCcw, SkipForward } from 'lucide-react';
import { useTimerStore } from '@/stores/timer-store';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function TimerControls({ className }: { className?: string }) {
  const status = useTimerStore((s) => s.status);
  const start = useTimerStore((s) => s.start);
  const pause = useTimerStore((s) => s.pause);
  const reset = useTimerStore((s) => s.reset);
  const skip = useTimerStore((s) => s.skip);

  return (
    <div className={cn('flex items-center gap-3', className)}>
      <Button variant="ghost" size="icon" onClick={reset} title="Reset">
        <RotateCcw size={18} />
      </Button>

      <button
        onClick={status === 'running' ? pause : start}
        className={cn(
          'h-14 w-14 rounded-full flex items-center justify-center transition-all',
          'bg-[var(--accent)] text-white hover:opacity-90',
          'shadow-lg shadow-[var(--accent)]/20'
        )}
      >
        {status === 'running' ? <Pause size={24} /> : <Play size={24} className="ml-0.5" />}
      </button>

      <Button variant="ghost" size="icon" onClick={skip} title="Skip">
        <SkipForward size={18} />
      </Button>
    </div>
  );
}
