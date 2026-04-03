'use client';

import { useState, useRef } from 'react';
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
  const [hourText, setHourText] = useState(String(hour));
  const [minuteText, setMinuteText] = useState(String(minute).padStart(2, '0'));
  const minuteRef = useRef<HTMLInputElement>(null);

  const update = (h: number, m: number, p: 'AM' | 'PM') => {
    let h24 = h;
    if (p === 'AM' && h === 12) h24 = 0;
    else if (p === 'PM' && h !== 12) h24 = h + 12;
    else if (p === 'PM' && h === 12) h24 = 12;
    onChange(`${String(h24).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
  };

  const handleHourChange = (text: string) => {
    const digits = text.replace(/\D/g, '').slice(0, 2);
    setHourText(digits);
    const num = Number(digits);
    if (num >= 1 && num <= 12) {
      update(num, minute, period);
      if (digits.length === 2) minuteRef.current?.focus();
    }
  };

  const handleHourBlur = () => {
    const num = Number(hourText);
    const clamped = num < 1 ? 12 : num > 12 ? 12 : num;
    setHourText(String(clamped));
    update(clamped, minute, period);
  };

  const handleMinuteChange = (text: string) => {
    const digits = text.replace(/\D/g, '').slice(0, 2);
    setMinuteText(digits);
    const num = Number(digits);
    if (num >= 0 && num <= 59) {
      update(hour, num, period);
    }
  };

  const handleMinuteBlur = () => {
    const num = Number(minuteText);
    const clamped = num > 59 ? 59 : num < 0 ? 0 : num;
    setMinuteText(String(clamped).padStart(2, '0'));
    update(hour, clamped, period);
  };

  const inputClass = cn(
    'h-11 w-14 rounded-xl border border-[var(--border)] bg-[var(--bg-surface)]',
    'text-base text-[var(--fg)] text-center font-medium tabular-nums',
    'focus:outline-none focus:ring-2 focus:ring-[var(--accent)]'
  );

  return (
    <div className={cn('flex items-center justify-center gap-1.5 w-full', className)}>
      {/* Hour input */}
      <input
        type="text"
        inputMode="numeric"
        value={hourText}
        onChange={(e) => handleHourChange(e.target.value)}
        onBlur={handleHourBlur}
        onFocus={(e) => e.target.select()}
        placeholder="12"
        className={inputClass}
      />

      <span className="text-xl text-[var(--fg-quieter)] font-bold">:</span>

      {/* Minute input */}
      <input
        ref={minuteRef}
        type="text"
        inputMode="numeric"
        value={minuteText}
        onChange={(e) => handleMinuteChange(e.target.value)}
        onBlur={handleMinuteBlur}
        onFocus={(e) => e.target.select()}
        placeholder="00"
        className={inputClass}
      />

      {/* AM/PM toggle */}
      <div className="flex rounded-xl border border-[var(--border)] overflow-hidden shrink-0 ml-1">
        <button
          type="button"
          onClick={() => { update(hour, minute, 'AM'); }}
          className={cn(
            'h-11 w-12 text-xs font-bold transition-colors',
            period === 'AM'
              ? 'bg-[var(--accent)] text-white'
              : 'bg-[var(--bg-surface)] text-[var(--fg-quieter)] active:bg-[var(--bg-quiet)]'
          )}
        >
          AM
        </button>
        <button
          type="button"
          onClick={() => { update(hour, minute, 'PM'); }}
          className={cn(
            'h-11 w-12 text-xs font-bold transition-colors',
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
