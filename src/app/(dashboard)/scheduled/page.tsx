'use client';

import { CalendarClock } from 'lucide-react';
import { useTaskStore } from '@/stores/task-store';
import { ViewHeader } from '@/components/tasks/view-header';
import { TaskSortBar } from '@/components/tasks/task-sort-bar';

import { TaskList } from '@/components/tasks/task-list';

export default function ScheduledPage() {
  const tasks = useTaskStore((s) => s.tasks);
  const searchQuery = useTaskStore((s) => s.searchQuery);
  const sortMode = useTaskStore((s) => s.sortMode);
  const getTasksByView = useTaskStore((s) => s.getTasksByView);
  const filteredTasks = getTasksByView('scheduled');

  return (
    <div>
      <ViewHeader
        title="Scheduled"
        subtitle="Tasks with future due dates"
        icon={<CalendarClock size={24} className="text-[var(--limsa-350)]" />}
      />
      <TaskSortBar />
      <TaskList
        tasks={filteredTasks}
        emptyMessage="No scheduled tasks. Set a due date on any task to see it here."
      />
    </div>
  );
}
