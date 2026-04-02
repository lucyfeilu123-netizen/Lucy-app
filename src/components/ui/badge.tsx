import { cn } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'priority' | 'tag' | 'count';
  color?: string;
  className?: string;
}

export function Badge({ children, variant = 'default', color, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full text-xs font-medium',
        variant === 'default' && 'px-2 py-0.5 bg-[var(--bg-quiet)] text-[var(--fg-quiet)]',
        variant === 'priority' && 'px-2 py-0.5',
        variant === 'tag' && 'px-2 py-0.5 bg-[var(--bg-subtle)] text-[var(--fg-quieter)]',
        variant === 'count' && 'min-w-[20px] h-5 px-1.5 justify-center bg-[var(--bg-quiet)] text-[var(--fg-quieter)] text-[10px]',
        className
      )}
      style={color ? { color, backgroundColor: `color-mix(in oklch, ${color} 15%, transparent)` } : undefined}
    >
      {children}
    </span>
  );
}
