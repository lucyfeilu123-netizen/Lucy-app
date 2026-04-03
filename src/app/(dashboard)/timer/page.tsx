'use client';

import { useTimerStore } from '@/stores/timer-store';
import { useTaskStore } from '@/stores/task-store';
import { useTimer } from '@/hooks/use-timer';
import { TimerDisplay } from '@/components/timer/timer-display';
import { TimerControls } from '@/components/timer/timer-controls';
import { TimerPresets } from '@/components/timer/timer-presets';
import { TimerSettingsButton } from '@/components/timer/timer-settings';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';

export default function TimerPage() {
  useTimer(); // Activate the timer tick loop

  const { mode, status, remainingSeconds, totalSeconds, sessionsCompleted, settings } = useTimerStore();
  const setMode = useTimerStore((s) => s.setMode);
  const getFocusQueue = useTaskStore((s) => s.getFocusQueue);
  const toggleDone = useTaskStore((s) => s.toggleDone);
  const focusQueue = getFocusQueue().slice(0, 5);

  const modes = [
    { id: 'work' as const, label: 'Focus' },
    { id: 'shortBreak' as const, label: 'Short Break' },
    { id: 'longBreak' as const, label: 'Long Break' },
  ];

  // Session dots
  const sessionDots = Array.from({ length: settings.longBreakAfter }, (_, i) => i < (sessionsCompleted % settings.longBreakAfter));

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100dvh-56px)] px-4 py-8 lg:min-h-dvh">
      {/* Mode tabs */}
      <div className="flex items-center gap-1 rounded-xl bg-[var(--bg-quiet)] p-1 mb-8">
        {modes.map((m) => (
          <button
            key={m.id}
            onClick={() => setMode(m.id)}
            className={cn(
              'px-4 py-1.5 rounded-lg text-sm font-medium transition-colors',
              mode === m.id
                ? 'bg-[var(--bg-raised)] text-[var(--fg)] shadow-sm'
                : 'text-[var(--fg-quieter)] hover:text-[var(--fg-quiet)]'
            )}
          >
            {m.label}
          </button>
        ))}
        <TimerSettingsButton />
      </div>

      {/* Timer */}
      <TimerDisplay
        remainingSeconds={remainingSeconds}
        totalSeconds={totalSeconds}
        mode={mode}
        className="mb-8"
      />

      {/* Controls */}
      <TimerControls className="mb-6" />

      {/* Presets */}
      <TimerPresets className="mb-8" />

      {/* Mode dots — tap to switch between Focus / Short Break / Long Break */}
      <div className="flex items-center gap-3 mb-8">
        {modes.map((m) => (
          <button
            key={m.id}
            onClick={() => setMode(m.id)}
            className="flex flex-col items-center gap-1.5"
          >
            <div
              className={cn(
                'h-3 w-3 rounded-full transition-all duration-300',
                mode === m.id
                  ? m.id === 'work' ? 'bg-[var(--accent)] scale-125' : m.id === 'shortBreak' ? 'bg-[var(--positive)] scale-125' : 'bg-[var(--warning)] scale-125'
                  : 'bg-[var(--bg-quiet)]'
              )}
            />
            <span className={cn(
              'text-[10px] transition-colors',
              mode === m.id ? 'text-[var(--fg)]' : 'text-[var(--fg-quieter)]'
            )}>
              {m.label}
            </span>
          </button>
        ))}
        <span className="text-xs text-[var(--fg-quieter)] ml-3">
          {sessionsCompleted} session{sessionsCompleted !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Focus Task Queue */}
      {focusQueue.length > 0 && (
        <div className="w-full max-w-md">
          <h3 className="text-xs font-medium uppercase tracking-wider text-[var(--fg-quieter)] mb-3">
            Up Next
          </h3>
          <div className="space-y-2">
            {focusQueue.map((task, i) => (
              <div
                key={task.id}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2',
                  i === 0 ? 'bg-[var(--bg-quiet)]' : 'opacity-60'
                )}
              >
                <Checkbox
                  checked={task.done}
                  onChange={() => toggleDone(task.id)}
                />
                <span className="text-sm text-[var(--fg)] truncate">{task.text}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
