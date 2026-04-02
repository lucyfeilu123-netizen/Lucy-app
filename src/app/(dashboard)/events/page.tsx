'use client';

import { CalendarHeart } from 'lucide-react';
import { useTaskStore } from '@/stores/task-store';
import { ViewHeader } from '@/components/tasks/view-header';
import { TaskSortBar } from '@/components/tasks/task-sort-bar';
import { TaskList } from '@/components/tasks/task-list';

export default function EventsPage() {
  const getTasksByView = useTaskStore((s) => s.getTasksByView);
  const tasks = getTasksByView('events');

  return (
    <div>
      <ViewHeader
        title="Events"
        subtitle="Calendar events"
        icon={<CalendarHeart size={24} className="text-[var(--rosa-350)]" />}
      />
      <TaskSortBar />
      <TaskList tasks={tasks} emptyMessage="No events yet" />
    </div>
  );
}
