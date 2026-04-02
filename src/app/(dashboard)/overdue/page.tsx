'use client';

import { AlertCircle } from 'lucide-react';
import { useTaskStore } from '@/stores/task-store';
import { ViewHeader } from '@/components/tasks/view-header';
import { TaskSortBar } from '@/components/tasks/task-sort-bar';
import { TaskList } from '@/components/tasks/task-list';

export default function OverduePage() {
  const getTasksByView = useTaskStore((s) => s.getTasksByView);
  const tasks = getTasksByView('overdue');

  return (
    <div>
      <ViewHeader
        title="Overdue"
        subtitle={`${tasks.length} overdue task${tasks.length !== 1 ? 's' : ''}`}
        icon={<AlertCircle size={24} className="text-[var(--negative)]" />}
      />
      <TaskSortBar />
      <TaskList tasks={tasks} emptyMessage="No overdue tasks!" />
    </div>
  );
}
