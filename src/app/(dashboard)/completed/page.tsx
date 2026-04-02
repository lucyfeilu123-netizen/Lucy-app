'use client';

import { CheckCircle2 } from 'lucide-react';
import { useTaskStore } from '@/stores/task-store';
import { ViewHeader } from '@/components/tasks/view-header';
import { TaskSortBar } from '@/components/tasks/task-sort-bar';
import { TaskList } from '@/components/tasks/task-list';

export default function CompletedPage() {
  const getTasksByView = useTaskStore((s) => s.getTasksByView);
  const tasks = getTasksByView('completed');

  return (
    <div>
      <ViewHeader
        title="Completed"
        subtitle={`${tasks.length} completed task${tasks.length !== 1 ? 's' : ''}`}
        icon={<CheckCircle2 size={24} className="text-[var(--positive)]" />}
      />
      <TaskSortBar />
      <TaskList
        tasks={tasks}
        emptyMessage="No completed tasks yet"
      />
    </div>
  );
}
