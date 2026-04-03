'use client';

import { useRef, useCallback } from 'react';
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
  const touchStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const task = tasks.find(t => t.id === selectedTaskId);
  const isOpen = detailPanelOpen && !!task;

  const handleClose = useCallback(() => {
    selectTask(null);
    setDetailPanelOpen(false);
  }, [selectTask, setDetailPanelOpen]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - touchStartRef.current.x;
    const dy = Math.abs(e.changedTouches[0].clientY - touchStartRef.current.y);
    // Swipe right to close — only if horizontal swipe is dominant
    if (dx > 80 && dy < 60) {
      handleClose();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop — mobile only */}
      <div
        className="fixed inset-0 z-[55] bg-black/40 lg:hidden"
        onClick={handleClose}
      />

      <aside
        className={cn(
          // Mobile: fixed full-screen overlay, stays within viewport
          'fixed inset-0 z-[56]',
          // Desktop: side panel
          'lg:relative lg:z-auto',
          'lg:w-[var(--detail-panel-width)] lg:min-w-[var(--detail-panel-width)]',
          'bg-[var(--bg-raised)]',
          'flex flex-col',
          // Prevent any overflow from pushing content off-screen
          'max-h-[100dvh] max-w-[100vw]',
          'lg:border-l lg:border-[var(--border)]'
        )}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Header — always visible, never scrolls away */}
        <div className="flex items-center justify-between px-4 h-14 border-b border-[var(--border)] shrink-0 sticky top-0 z-10 bg-[var(--bg-raised)]">
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

        {/* Editor — scrollable, contained within panel */}
        <div className="flex-1 overflow-y-auto overscroll-contain p-4 pb-[env(safe-area-inset-bottom,16px)]">
          <TaskEditor task={task} />
        </div>
      </aside>
    </>
  );
}
