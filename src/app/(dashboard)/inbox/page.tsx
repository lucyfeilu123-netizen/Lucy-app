'use client';

import { Inbox } from 'lucide-react';
import { useTaskStore } from '@/stores/task-store';
import { ViewHeader } from '@/components/tasks/view-header';
import { TaskSortBar } from '@/components/tasks/task-sort-bar';
import { TaskInput } from '@/components/tasks/task-input';
import { TaskList } from '@/components/tasks/task-list';

export default function InboxPage() {
  const getTasksByView = useTaskStore((s) => s.getTasksByView);
  const tasks = getTasksByView('inbox');

  return (
    <div>
      <ViewHeader
        title="Inbox"
        subtitle="Tasks without a list"
        icon={<Inbox size={24} className="text-[var(--accent)]" />}
      />
      <TaskSortBar />
      <TaskInput />
      <TaskList
        tasks={tasks}
        emptyMessage="Your inbox is empty. Add a task to get started!"
      />
    </div>
  );
}
