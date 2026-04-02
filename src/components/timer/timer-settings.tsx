'use client';

import { useState } from 'react';
import { Settings } from 'lucide-react';
import { Dialog } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useTimerStore } from '@/stores/timer-store';
import { cn } from '@/lib/utils';

export function TimerSettingsButton() {
  const [open, setOpen] = useState(false);
  const settings = useTimerStore((s) => s.settings);
  const updateSettings = useTimerStore((s) => s.updateSettings);

  return (
    <>
      <Button variant="ghost" size="icon" onClick={() => setOpen(true)} title="Timer Settings">
        <Settings size={18} />
      </Button>

      <Dialog open={open} onClose={() => setOpen(false)} title="Timer Settings">
        <div className="space-y-4">
          {/* Duration settings */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs text-[var(--fg-quieter)] mb-1 block">Focus (min)</label>
              <input
                type="number"
                min={1}
                max={120}
                value={settings.workMinutes}
                onChange={(e) => updateSettings({ workMinutes: Number(e.target.value) || 25 })}
                className="w-full h-9 rounded-lg border border-[var(--border)] bg-[var(--bg-surface)] px-3 text-sm text-[var(--fg)] text-center focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
              />
            </div>
            <div>
              <label className="text-xs text-[var(--fg-quieter)] mb-1 block">Short Break</label>
              <input
                type="number"
                min={1}
                max={60}
                value={settings.shortBreakMinutes}
                onChange={(e) => updateSettings({ shortBreakMinutes: Number(e.target.value) || 5 })}
                className="w-full h-9 rounded-lg border border-[var(--border)] bg-[var(--bg-surface)] px-3 text-sm text-[var(--fg)] text-center focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
              />
            </div>
            <div>
              <label className="text-xs text-[var(--fg-quieter)] mb-1 block">Long Break</label>
              <input
                type="number"
                min={1}
                max={60}
                value={settings.longBreakMinutes}
                onChange={(e) => updateSettings({ longBreakMinutes: Number(e.target.value) || 15 })}
                className="w-full h-9 rounded-lg border border-[var(--border)] bg-[var(--bg-surface)] px-3 text-sm text-[var(--fg)] text-center focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
              />
            </div>
          </div>

          {/* Long break after N sessions */}
          <div>
            <label className="text-xs text-[var(--fg-quieter)] mb-1 block">Long break after (sessions)</label>
            <input
              type="number"
              min={2}
              max={10}
              value={settings.longBreakAfter}
              onChange={(e) => updateSettings({ longBreakAfter: Number(e.target.value) || 4 })}
              className="w-full h-9 rounded-lg border border-[var(--border)] bg-[var(--bg-surface)] px-3 text-sm text-[var(--fg)] text-center focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
            />
          </div>

          {/* Toggle settings */}
          <div className="space-y-3">
            {[
              { key: 'autoStartWork' as const, label: 'Auto-start next focus' },
              { key: 'autoStartBreak' as const, label: 'Auto-start break' },
              { key: 'disableBreak' as const, label: 'Disable breaks' },
            ].map(({ key, label }) => (
              <label key={key} className="flex items-center justify-between">
                <span className="text-sm text-[var(--fg-quiet)]">{label}</span>
                <button
                  onClick={() => updateSettings({ [key]: !settings[key] })}
                  className={cn(
                    'relative h-6 w-11 rounded-full transition-colors',
                    settings[key] ? 'bg-[var(--accent)]' : 'bg-[var(--bg-quiet)]'
                  )}
                >
                  <span
                    className={cn(
                      'absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white transition-transform shadow-sm',
                      settings[key] && 'translate-x-5'
                    )}
                  />
                </button>
              </label>
            ))}
          </div>

          {/* Session indicator */}
          <div className="pt-3 border-t border-[var(--border)]">
            <div className="flex items-center justify-between text-sm">
              <span className="text-[var(--fg-quieter)]">Sessions completed</span>
              <span className="font-medium text-[var(--fg)]">{useTimerStore.getState().sessionsCompleted}</span>
            </div>
          </div>
        </div>
      </Dialog>
    </>
  );
}
