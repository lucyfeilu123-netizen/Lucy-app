'use client';

import { Calendar } from 'lucide-react';
import { useTaskStore } from '@/stores/task-store';
import { ViewHeader } from '@/components/tasks/view-header';
import { TaskSortBar } from '@/components/tasks/task-sort-bar';
import { TaskInput } from '@/components/tasks/task-input';
import { TaskList } from '@/components/tasks/task-list';

export default function Next7DaysPage() {
  const getTasksByView = useTaskStore((s) => s.getTasksByView);
  const tasks = getTasksByView('next7Days');

  return (
    <div>
      <ViewHeader
        title="Next 7 Days"
        subtitle={`${tasks.length} upcoming task${tasks.length !== 1 ? 's' : ''}`}
        icon={<Calendar size={24} className="text-[var(--hydra-350)]" />}
      />
      <TaskSortBar />
      <TaskInput />
      <TaskList tasks={tasks} emptyMessage="No tasks in the next 7 days" />
    </div>
  );
}
