'use client';

import { CalendarCheck } from 'lucide-react';
import { useTaskStore } from '@/stores/task-store';
import { ViewHeader } from '@/components/tasks/view-header';
import { TaskSortBar } from '@/components/tasks/task-sort-bar';
import { TaskInput } from '@/components/tasks/task-input';
import { TaskList } from '@/components/tasks/task-list';

export default function PlannedPage() {
  const getTasksByView = useTaskStore((s) => s.getTasksByView);
  const tasks = getTasksByView('planned');

  return (
    <div>
      <ViewHeader
        title="Planned"
        subtitle="All tasks with a due date"
        icon={<CalendarCheck size={24} className="text-[var(--kuja-350)]" />}
      />
      <TaskSortBar />
      <TaskInput />
      <TaskList tasks={tasks} emptyMessage="No planned tasks" />
    </div>
  );
}
