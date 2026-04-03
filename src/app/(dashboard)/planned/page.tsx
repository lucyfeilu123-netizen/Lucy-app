'use client';

import { CalendarCheck } from 'lucide-react';
import { useTaskStore } from '@/stores/task-store';
import { ViewHeader } from '@/components/tasks/view-header';
import { TaskSortBar } from '@/components/tasks/task-sort-bar';

import { TaskList } from '@/components/tasks/task-list';

export default function PlannedPage() {
  const tasks = useTaskStore((s) => s.tasks);
  const searchQuery = useTaskStore((s) => s.searchQuery);
  const sortMode = useTaskStore((s) => s.sortMode);
  const getTasksByView = useTaskStore((s) => s.getTasksByView);
  const filteredTasks = getTasksByView('planned');

  return (
    <div>
      <ViewHeader
        title="Planned"
        subtitle="All tasks with a due date"
        icon={<CalendarCheck size={24} className="text-[var(--kuja-350)]" />}
      />
      <TaskSortBar />
      <TaskList tasks={filteredTasks} emptyMessage="No planned tasks. Add a due date to any task to plan ahead." />
    </div>
  );
}
