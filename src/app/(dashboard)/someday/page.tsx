'use client';

import { Cloud } from 'lucide-react';
import { useTaskStore } from '@/stores/task-store';
import { ViewHeader } from '@/components/tasks/view-header';
import { TaskSortBar } from '@/components/tasks/task-sort-bar';
import { TaskInput } from '@/components/tasks/task-input';
import { TaskList } from '@/components/tasks/task-list';

export default function SomedayPage() {
  const tasks = useTaskStore((s) => s.tasks);
  const searchQuery = useTaskStore((s) => s.searchQuery);
  const sortMode = useTaskStore((s) => s.sortMode);
  const getTasksByView = useTaskStore((s) => s.getTasksByView);
  const filteredTasks = getTasksByView('someday');

  return (
    <div>
      <ViewHeader
        title="Someday"
        subtitle="Tasks without a date or list"
        icon={<Cloud size={24} className="text-[var(--fg-quieter)]" />}
      />
      <TaskSortBar />
      <TaskInput />
      <TaskList tasks={filteredTasks} emptyMessage="No someday tasks" />
    </div>
  );
}
