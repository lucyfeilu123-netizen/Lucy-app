'use client';

import { Star } from 'lucide-react';
import { useTaskStore } from '@/stores/task-store';
import { ViewHeader } from '@/components/tasks/view-header';
import { TaskSortBar } from '@/components/tasks/task-sort-bar';
import { TaskInput } from '@/components/tasks/task-input';
import { TaskList } from '@/components/tasks/task-list';

export default function FlaggedPage() {
  const getTasksByView = useTaskStore((s) => s.getTasksByView);
  const tasks = getTasksByView('flagged');

  return (
    <div>
      <ViewHeader
        title="Flagged"
        subtitle="Important tasks"
        icon={<Star size={24} className="text-[var(--costa-350)]" />}
      />
      <TaskSortBar />
      <TaskInput />
      <TaskList
        tasks={tasks}
        emptyMessage="No flagged tasks"
      />
    </div>
  );
}
