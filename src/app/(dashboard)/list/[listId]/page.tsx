'use client';

import { use } from 'react';
import { useTaskStore } from '@/stores/task-store';
import { useListStore } from '@/stores/list-store';
import { ViewHeader } from '@/components/tasks/view-header';
import { TaskSortBar } from '@/components/tasks/task-sort-bar';
import { TaskInput } from '@/components/tasks/task-input';
import { TaskList } from '@/components/tasks/task-list';

export default function ListPage({ params }: { params: Promise<{ listId: string }> }) {
  const { listId } = use(params);
  const lists = useListStore((s) => s.lists);
  const getTasksByList = useTaskStore((s) => s.getTasksByList);

  const list = lists.find(l => l.id === listId);
  const tasks = getTasksByList(listId);

  if (!list) {
    return (
      <div className="flex items-center justify-center h-full text-[var(--fg-quieter)]">
        List not found
      </div>
    );
  }

  return (
    <div>
      <ViewHeader
        title={list.name}
        subtitle={`${tasks.length} task${tasks.length !== 1 ? 's' : ''}`}
        icon={<span className="text-2xl">{list.emoji}</span>}
      />
      <TaskSortBar />
      <TaskInput listId={listId} />
      <TaskList
        tasks={tasks}
        emptyMessage={`No tasks in ${list.name}`}
      />
    </div>
  );
}
