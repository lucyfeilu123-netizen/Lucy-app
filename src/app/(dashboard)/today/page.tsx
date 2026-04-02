'use client';

import { CalendarDays } from 'lucide-react';
import { useTaskStore } from '@/stores/task-store';
import { ViewHeader } from '@/components/tasks/view-header';
import { TaskSortBar } from '@/components/tasks/task-sort-bar';
import { TaskInput } from '@/components/tasks/task-input';
import { TaskList } from '@/components/tasks/task-list';

export default function TodayPage() {
  const getTasksByView = useTaskStore((s) => s.getTasksByView);
  const tasks = getTasksByView('today');
  const allTasks = useTaskStore((s) => s.tasks);
  const todayDone = allTasks.filter(t => {
    if (!t.done || !t.doneAt) return false;
    const d = new Date(t.doneAt);
    const now = new Date();
    return d.toDateString() === now.toDateString();
  }).length;

  return (
    <div>
      <ViewHeader
        title="Today"
        subtitle={new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        icon={<CalendarDays size={24} className="text-[var(--costa-350)]" />}
        taskCount={tasks.length}
        completedCount={todayDone}
      />
      <TaskSortBar />
      <TaskInput />
      <TaskList
        tasks={tasks}
        emptyMessage="No tasks due today. Enjoy your day!"
      />
    </div>
  );
}
