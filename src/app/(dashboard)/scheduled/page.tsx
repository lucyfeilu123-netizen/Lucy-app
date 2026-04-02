'use client';

import { CalendarClock } from 'lucide-react';
import { useTaskStore } from '@/stores/task-store';
import { ViewHeader } from '@/components/tasks/view-header';
import { TaskSortBar } from '@/components/tasks/task-sort-bar';
import { TaskInput } from '@/components/tasks/task-input';
import { TaskList } from '@/components/tasks/task-list';

export default function ScheduledPage() {
  const getTasksByView = useTaskStore((s) => s.getTasksByView);
  const tasks = getTasksByView('scheduled');

  return (
    <div>
      <ViewHeader
        title="Scheduled"
        subtitle="Tasks with future due dates"
        icon={<CalendarClock size={24} className="text-[var(--limsa-350)]" />}
      />
      <TaskSortBar />
      <TaskInput />
      <TaskList
        tasks={tasks}
        emptyMessage="No scheduled tasks"
      />
    </div>
  );
}
