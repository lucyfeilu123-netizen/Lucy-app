'use client';

import { Search, ArrowUpDown } from 'lucide-react';
import { useTaskStore } from '@/stores/task-store';
import { useI18n } from '@/lib/i18n/provider';
import { cn } from '@/lib/utils';

const sortLabels = {
  created: 'Recent',
  priority: 'Priority',
  dueDate: 'Due Date',
  alpha: 'A-Z',
} as const;

export function TaskSortBar() {
  const { t } = useI18n();
  const searchQuery = useTaskStore((s) => s.searchQuery);
  const setSearchQuery = useTaskStore((s) => s.setSearchQuery);
  const sortMode = useTaskStore((s) => s.sortMode);
  const setSortMode = useTaskStore((s) => s.setSortMode);

  const modes = Object.keys(sortLabels) as Array<keyof typeof sortLabels>;
  const cycleSort = () => {
    const idx = modes.indexOf(sortMode);
    setSortMode(modes[(idx + 1) % modes.length]);
  };

  return (
    <div className="flex items-center gap-2 px-4 py-2 border-b border-[var(--border)]">
      <div className="flex-1 flex items-center gap-2 rounded-lg bg-[var(--bg-subtle)] px-3 py-1.5">
        <Search size={14} className="text-[var(--fg-quieter)] shrink-0" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t('task.search')}
          className="flex-1 bg-transparent text-sm text-[var(--fg)] placeholder:text-[var(--fg-quieter)] focus:outline-none"
        />
      </div>
      <button
        onClick={cycleSort}
        className={cn(
          'flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium',
          'text-[var(--fg-quiet)] hover:text-[var(--fg)] hover:bg-[var(--bg-subtle)]',
          'transition-colors'
        )}
        title={`Sort by: ${sortLabels[sortMode]}`}
      >
        <ArrowUpDown size={14} />
        {sortLabels[sortMode]}
      </button>
    </div>
  );
}
