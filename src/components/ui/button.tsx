import { forwardRef, ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg' | 'icon';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const variantStyles: Record<Variant, string> = {
  primary: 'bg-[var(--btn)] text-[var(--btn-text)] hover:opacity-90',
  secondary: 'bg-[var(--bg-quiet)] text-[var(--fg)] hover:bg-[var(--bg-subtle)]',
  ghost: 'text-[var(--fg-quiet)] hover:text-[var(--fg)] hover:bg-[var(--bg-quiet)]',
  danger: 'bg-[var(--negative)] text-white hover:opacity-90',
};

const sizeStyles: Record<Size, string> = {
  sm: 'h-8 px-3 text-xs rounded-md',
  md: 'h-9 px-4 text-sm rounded-lg',
  lg: 'h-11 px-6 text-base rounded-lg',
  icon: 'h-9 w-9 rounded-lg flex items-center justify-center',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center gap-2 font-medium transition-all duration-150',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]',
        'disabled:opacity-50 disabled:pointer-events-none',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    />
  )
);
Button.displayName = 'Button';
