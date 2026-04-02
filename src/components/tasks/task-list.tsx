'use client';

import { Task } from '@/types/task';
import { TaskItem } from './task-item';
import { cn } from '@/lib/utils';
import { Inbox } from 'lucide-react';

interface TaskListProps {
  tasks: Task[];
  emptyMessage?: string;
  emptyIcon?: React.ReactNode;
  className?: string;
}

export function TaskList({ tasks, emptyMessage = 'No tasks', emptyIcon, className }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className={cn('flex flex-col items-center justify-center py-20 text-[var(--fg-quieter)]', className)}>
        {emptyIcon || <Inbox size={48} strokeWidth={1} className="mb-3 opacity-30" />}
        <p className="text-sm">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={cn('divide-y divide-[var(--border)]', className)}>
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} />
      ))}
    </div>
  );
}
