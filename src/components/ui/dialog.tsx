'use client';

import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  className?: string;
}

export function Dialog({ open, onClose, title, children, className }: DialogProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div
        className={cn(
          'relative z-10 w-full max-w-md rounded-xl border border-[var(--border)]',
          'bg-[var(--bg-raised)] p-6 shadow-2xl',
          'animate-in fade-in zoom-in-95 duration-200',
          className
        )}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-[var(--fg)]" style={{ fontFamily: 'var(--font-heading)' }}>
            {title}
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-[var(--fg-quieter)] hover:text-[var(--fg)] hover:bg-[var(--bg-quiet)] transition-colors"
          >
            <X size={16} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
