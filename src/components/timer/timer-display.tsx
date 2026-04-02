'use client';

import { cn } from '@/lib/utils';
import { formatTime } from '@/lib/utils';
import { TimerMode } from '@/types/timer';

interface TimerDisplayProps {
  remainingSeconds: number;
  totalSeconds: number;
  mode: TimerMode;
  className?: string;
}

const RADIUS = 90;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const modeColors: Record<TimerMode, string> = {
  work: 'var(--accent)',
  shortBreak: 'var(--positive)',
  longBreak: 'var(--warning)',
};

const modeLabels: Record<TimerMode, string> = {
  work: 'Focus',
  shortBreak: 'Short Break',
  longBreak: 'Long Break',
};

export function TimerDisplay({ remainingSeconds, totalSeconds, mode, className }: TimerDisplayProps) {
  const progress = totalSeconds > 0 ? remainingSeconds / totalSeconds : 1;
  const offset = CIRCUMFERENCE * (1 - progress);
  const color = modeColors[mode];

  return (
    <div className={cn('flex flex-col items-center', className)}>
      <div className="relative">
        <svg width="220" height="220" viewBox="0 0 220 220">
          {/* Background circle */}
          <circle
            cx="110"
            cy="110"
            r={RADIUS}
            fill="none"
            stroke="var(--bg-quiet)"
            strokeWidth="6"
          />
          {/* Progress circle */}
          <circle
            cx="110"
            cy="110"
            r={RADIUS}
            fill="none"
            stroke={color}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={offset}
            transform="rotate(-90 110 110)"
            className="transition-[stroke-dashoffset] duration-1000 ease-linear"
          />
        </svg>
        {/* Time display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="text-5xl font-bold tabular-nums text-[var(--fg)]"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {formatTime(remainingSeconds)}
          </span>
          <span className="text-sm mt-1 capitalize" style={{ color }}>
            {modeLabels[mode]}
          </span>
        </div>
      </div>
    </div>
  );
}
