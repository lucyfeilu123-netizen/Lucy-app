'use client';

import { CalendarRange } from 'lucide-react';
import { useTaskStore } from '@/stores/task-store';
import { ViewHeader } from '@/components/tasks/view-header';
import { TaskSortBar } from '@/components/tasks/task-sort-bar';
import { TaskInput } from '@/components/tasks/task-input';
import { TaskList } from '@/components/tasks/task-list';

export default function ThisWeekPage() {
  const getTasksByView = useTaskStore((s) => s.getTasksByView);
  const tasks = getTasksByView('thisWeek');

  return (
    <div>
      <ViewHeader
        title="This Week"
        subtitle={`${tasks.length} task${tasks.length !== 1 ? 's' : ''} this week`}
        icon={<CalendarRange size={24} className="text-[var(--limsa-350)]" />}
      />
      <TaskSortBar />
      <TaskInput />
      <TaskList tasks={tasks} emptyMessage="No tasks this week" />
    </div>
  );
}
