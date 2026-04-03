'use client';

import { cn } from '@/lib/utils';

interface TimePickerProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function TimePicker({ value, onChange, className }: TimePickerProps) {
  const parse = (v: string) => {
    if (!v) return { hour: 12, minute: 0, period: 'AM' as const };
    const [h, m] = v.split(':').map(Number);
    return {
      hour: h === 0 ? 12 : h > 12 ? h - 12 : h,
      minute: m || 0,
      period: (h >= 12 ? 'PM' : 'AM') as 'AM' | 'PM',
    };
  };

  const { hour, minute, period } = parse(value);

  const update = (h: number, m: number, p: 'AM' | 'PM') => {
    let h24 = h;
    if (p === 'AM' && h === 12) h24 = 0;
    else if (p === 'PM' && h !== 12) h24 = h + 12;
    else if (p === 'PM' && h === 12) h24 = 12;
    onChange(`${String(h24).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
  };

  const selectClass = cn(
    'h-12 flex-1 rounded-xl border border-[var(--border)] bg-[var(--bg-surface)]',
    'text-base text-[var(--fg)] text-center font-medium',
    'focus:outline-none focus:ring-2 focus:ring-[var(--accent)]'
  );

  return (
    <div className={cn('flex items-center justify-center gap-2 w-full', className)}>
      {/* Hour */}
      <select
        value={hour}
        onChange={(e) => update(Number(e.target.value), minute, period)}
        className={selectClass}
        style={{ textAlignLast: 'center' }}
      >
        {Array.from({ length: 12 }, (_, i) => i + 1).map((h) => (
          <option key={h} value={h}>{h}</option>
        ))}
      </select>

      <span className="text-xl text-[var(--fg-quieter)] font-bold">:</span>

      {/* Minute */}
      <select
        value={minute}
        onChange={(e) => update(hour, Number(e.target.value), period)}
        className={selectClass}
        style={{ textAlignLast: 'center' }}
      >
        {Array.from({ length: 12 }, (_, i) => i * 5).map((m) => (
          <option key={m} value={m}>{String(m).padStart(2, '0')}</option>
        ))}
      </select>

      {/* AM/PM */}
      <div className="flex rounded-xl border border-[var(--border)] overflow-hidden shrink-0">
        <button
          onClick={() => update(hour, minute, 'AM')}
          className={cn(
            'h-12 w-14 text-sm font-bold transition-colors',
            period === 'AM'
              ? 'bg-[var(--accent)] text-white'
              : 'bg-[var(--bg-surface)] text-[var(--fg-quieter)] active:bg-[var(--bg-quiet)]'
          )}
        >
          AM
        </button>
        <button
          onClick={() => update(hour, minute, 'PM')}
          className={cn(
            'h-12 w-14 text-sm font-bold transition-colors',
            period === 'PM'
              ? 'bg-[var(--accent)] text-white'
              : 'bg-[var(--bg-surface)] text-[var(--fg-quieter)] active:bg-[var(--bg-quiet)]'
          )}
        >
          PM
        </button>
      </div>
    </div>
  );
}
