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

  const handleClose = () => {
    selectTask(null);
    setDetailPanelOpen(false);
  };

  return (
    <>
      {/* Mobile: full-screen fixed overlay that doesn't push content */}
      <div className="fixed inset-0 z-[55] lg:hidden" onClick={handleClose}>
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <aside
        className={cn(
          // Mobile: fixed full-screen overlay, no horizontal shift
          'fixed inset-0 z-[56] lg:relative lg:z-auto',
          'lg:w-[var(--detail-panel-width)] lg:min-w-[var(--detail-panel-width)]',
          'bg-[var(--bg-raised)]',
          'flex flex-col',
          // Mobile: take full width, no max-width constraint
          'lg:border-l lg:border-[var(--border)]'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 h-14 border-b border-[var(--border)] shrink-0">
          <h3 className="text-base font-semibold text-[var(--fg)]">Task Details</h3>
          <button
            onClick={handleClose}
            className="p-3 -mr-2 rounded-lg text-[var(--fg)] hover:bg-[var(--bg-quiet)] transition-colors active:bg-[var(--bg-subtle)]"
          >
            <X size={22} />
          </button>
        </div>

        {/* Editor — scrollable */}
        <div className="flex-1 overflow-y-auto overscroll-contain p-4 pb-8">
          <TaskEditor task={task} />
        </div>
      </aside>
    </>
  );
}
