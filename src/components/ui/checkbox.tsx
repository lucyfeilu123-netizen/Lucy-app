'use client';

import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
  priorityColor?: string;
}

export function Checkbox({ checked, onChange, className, priorityColor }: CheckboxProps) {
  return (
    <button
      role="checkbox"
      aria-checked={checked}
      onClick={(e) => {
        e.stopPropagation();
        onChange(!checked);
      }}
      className={cn(
        'flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-200',
        checked
          ? 'bg-[var(--accent)] border-[var(--accent)] scale-95'
          : 'border-[var(--fg-subtle)] hover:border-[var(--fg-quieter)]',
        className
      )}
      style={!checked && priorityColor ? { borderColor: priorityColor } : undefined}
    >
      {checked && <Check size={12} className="text-white" strokeWidth={3} />}
    </button>
  );
}
