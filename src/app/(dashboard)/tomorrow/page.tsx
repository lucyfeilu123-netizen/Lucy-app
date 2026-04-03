'use client';

import { CalendarPlus } from 'lucide-react';
import { useTaskStore } from '@/stores/task-store';
import { ViewHeader } from '@/components/tasks/view-header';
import { TaskSortBar } from '@/components/tasks/task-sort-bar';
import { TaskInput } from '@/components/tasks/task-input';
import { TaskList } from '@/components/tasks/task-list';

export default function TomorrowPage() {
  const tasks = useTaskStore((s) => s.tasks);
  const searchQuery = useTaskStore((s) => s.searchQuery);
  const sortMode = useTaskStore((s) => s.sortMode);
  const getTasksByView = useTaskStore((s) => s.getTasksByView);
  const filteredTasks = getTasksByView('tomorrow');

  return (
    <div>
      <ViewHeader
        title="Tomorrow"
        subtitle={(() => {
          const d = new Date();
          d.setDate(d.getDate() + 1);
          return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
        })()}
        icon={<CalendarPlus size={24} className="text-[var(--warning)]" />}
      />
      <TaskSortBar />
      <TaskInput />
      <TaskList tasks={filteredTasks} emptyMessage="Nothing planned for tomorrow" />
    </div>
  );
}
