'use client';

import { useState, useRef, KeyboardEvent } from 'react';
import { Plus } from 'lucide-react';
import { useTaskStore } from '@/stores/task-store';
import { useI18n } from '@/lib/i18n/provider';
import { cn } from '@/lib/utils';

interface TaskInputProps {
  listId?: string | null;
  dueDate?: string | null;
  className?: string;
}

export function TaskInput({ listId, dueDate, className }: TaskInputProps) {
  const [text, setText] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const addTask = useTaskStore((s) => s.addTask);
  const { t } = useI18n();

  const createTask = () => {
    if (!text.trim()) return;
    addTask({ text: text.trim(), listId: listId || null, dueDate: dueDate || null });
    setText('');
    inputRef.current?.focus();
  };

  const handleSubmit = () => {
    if (!text.trim()) {
      inputRef.current?.focus();
      return;
    }
    createTask();
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      createTask();
    }
  };

  return (
    <div className={cn('flex items-center gap-2 px-4 py-3', className)}>
      <button
        onClick={handleSubmit}
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--accent)] text-white hover:opacity-90 transition-opacity"
      >
        <Plus size={14} strokeWidth={3} />
      </button>
      <input
        ref={inputRef}
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={t('task.addTask')}
        className={cn(
          'flex-1 bg-transparent text-sm text-[var(--fg)] placeholder:text-[var(--fg-quieter)]',
          'focus:outline-none'
        )}
      />
    </div>
  );
}
