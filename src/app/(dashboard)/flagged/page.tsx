'use client';

import { Star } from 'lucide-react';
import { useTaskStore } from '@/stores/task-store';
import { ViewHeader } from '@/components/tasks/view-header';
import { TaskSortBar } from '@/components/tasks/task-sort-bar';

import { TaskList } from '@/components/tasks/task-list';

export default function FlaggedPage() {
  const tasks = useTaskStore((s) => s.tasks);
  const searchQuery = useTaskStore((s) => s.searchQuery);
  const sortMode = useTaskStore((s) => s.sortMode);
  const getTasksByView = useTaskStore((s) => s.getTasksByView);
  const filteredTasks = getTasksByView('flagged');

  return (
    <div>
      <ViewHeader
        title="Flagged"
        subtitle="Important tasks"
        icon={<Star size={24} className="text-[var(--costa-350)]" />}
      />
      <TaskSortBar />
      <TaskList
        tasks={filteredTasks}
        emptyMessage="No flagged tasks. Tap the ⭐ star on any task to flag it."
      />
    </div>
  );
}
