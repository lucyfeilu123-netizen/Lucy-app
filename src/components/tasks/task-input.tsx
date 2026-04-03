'use client';

import { useState, useRef, useMemo, KeyboardEvent } from 'react';
import { Plus, Check, Calendar, Clock } from 'lucide-react';
import { useTaskStore } from '@/stores/task-store';
import { useI18n } from '@/lib/i18n/provider';
import { parseTaskText } from '@/lib/date-parser';
import { cn } from '@/lib/utils';

interface TaskInputProps {
  listId?: string | null;
  dueDate?: string | null;
  flagged?: boolean;
  className?: string;
}

export function TaskInput({ listId, dueDate, flagged, className }: TaskInputProps) {
  const [text, setText] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const addTask = useTaskStore((s) => s.addTask);
  const { t } = useI18n();

  // Parse the text for dates/times as user types
  const parsed = useMemo(() => parseTaskText(text), [text]);
  const hasDetectedDate = parsed.dueDate !== null;
  const hasDetectedTime = parsed.dueTime !== null;

  const createTask = () => {
    if (!text.trim()) return;
    addTask({
      text: parsed.text || text.trim(), // use cleaned text
      listId: listId || null,
      dueDate: parsed.dueDate || dueDate || null,
      dueTime: parsed.dueTime || null,
      flagged: flagged || false,
    });
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

  // Format detected date for display
  const dateLabel = parsed.dueDate
    ? new Date(parsed.dueDate + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    : null;
  const timeLabel = parsed.dueTime
    ? (() => {
        const [h, m] = parsed.dueTime.split(':').map(Number);
        const hr = h === 0 ? 12 : h > 12 ? h - 12 : h;
        const period = h >= 12 ? 'PM' : 'AM';
        return `${hr}:${String(m).padStart(2, '0')} ${period}`;
      })()
    : null;

  return (
    <div className={cn('px-4 py-3', className)}>
      <div className="flex items-center gap-2">
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
        {text.trim() && (
          <button
            onClick={createTask}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--positive)] text-white hover:opacity-90 transition-all active:scale-95"
          >
            <Check size={16} strokeWidth={3} />
          </button>
        )}
      </div>

      {/* Smart date/time detection badges */}
      {(hasDetectedDate || hasDetectedTime) && (
        <div className="flex items-center gap-2 mt-2 ml-9">
          {dateLabel && (
            <span className="inline-flex items-center gap-1 rounded-full bg-[var(--accent)] text-white px-2.5 py-0.5 text-xs font-medium">
              <Calendar size={10} />
              {dateLabel}
            </span>
          )}
          {timeLabel && (
            <span className="inline-flex items-center gap-1 rounded-full bg-[var(--warning)] text-white px-2.5 py-0.5 text-xs font-medium">
              <Clock size={10} />
              {timeLabel}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
