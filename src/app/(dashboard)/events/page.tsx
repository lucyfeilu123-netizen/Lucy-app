'use client';

import { useState, useMemo, useRef } from 'react';
import { CalendarHeart, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { useTaskStore } from '@/stores/task-store';
import { useUIStore } from '@/stores/ui-store';
import { cn } from '@/lib/utils';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const HOURS = Array.from({ length: 18 }, (_, i) => i + 6); // 6 AM to 11 PM

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

function formatHour(h: number) {
  if (h === 0 || h === 12) return h === 0 ? '12 AM' : '12 PM';
  return h < 12 ? `${h} AM` : `${h - 12} PM`;
}

function isSameDay(dateStr: string | null, year: number, month: number, day: number) {
  if (!dateStr) return false;
  const d = new Date(dateStr);
  return d.getFullYear() === year && d.getMonth() === month && d.getDate() === day;
}

// Color palette for event bars
const eventColors = [
  'var(--accent)', 'var(--positive)', 'var(--warning)',
  'var(--rosa-350)', 'var(--limsa-350)', 'var(--kuja-350)',
  'var(--costa-350)', 'var(--gridania-350)',
];

export default function EventsPage() {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selectedDay, setSelectedDay] = useState(today.getDate());

  const tasks = useTaskStore((s) => s.tasks);
  const addTask = useTaskStore((s) => s.addTask);
  const selectTask = useTaskStore((s) => s.selectTask);
  const setDetailPanelOpen = useUIStore((s) => s.setDetailPanelOpen);

  // Get all events
  const events = useMemo(() =>
    tasks.filter(t => t.isEvent && !t.done),
    [tasks]
  );

  // Check if a day has events
  const dayHasEvents = (day: number) => {
    return events.some(e => {
      if (e.eventStartTime) {
        return isSameDay(e.eventStartTime, viewYear, viewMonth, day);
      }
      if (e.dueDate) {
        const d = new Date(e.dueDate + 'T00:00:00');
        return d.getFullYear() === viewYear && d.getMonth() === viewMonth && d.getDate() === day;
      }
      return false;
    });
  };

  // Get events for selected day
  const selectedDateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`;
  const dayEvents = useMemo(() => {
    return events.filter(e => {
      if (e.eventStartTime) {
        return isSameDay(e.eventStartTime, viewYear, viewMonth, selectedDay);
      }
      if (e.dueDate) {
        return e.dueDate === selectedDateStr;
      }
      return false;
    }).sort((a, b) => {
      const aTime = a.eventStartTime || '0';
      const bTime = b.eventStartTime || '0';
      return aTime.localeCompare(bTime);
    });
  }, [events, viewYear, viewMonth, selectedDay, selectedDateStr]);

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth);
  const isToday = (day: number) =>
    viewYear === today.getFullYear() && viewMonth === today.getMonth() && day === today.getDate();

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(viewYear - 1); }
    else setViewMonth(viewMonth - 1);
    setSelectedDay(1);
  };

  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(viewYear + 1); }
    else setViewMonth(viewMonth + 1);
    setSelectedDay(1);
  };

  const handleAddEvent = () => {
    const now = new Date();
    const startHour = now.getHours() + 1;
    const startTime = `${selectedDateStr}T${String(startHour).padStart(2, '0')}:00`;
    const endTime = `${selectedDateStr}T${String(startHour + 1).padStart(2, '0')}:00`;
    addTask({
      text: 'New Event',
      isEvent: true,
      dueDate: selectedDateStr,
      eventStartTime: startTime,
      eventEndTime: endTime,
    });
    // Select the newly created task to edit it
    const newTasks = useTaskStore.getState().tasks;
    const newest = newTasks[0]; // addTask prepends
    if (newest) {
      selectTask(newest.id);
      setDetailPanelOpen(true);
    }
  };

  const handleEventClick = (taskId: string) => {
    selectTask(taskId);
    setDetailPanelOpen(true);
  };

  // Drag-to-select state
  const [dragging, setDragging] = useState(false);
  const [dragStartHour, setDragStartHour] = useState<number | null>(null);
  const [dragEndHour, setDragEndHour] = useState<number | null>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

  const getHourFromY = (clientY: number): number => {
    if (!timelineRef.current) return 6;
    const rect = timelineRef.current.getBoundingClientRect();
    const relY = clientY - rect.top;
    const totalHeight = rect.height;
    const hour = 6 + (relY / totalHeight) * 18; // 6 AM to midnight (18 hours)
    return Math.max(6, Math.min(23, Math.round(hour * 2) / 2)); // snap to 30min
  };

  const handleDragStart = (clientY: number) => {
    const hour = getHourFromY(clientY);
    setDragging(true);
    setDragStartHour(hour);
    setDragEndHour(hour);
  };

  const handleDragMove = (clientY: number) => {
    if (!dragging) return;
    setDragEndHour(getHourFromY(clientY));
  };

  const handleDragEnd = () => {
    if (!dragging || dragStartHour === null || dragEndHour === null) {
      setDragging(false);
      return;
    }
    setDragging(false);
    const startH = Math.min(dragStartHour, dragEndHour);
    const endH = Math.max(dragStartHour, dragEndHour);
    if (endH - startH < 0.5) return; // too small

    const startHour = Math.floor(startH);
    const startMin = (startH % 1) * 60;
    const endHour = Math.floor(endH);
    const endMin = (endH % 1) * 60;

    const dragStartTime = `${selectedDateStr}T${String(startHour).padStart(2, '0')}:${String(startMin).padStart(2, '0')}`;
    const dragEndTime = `${selectedDateStr}T${String(endHour).padStart(2, '0')}:${String(endMin).padStart(2, '0')}`;

    addTask({
      text: 'New Event',
      isEvent: true,
      dueDate: selectedDateStr,
      eventStartTime: dragStartTime,
      eventEndTime: dragEndTime,
    });

    const newTasks = useTaskStore.getState().tasks;
    const newest = newTasks[0];
    if (newest) {
      selectTask(newest.id);
      setDetailPanelOpen(true);
    }

    setDragStartHour(null);
    setDragEndHour(null);
  };

  const monthName = new Date(viewYear, viewMonth).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <div className="p-4 max-w-lg mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <CalendarHeart size={24} className="text-[var(--rosa-350)]" />
        <h1 className="text-xl font-bold text-[var(--fg)]" style={{ fontFamily: 'var(--font-heading)' }}>
          Events
        </h1>
      </div>

      {/* Month navigation */}
      <div className="flex items-center justify-between mb-4">
        <button onClick={prevMonth} className="p-2 rounded-lg text-[var(--fg-quiet)] hover:bg-[var(--bg-quiet)]">
          <ChevronLeft size={20} />
        </button>
        <span className="text-sm font-semibold text-[var(--fg)]" style={{ fontFamily: 'var(--font-heading)' }}>
          {monthName}
        </span>
        <button onClick={nextMonth} className="p-2 rounded-lg text-[var(--fg-quiet)] hover:bg-[var(--bg-quiet)]">
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 mb-1">
        {DAYS.map(d => (
          <div key={d} className="text-center text-[10px] font-medium text-[var(--fg-quieter)] py-1">
            {d}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-px mb-6">
        {/* Empty cells for days before first day */}
        {Array.from({ length: firstDay }, (_, i) => (
          <div key={`empty-${i}`} className="h-10" />
        ))}
        {/* Day cells */}
        {Array.from({ length: daysInMonth }, (_, i) => {
          const day = i + 1;
          const selected = day === selectedDay;
          const todayCell = isToday(day);
          const hasEvents = dayHasEvents(day);
          return (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={cn(
                'h-10 flex flex-col items-center justify-center rounded-lg text-sm relative transition-colors',
                selected && 'bg-[var(--accent)] text-white',
                !selected && todayCell && 'bg-[var(--bg-quiet)] text-[var(--fg)] font-semibold',
                !selected && !todayCell && 'text-[var(--fg-quiet)] hover:bg-[var(--bg-subtle)]',
              )}
            >
              {day}
              {hasEvents && !selected && (
                <div className="absolute bottom-1 h-1 w-1 rounded-full bg-[var(--accent)]" />
              )}
            </button>
          );
        })}
      </div>

      {/* Selected day header */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-[var(--fg)]">
          {new Date(viewYear, viewMonth, selectedDay).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
        </h2>
        <button
          onClick={handleAddEvent}
          className="flex items-center gap-1.5 rounded-lg bg-[var(--accent)] text-white px-3 py-1.5 text-xs font-medium hover:opacity-90 transition-opacity"
        >
          <Plus size={14} />
          Add Event
        </button>
      </div>

      {/* Timeline view for selected day */}
      {dayEvents.length === 0 ? (
        <div className="py-8 text-center text-sm text-[var(--fg-quieter)]">
          No events on this day
        </div>
      ) : (
        <div className="space-y-2">
          {dayEvents.map((event, idx) => {
            const start = event.eventStartTime ? new Date(event.eventStartTime) : null;
            const end = event.eventEndTime ? new Date(event.eventEndTime) : null;
            const startLabel = start ? start.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }) : '';
            const endLabel = end ? end.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }) : '';
            const color = eventColors[idx % eventColors.length];

            return (
              <button
                key={event.id}
                onClick={() => handleEventClick(event.id)}
                className="w-full flex items-stretch gap-3 rounded-lg overflow-hidden hover:opacity-90 transition-opacity text-left"
                style={{ backgroundColor: `color-mix(in oklch, ${color} 15%, transparent)` }}
              >
                {/* Color bar */}
                <div className="w-1 shrink-0 rounded-l-lg" style={{ backgroundColor: color }} />
                {/* Content */}
                <div className="py-2.5 pr-3 flex-1 min-w-0">
                  <p className="text-sm font-medium text-[var(--fg)] truncate">{event.text}</p>
                  {(startLabel || endLabel) && (
                    <p className="text-xs text-[var(--fg-quieter)] mt-0.5">
                      {startLabel}{endLabel ? ` — ${endLabel}` : ''}
                    </p>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Interactive Day Overview Timeline */}
      <div className="mt-4 border-t border-[var(--border)] pt-4">
        <h3 className="text-xs font-medium text-[var(--fg-quieter)] uppercase tracking-wider mb-3">
          Day Overview — drag to create event
        </h3>
        <div
          ref={timelineRef}
          className="relative select-none touch-none"
          onMouseDown={(e) => handleDragStart(e.clientY)}
          onMouseMove={(e) => handleDragMove(e.clientY)}
          onMouseUp={handleDragEnd}
          onMouseLeave={() => dragging && handleDragEnd()}
          onTouchStart={(e) => handleDragStart(e.touches[0].clientY)}
          onTouchMove={(e) => { e.preventDefault(); handleDragMove(e.touches[0].clientY); }}
          onTouchEnd={handleDragEnd}
        >
          {HOURS.map(h => (
            <div key={h} className="flex items-start gap-2 h-10 relative">
              <span className="text-[10px] text-[var(--fg-quieter)] w-12 text-right shrink-0 -mt-1">
                {formatHour(h)}
              </span>
              <div className="flex-1 border-t border-[var(--border)] h-full relative" />
            </div>
          ))}

          {/* Drag selection overlay */}
          {dragging && dragStartHour !== null && dragEndHour !== null && (
            <div
              className="absolute left-14 right-0 bg-[var(--accent)] opacity-20 rounded pointer-events-none"
              style={{
                top: `${((Math.min(dragStartHour, dragEndHour) - 6) / 18) * 100}%`,
                height: `${(Math.abs(dragEndHour - dragStartHour) / 18) * 100}%`,
              }}
            />
          )}

          {/* Existing event bars */}
          {dayEvents.map((event, idx) => {
            const start = event.eventStartTime ? new Date(event.eventStartTime) : null;
            const end = event.eventEndTime ? new Date(event.eventEndTime) : null;
            if (!start) return null;
            const startH = start.getHours() + start.getMinutes() / 60;
            const endH = end ? end.getHours() + end.getMinutes() / 60 : startH + 1;
            const color = eventColors[idx % eventColors.length];
            return (
              <div
                key={event.id}
                className="absolute left-14 right-0 rounded text-[10px] text-white px-2 py-0.5 truncate cursor-pointer z-10"
                style={{
                  top: `${((startH - 6) / 18) * 100}%`,
                  height: `${Math.max(2.5, ((endH - startH) / 18) * 100)}%`,
                  backgroundColor: color,
                  opacity: 0.85,
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleEventClick(event.id);
                }}
              >
                {event.text}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
