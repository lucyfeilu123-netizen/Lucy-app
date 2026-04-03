'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  Inbox, CalendarDays, CalendarClock, Star, ListTodo, CheckCircle2,
  Timer, Menu, X,
  AlertCircle, CalendarPlus, CalendarRange, Calendar, CalendarCheck, Cloud, CalendarHeart
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useI18n } from '@/lib/i18n/provider';
import { useTaskStore } from '@/stores/task-store';
import { useUIStore } from '@/stores/ui-store';
import { useTimerStore } from '@/stores/timer-store';
import { ThemeToggle } from '@/components/theme/theme-toggle';
import { AmbientPicker } from '@/components/ambient/ambient-picker';
import { LanguagePicker } from '@/components/theme/language-picker';
import { UserMenu } from '@/components/layout/user-menu';
import { Badge } from '@/components/ui/badge';
import { formatTime } from '@/lib/utils';
import { SmartViewType } from '@/types/task';

const mainViews = [
  { id: 'inbox' as SmartViewType, key: 'nav.inbox', icon: Inbox, href: '/inbox' },
  { id: 'today' as SmartViewType, key: 'nav.today', icon: CalendarDays, href: '/today' },
  { id: 'overdue' as SmartViewType, key: 'nav.overdue', icon: AlertCircle, href: '/overdue' },
  { id: 'tomorrow' as SmartViewType, key: 'nav.tomorrow', icon: CalendarPlus, href: '/tomorrow' },
];

const scheduleViews = [
  { id: 'thisWeek' as SmartViewType, key: 'nav.thisWeek', icon: CalendarRange, href: '/this-week' },
  { id: 'next7Days' as SmartViewType, key: 'nav.next7Days', icon: Calendar, href: '/next-7-days' },
  { id: 'scheduled' as SmartViewType, key: 'nav.scheduled', icon: CalendarClock, href: '/scheduled' },
  { id: 'planned' as SmartViewType, key: 'nav.planned', icon: CalendarCheck, href: '/planned' },
];

const moreViews = [
  { id: 'flagged' as SmartViewType, key: 'nav.flagged', icon: Star, href: '/flagged' },
  { id: 'all' as SmartViewType, key: 'nav.allTasks', icon: ListTodo, href: '/all' },
  { id: 'someday' as SmartViewType, key: 'nav.someday', icon: Cloud, href: '/someday' },
  { id: 'events' as SmartViewType, key: 'nav.events', icon: CalendarHeart, href: '/events' },
  { id: 'completed' as SmartViewType, key: 'nav.completed', icon: CheckCircle2, href: '/completed' },
];

function NavSection({ views, label, pathname, getTaskCount, onNavigate, t }: {
  views: typeof mainViews;
  label?: string;
  pathname: string;
  getTaskCount: (view: SmartViewType) => number;
  onNavigate: () => void;
  t: (key: string) => string;
}) {
  return (
    <div>
      {label && (
        <span className="text-[10px] font-medium uppercase tracking-wider text-[var(--fg-quieter)] px-3 mb-1 block mt-4">
          {label}
        </span>
      )}
      <div className="space-y-0.5">
        {views.map((view) => {
          const isActive = pathname === view.href;
          const count = getTaskCount(view.id);
          return (
            <Link
              key={view.id}
              href={view.href}
              onClick={onNavigate}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                isActive
                  ? 'bg-[var(--bg-quiet)] text-[var(--fg)]'
                  : 'text-[var(--fg-quiet)] hover:text-[var(--fg)] hover:bg-[var(--bg-subtle)]'
              )}
            >
              <view.icon size={18} />
              <span className="flex-1">{t(view.key)}</span>
              {count > 0 && <Badge variant="count">{count}</Badge>}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const { t } = useI18n();
  const getTaskCount = useTaskStore((s) => s.getTaskCount);
  const mobileMenuOpen = useUIStore((s) => s.mobileMenuOpen);
  const setMobileMenuOpen = useUIStore((s) => s.setMobileMenuOpen);
  const { remainingSeconds, status, mode } = useTimerStore();

  return (
    <>
      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <aside
        className={cn(
          'fixed top-0 left-0 z-50 h-full w-[var(--sidebar-width)] flex flex-col',
          'bg-[var(--bg-raised)] border-r border-[var(--border)]',
          'transition-transform duration-200',
          'lg:relative lg:translate-x-0',
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 h-14 border-b border-[var(--border)]">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-[var(--accent)] flex items-center justify-center">
              <Timer size={14} className="text-white" />
            </div>
            <span className="font-semibold text-[var(--fg)]" style={{ fontFamily: 'var(--font-heading)' }}>
              Pomodoro
            </span>
          </div>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="lg:hidden p-1.5 rounded-lg text-[var(--fg-quieter)] hover:text-[var(--fg)] hover:bg-[var(--bg-quiet)]"
          >
            <X size={18} />
          </button>
        </div>

        {/* Smart Views */}
        <nav className="flex-1 overflow-y-auto px-2 py-3">
          <NavSection views={mainViews} pathname={pathname} getTaskCount={getTaskCount} onNavigate={() => setMobileMenuOpen(false)} t={t} />
          <NavSection views={scheduleViews} label={t('nav.schedule')} pathname={pathname} getTaskCount={getTaskCount} onNavigate={() => setMobileMenuOpen(false)} t={t} />
          <NavSection views={moreViews} label={t('nav.more')} pathname={pathname} getTaskCount={getTaskCount} onNavigate={() => setMobileMenuOpen(false)} t={t} />

          {/* Mini Timer */}
          <div className="mt-4 mx-1">
            <Link
              href="/timer"
              onClick={() => setMobileMenuOpen(false)}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-3 text-sm transition-colors',
                'border border-[var(--border)]',
                pathname === '/timer'
                  ? 'bg-[var(--accent)] text-white border-transparent'
                  : 'text-[var(--fg-quiet)] hover:text-[var(--fg)] hover:bg-[var(--bg-subtle)]'
              )}
            >
              <Timer size={18} />
              <div className="flex-1">
                <div className="font-mono text-lg font-semibold" style={{ fontFamily: 'var(--font-heading)' }}>
                  {formatTime(remainingSeconds)}
                </div>
                <div className="text-xs opacity-70 capitalize">
                  {status === 'running' ? `${mode === 'work' ? t('timer.focus') : mode === 'shortBreak' ? t('timer.shortBreak') : t('timer.longBreak')}` : t('nav.timer')}
                </div>
              </div>
              {status === 'running' && (
                <span className="h-2 w-2 rounded-full bg-[var(--positive)] animate-pulse" />
              )}
            </Link>
          </div>

        </nav>

        {/* Footer */}
        <div className="border-t border-[var(--border)] p-2 space-y-1">
          <AmbientPicker />
          <ThemeToggle />
          <LanguagePicker />
          <UserMenu />
        </div>
      </aside>
    </>
  );
}
