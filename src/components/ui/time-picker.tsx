'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface TimePickerProps {
  value: string; // "HH:MM" in 24h format
  onChange: (value: string) => void;
  className?: string;
}

export function TimePicker({ value, onChange, className }: TimePickerProps) {
  // Parse 24h time to 12h
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

  return (
    <div className={cn('flex items-center gap-1', className)}>
      {/* Hour */}
      <select
        value={hour}
        onChange={(e) => update(Number(e.target.value), minute, period)}
        className="h-10 w-14 rounded-lg border border-[var(--border)] bg-[var(--bg-surface)] text-sm text-[var(--fg)] text-center focus:outline-none focus:ring-2 focus:ring-[var(--accent)] appearance-none"
      >
        {Array.from({ length: 12 }, (_, i) => i + 1).map((h) => (
          <option key={h} value={h}>{h}</option>
        ))}
      </select>

      <span className="text-[var(--fg-quieter)] font-bold">:</span>

      {/* Minute */}
      <select
        value={minute}
        onChange={(e) => update(hour, Number(e.target.value), period)}
        className="h-10 w-14 rounded-lg border border-[var(--border)] bg-[var(--bg-surface)] text-sm text-[var(--fg)] text-center focus:outline-none focus:ring-2 focus:ring-[var(--accent)] appearance-none"
      >
        {Array.from({ length: 12 }, (_, i) => i * 5).map((m) => (
          <option key={m} value={m}>{String(m).padStart(2, '0')}</option>
        ))}
      </select>

      {/* AM/PM */}
      <div className="flex rounded-lg border border-[var(--border)] overflow-hidden">
        <button
          onClick={() => update(hour, minute, 'AM')}
          className={cn(
            'h-10 px-3 text-xs font-semibold transition-colors',
            period === 'AM'
              ? 'bg-[var(--accent)] text-white'
              : 'bg-[var(--bg-surface)] text-[var(--fg-quiet)] hover:bg-[var(--bg-quiet)]'
          )}
        >
          AM
        </button>
        <button
          onClick={() => update(hour, minute, 'PM')}
          className={cn(
            'h-10 px-3 text-xs font-semibold transition-colors',
            period === 'PM'
              ? 'bg-[var(--accent)] text-white'
              : 'bg-[var(--bg-surface)] text-[var(--fg-quiet)] hover:bg-[var(--bg-quiet)]'
          )}
        >
          PM
        </button>
      </div>
    </div>
  );
}
