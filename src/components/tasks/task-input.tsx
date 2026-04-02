'use client';

import { useState, KeyboardEvent } from 'react';
import { Plus } from 'lucide-react';
import { useTaskStore } from '@/stores/task-store';
import { cn } from '@/lib/utils';

interface TaskInputProps {
  listId?: string | null;
  className?: string;
}

export function TaskInput({ listId, className }: TaskInputProps) {
  const [text, setText] = useState('');
  const addTask = useTaskStore((s) => s.addTask);

  const handleSubmit = () => {
    if (!text.trim()) return;
    addTask({ text: text.trim(), listId: listId || null });
    setText('');
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
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
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Add a task..."
        className={cn(
          'flex-1 bg-transparent text-sm text-[var(--fg)] placeholder:text-[var(--fg-quieter)]',
          'focus:outline-none'
        )}
      />
    </div>
  );
}
