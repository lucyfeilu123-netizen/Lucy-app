'use client';

import { AlertCircle } from 'lucide-react';
import { useTaskStore } from '@/stores/task-store';
import { ViewHeader } from '@/components/tasks/view-header';
import { TaskSortBar } from '@/components/tasks/task-sort-bar';
import { TaskInput } from '@/components/tasks/task-input';
import { TaskList } from '@/components/tasks/task-list';

export default function OverduePage() {
  const tasks = useTaskStore((s) => s.tasks);
  const searchQuery = useTaskStore((s) => s.searchQuery);
  const sortMode = useTaskStore((s) => s.sortMode);
  const getTasksByView = useTaskStore((s) => s.getTasksByView);
  const filteredTasks = getTasksByView('overdue');

  return (
    <div>
      <ViewHeader
        title="Overdue"
        subtitle={`${filteredTasks.length} overdue task${filteredTasks.length !== 1 ? 's' : ''}`}
        icon={<AlertCircle size={24} className="text-[var(--negative)]" />}
      />
      <TaskSortBar />
      <TaskInput dueDate={new Date().toISOString().split('T')[0]} />
      <TaskList tasks={filteredTasks} emptyMessage="No overdue tasks!" />
    </div>
  );
}
