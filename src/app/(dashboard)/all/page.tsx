'use client';

import { ListTodo } from 'lucide-react';
import { useTaskStore } from '@/stores/task-store';
import { ViewHeader } from '@/components/tasks/view-header';
import { TaskSortBar } from '@/components/tasks/task-sort-bar';
import { TaskInput } from '@/components/tasks/task-input';
import { TaskList } from '@/components/tasks/task-list';

export default function AllPage() {
  const getTasksByView = useTaskStore((s) => s.getTasksByView);
  const tasks = getTasksByView('all');

  return (
    <div>
      <ViewHeader
        title="All Tasks"
        subtitle={`${tasks.length} task${tasks.length !== 1 ? 's' : ''}`}
        icon={<ListTodo size={24} className="text-[var(--gridania-350)]" />}
      />
      <TaskSortBar />
      <TaskInput />
      <TaskList
        tasks={tasks}
        emptyMessage="No tasks yet. Create one!"
      />
    </div>
  );
}
