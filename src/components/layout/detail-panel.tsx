'use client';

import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTaskStore } from '@/stores/task-store';
import { useUIStore } from '@/stores/ui-store';
import { TaskEditor } from '@/components/tasks/task-editor';

export function DetailPanel() {
  const selectedTaskId = useTaskStore((s) => s.selectedTaskId);
  const tasks = useTaskStore((s) => s.tasks);
  const selectTask = useTaskStore((s) => s.selectTask);
  const detailPanelOpen = useUIStore((s) => s.detailPanelOpen);
  const setDetailPanelOpen = useUIStore((s) => s.setDetailPanelOpen);

  const task = tasks.find(t => t.id === selectedTaskId);
  const isOpen = detailPanelOpen && !!task;

  if (!isOpen) return null;

  return (
    <>
      {/* Mobile overlay */}
      <div
        className="fixed inset-0 z-40 bg-black/30 lg:hidden"
        onClick={() => {
          selectTask(null);
          setDetailPanelOpen(false);
        }}
      />

      <aside
        className={cn(
          'fixed top-0 right-0 z-50 h-full w-full max-w-[var(--detail-panel-width)]',
          'bg-[var(--bg-raised)] border-l border-[var(--border)]',
          'flex flex-col overflow-y-auto',
          'lg:relative lg:z-auto'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 h-14 border-b border-[var(--border)] shrink-0">
          <h3 className="text-sm font-medium text-[var(--fg)]">Task Details</h3>
          <button
            onClick={() => {
              selectTask(null);
              setDetailPanelOpen(false);
            }}
            className="p-1.5 rounded-lg text-[var(--fg-quieter)] hover:text-[var(--fg)] hover:bg-[var(--bg-quiet)] transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Editor */}
        <div className="flex-1 p-4">
          <TaskEditor task={task} />
        </div>
      </aside>
    </>
  );
}
