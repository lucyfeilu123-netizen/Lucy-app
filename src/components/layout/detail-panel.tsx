'use client';

import { useRef } from 'react';
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
  const touchStartRef = useRef<number>(0);

  const task = tasks.find(t => t.id === selectedTaskId);
  const isOpen = detailPanelOpen && !!task;

  const handleClose = () => {
    selectTask(null);
    setDetailPanelOpen(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = e.changedTouches[0].clientX - touchStartRef.current;
    if (diff > 80) {
      handleClose();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[55] bg-black/40 lg:hidden"
        onClick={handleClose}
      />

      <aside
        className={cn(
          'fixed inset-0 z-[56] lg:relative lg:z-auto',
          'lg:w-[var(--detail-panel-width)] lg:min-w-[var(--detail-panel-width)]',
          'bg-[var(--bg-raised)]',
          'flex flex-col',
          'lg:border-l lg:border-[var(--border)]'
        )}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 h-14 border-b border-[var(--border)] shrink-0">
          <h3 className="text-base font-semibold text-[var(--fg)]">Task Details</h3>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleClose();
            }}
            className="p-3 -mr-2 rounded-xl text-[var(--fg)] bg-[var(--bg-quiet)] hover:bg-[var(--bg-subtle)] transition-colors active:scale-95"
            aria-label="Close"
          >
            <X size={20} strokeWidth={2.5} />
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
