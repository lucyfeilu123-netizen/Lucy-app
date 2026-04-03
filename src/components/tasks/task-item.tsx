'use client';

import { Star } from 'lucide-react';
import { Task } from '@/types/task';
import { useTaskStore } from '@/stores/task-store';
import { useListStore } from '@/stores/list-store';
import { useUIStore } from '@/stores/ui-store';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { cn, formatDate } from '@/lib/utils';
import { PRIORITY_CONFIG } from '@/lib/constants';

interface TaskItemProps {
  task: Task;
}

export function TaskItem({ task }: TaskItemProps) {
  const toggleDone = useTaskStore((s) => s.toggleDone);
  const updateTask = useTaskStore((s) => s.updateTask);
  const selectTask = useTaskStore((s) => s.selectTask);
  const selectedTaskId = useTaskStore((s) => s.selectedTaskId);
  const setDetailPanelOpen = useUIStore((s) => s.setDetailPanelOpen);
  const lists = useListStore((s) => s.lists);

  const list = task.listId ? lists.find(l => l.id === task.listId) : null;
  const priorityConfig = PRIORITY_CONFIG[task.priority];
  const dateLabel = formatDate(task.dueDate);
  const isSelected = selectedTaskId === task.id;
  const subtaskDone = task.subtasks.filter(s => s.done).length;
  const subtaskTotal = task.subtasks.length;

  const handleClick = () => {
    selectTask(task.id);
    setDetailPanelOpen(true);
  };

  return (
    <div
      onClick={handleClick}
      className={cn(
        'group flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors border-b border-[var(--border)]',
        isSelected ? 'bg-[var(--bg-quiet)]' : 'hover:bg-[var(--bg-subtle)]',
        task.done && 'opacity-50'
      )}
    >
      <div className="pt-0.5">
        <Checkbox
          checked={task.done}
          onChange={() => toggleDone(task.id)}
          priorityColor={task.priority !== 'none' ? priorityConfig.color : undefined}
        />
      </div>

      <div className="flex-1 min-w-0">
        <p className={cn(
          'text-sm text-[var(--fg)]',
          task.done && 'line-through text-[var(--fg-quieter)]'
        )}>
          {task.text}
        </p>

        {/* Meta row */}
        <div className="flex items-center gap-2 mt-1 flex-wrap">
          {task.priority !== 'none' && (
            <Badge variant="priority" color={priorityConfig.color}>
              {priorityConfig.label}
            </Badge>
          )}
          {dateLabel && (
            <Badge variant="tag" className={dateLabel === 'Overdue' ? 'text-[var(--negative)]' : ''}>
              {dateLabel}
            </Badge>
          )}
          {list && (
            <Badge variant="tag">
              <span className="mr-1">{list.emoji}</span>
              {list.name}
            </Badge>
          )}
          {subtaskTotal > 0 && (
            <Badge variant="tag">
              {subtaskDone}/{subtaskTotal}
            </Badge>
          )}
          {task.tags.map(tag => (
            <Badge key={tag} variant="tag">#{tag}</Badge>
          ))}
        </div>
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          updateTask(task.id, { flagged: !task.flagged });
        }}
        className="shrink-0 mt-1 p-0.5 rounded hover:bg-[var(--bg-quiet)] transition-colors"
      >
        <Star
          size={14}
          className={task.flagged ? 'fill-[var(--costa-350)] text-[var(--costa-350)]' : 'text-[var(--fg-subtle)] hover:text-[var(--fg-quieter)]'}
        />
      </button>
    </div>
  );
}
