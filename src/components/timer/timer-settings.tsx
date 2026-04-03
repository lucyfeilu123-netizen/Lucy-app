'use client';

import { useState } from 'react';
import { Settings, Play } from 'lucide-react';
import { Dialog } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useTimerStore } from '@/stores/timer-store';
import { RINGTONES, playRingtone, stopRingtone, RingtoneId } from '@/lib/ringtones';
import { cn } from '@/lib/utils';

function NumInput({ value, onChange, min = 1, max = 120, label }: {
  value: number; onChange: (v: number) => void; min?: number; max?: number; label: string;
}) {
  const [text, setText] = useState(String(value));
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9]/g, '');
    setText(raw);
    const num = parseInt(raw, 10);
    if (!isNaN(num) && num >= min && num <= max) {
      onChange(num);
    }
  };
  const handleBlur = () => {
    const num = parseInt(text, 10);
    if (isNaN(num) || num < min) { setText(String(min)); onChange(min); }
    else if (num > max) { setText(String(max)); onChange(max); }
    else { setText(String(num)); }
  };
  const adjust = (delta: number) => {
    const num = Math.min(max, Math.max(min, value + delta));
    setText(String(num));
    onChange(num);
  };
  return (
    <div>
      <label className="text-xs text-[var(--fg-quieter)] mb-1 block">{label}</label>
      <div className="flex items-center gap-1">
        <button onClick={() => adjust(-1)} className="h-9 w-8 rounded-l-lg border border-[var(--border)] bg-[var(--bg-surface)] text-[var(--fg-quiet)] hover:bg-[var(--bg-quiet)] text-sm font-bold">−</button>
        <input
          type="text"
          inputMode="numeric"
          value={text}
          onChange={handleChange}
          onBlur={handleBlur}
          className="w-full h-9 border-y border-[var(--border)] bg-[var(--bg-surface)] px-1 text-sm text-[var(--fg)] text-center focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
        />
        <button onClick={() => adjust(1)} className="h-9 w-8 rounded-r-lg border border-[var(--border)] bg-[var(--bg-surface)] text-[var(--fg-quiet)] hover:bg-[var(--bg-quiet)] text-sm font-bold">+</button>
      </div>
    </div>
  );
}

export function TimerSettingsButton() {
  const [open, setOpen] = useState(false);
  const settings = useTimerStore((s) => s.settings);
  const updateSettings = useTimerStore((s) => s.updateSettings);

  const handlePreview = (id: RingtoneId) => {
    stopRingtone();
    playRingtone(id);
  };

  return (
    <>
      <Button variant="ghost" size="icon" onClick={() => setOpen(true)} title="Timer Settings">
        <Settings size={18} />
      </Button>

      <Dialog open={open} onClose={() => { setOpen(false); stopRingtone(); }} title="Timer Settings">
        <div className="space-y-4">
          {/* Duration settings */}
          <div className="grid grid-cols-3 gap-3">
            <NumInput label="Focus (min)" value={settings.workMinutes} onChange={(v) => updateSettings({ workMinutes: v })} min={1} max={120} />
            <NumInput label="Short Break" value={settings.shortBreakMinutes} onChange={(v) => updateSettings({ shortBreakMinutes: v })} min={1} max={60} />
            <NumInput label="Long Break" value={settings.longBreakMinutes} onChange={(v) => updateSettings({ longBreakMinutes: v })} min={1} max={60} />
          </div>

          {/* Long break after N sessions */}
          <NumInput label="Long break after (sessions)" value={settings.longBreakAfter} onChange={(v) => updateSettings({ longBreakAfter: v })} min={2} max={10} />

          {/* Ringtone picker */}
          <div>
            <label className="text-xs text-[var(--fg-quieter)] mb-2 block">Ringtone</label>
            <div className="space-y-1.5">
              {RINGTONES.map((tone) => (
                <div
                  key={tone.id}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 cursor-pointer transition-colors',
                    settings.ringtone === tone.id
                      ? 'bg-[var(--accent)] text-white'
                      : 'hover:bg-[var(--bg-quiet)] text-[var(--fg-quiet)]'
                  )}
                  onClick={() => updateSettings({ ringtone: tone.id })}
                >
                  <span className="text-base">{tone.emoji}</span>
                  <span className="flex-1 text-sm font-medium">{tone.name}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePreview(tone.id);
                    }}
                    className={cn(
                      'h-7 w-7 rounded-full flex items-center justify-center transition-colors',
                      settings.ringtone === tone.id
                        ? 'bg-white/20 hover:bg-white/30'
                        : 'bg-[var(--bg-quiet)] hover:bg-[var(--bg-subtle)]'
                    )}
                  >
                    <Play size={12} className="ml-0.5" />
                  </button>
                </div>
              ))}
            </div>
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
