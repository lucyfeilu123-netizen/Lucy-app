'use client';

import { Calendar } from 'lucide-react';
import { useTaskStore } from '@/stores/task-store';
import { ViewHeader } from '@/components/tasks/view-header';
import { TaskSortBar } from '@/components/tasks/task-sort-bar';
import { TaskInput } from '@/components/tasks/task-input';
import { TaskList } from '@/components/tasks/task-list';

export default function Next7DaysPage() {
  const tasks = useTaskStore((s) => s.tasks);
  const searchQuery = useTaskStore((s) => s.searchQuery);
  const sortMode = useTaskStore((s) => s.sortMode);
  const getTasksByView = useTaskStore((s) => s.getTasksByView);
  const filteredTasks = getTasksByView('next7Days');

  return (
    <div>
      <ViewHeader
        title="Next 7 Days"
        subtitle={`${filteredTasks.length} upcoming task${filteredTasks.length !== 1 ? 's' : ''}`}
        icon={<Calendar size={24} className="text-[var(--hydra-350)]" />}
      />
      <TaskSortBar />
      <TaskInput dueDate={new Date().toISOString().split('T')[0]} />
      <TaskList tasks={filteredTasks} emptyMessage="Nothing in the next 7 days. Enjoy the calm!" />
    </div>
  );
}
