import { forwardRef, InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        'h-9 w-full rounded-lg border border-[var(--border)] bg-[var(--bg-surface)]',
        'px-3 text-sm text-[var(--fg)] placeholder:text-[var(--fg-quieter)]',
        'focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent',
        'transition-colors',
        className
      )}
      {...props}
    />
  )
);
Input.displayName = 'Input';
