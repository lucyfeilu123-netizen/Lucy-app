'use client';

import { useState, KeyboardEvent } from 'react';
import {
  Star, Trash2, Plus, X, RotateCcw,
  Calendar, Clock, Tag, AlertCircle, CalendarHeart, Save
} from 'lucide-react';
import { Task, Priority, RecurringRule } from '@/types/task';
import { useTaskStore } from '@/stores/task-store';
import { useListStore } from '@/stores/list-store';
import { useUIStore } from '@/stores/ui-store';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { TimePicker } from '@/components/ui/time-picker';
import { PRIORITY_CONFIG } from '@/lib/constants';
import { cn } from '@/lib/utils';

interface TaskEditorProps {
  task: Task;
}

const priorities: Priority[] = ['none', 'low', 'medium', 'high', 'urgent'];
const recurringOptions: { label: string; value: RecurringRule }[] = [
  { label: 'None', value: null },
  { label: 'Daily', value: 'daily' },
  { label: 'Weekly', value: 'weekly' },
  { label: 'Monthly', value: 'monthly' },
];

const TAG_PRESETS = ['Party', 'Work', 'School', 'Household', 'Shopping', 'Personal', 'Health', 'Travel'];

export function TaskEditor({ task }: TaskEditorProps) {
  const updateTask = useTaskStore((s) => s.updateTask);
  const deleteTask = useTaskStore((s) => s.deleteTask);
  const toggleDone = useTaskStore((s) => s.toggleDone);
  const selectTask = useTaskStore((s) => s.selectTask);
  const setDetailPanelOpen = useUIStore((s) => s.setDetailPanelOpen);
  const lists = useListStore((s) => s.lists);

  const [newTag, setNewTag] = useState('');

  const handleDelete = () => {
    deleteTask(task.id);
    selectTask(null);
    setDetailPanelOpen(false);
  };

  const handleSave = () => {
    selectTask(null);
    setDetailPanelOpen(false);
  };

  const toggleTag = (tag: string) => {
    const lower = tag.toLowerCase();
    if (task.tags.includes(lower)) {
      updateTask(task.id, { tags: task.tags.filter(t => t !== lower) });
    } else {
      updateTask(task.id, { tags: [...task.tags, lower] });
    }
  };

  const handleAddCustomTag = () => {
    if (!newTag.trim()) return;
    const tag = newTag.trim().toLowerCase().replace(/^#/, '');
    if (!task.tags.includes(tag)) {
      updateTask(task.id, { tags: [...task.tags, tag] });
    }
    setNewTag('');
  };

  const removeTag = (tag: string) => {
    updateTask(task.id, { tags: task.tags.filter(t => t !== tag) });
  };

  // Parse start/end for separate date and time inputs
  const startDate = task.eventStartTime ? task.eventStartTime.split('T')[0] : '';
  const startTime = task.eventStartTime ? task.eventStartTime.split('T')[1]?.slice(0, 5) : '';
  const endDate = task.eventEndTime ? task.eventEndTime.split('T')[0] : '';
  const endTime = task.eventEndTime ? task.eventEndTime.split('T')[1]?.slice(0, 5) : '';

  const updateStartDateTime = (date: string, time: string) => {
    if (date && time) {
      updateTask(task.id, { eventStartTime: `${date}T${time}` });
    } else if (date) {
      updateTask(task.id, { eventStartTime: `${date}T${startTime || '09:00'}` });
    }
  };

  const updateEndDateTime = (date: string, time: string) => {
    if (date && time) {
      updateTask(task.id, { eventEndTime: `${date}T${time}` });
    } else if (date) {
      updateTask(task.id, { eventEndTime: `${date}T${endTime || '10:00'}` });
    }
  };

  return (
    <div className="space-y-0">
      {/* Title */}
      <div className="flex items-start gap-3">
        <div className="pt-1">
          <Checkbox checked={task.done} onChange={() => toggleDone(task.id)} />
        </div>
        <input
          type="text"
          value={task.text}
          onChange={(e) => updateTask(task.id, { text: e.target.value })}
          placeholder={task.isEvent ? 'Event name...' : 'Task name...'}
          className={cn(
            'flex-1 bg-transparent text-base font-medium text-[var(--fg)]',
            'focus:outline-none',
            task.done && 'line-through text-[var(--fg-quieter)]'
          )}
          style={{ fontFamily: 'var(--font-heading)' }}
        />
        <button
          onClick={() => updateTask(task.id, { flagged: !task.flagged })}
          className="p-1 rounded-lg hover:bg-[var(--bg-quiet)] transition-colors"
        >
          <Star
            size={16}
            className={task.flagged ? 'fill-[var(--costa-350)] text-[var(--costa-350)]' : 'text-[var(--fg-quieter)]'}
          />
        </button>
      </div>

      {/* Notes */}
      <div className="border-b border-[var(--border)] my-4" />
      <textarea
        value={task.notes}
        onChange={(e) => updateTask(task.id, { notes: e.target.value })}
        placeholder="Add notes..."
        rows={3}
        className={cn(
          'w-full bg-transparent text-sm text-[var(--fg-quiet)] placeholder:text-[var(--fg-quieter)]',
          'resize-none focus:outline-none border border-[var(--border)] rounded-lg p-3'
        )}
      />

      {/* Priority */}
      <div className="border-b border-[var(--border)] my-4" />
      <div>
        <label className="flex items-center gap-2 text-xs font-medium text-[var(--fg-quieter)] mb-2">
          <AlertCircle size={12} /> Priority
        </label>
        <div className="flex gap-1.5 flex-wrap">
          {priorities.map((p) => (
            <button
              key={p}
              onClick={() => updateTask(task.id, { priority: p })}
              className={cn(
                'px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors min-w-[44px]',
                task.priority === p
                  ? 'ring-2 ring-[var(--accent)]'
                  : 'hover:bg-[var(--bg-quiet)]'
              )}
              style={{
                color: PRIORITY_CONFIG[p].color,
                backgroundColor: task.priority === p
                  ? `color-mix(in oklch, ${PRIORITY_CONFIG[p].color} 15%, transparent)`
                  : undefined,
              }}
            >
              {PRIORITY_CONFIG[p].label}
            </button>
          ))}
        </div>
      </div>

      {/* Event toggle */}
      <div className="border-b border-[var(--border)] my-4" />
      <div>
        <label className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-xs font-medium text-[var(--fg-quieter)]">
            <CalendarHeart size={12} /> Event
          </span>
          <button
            onClick={() => updateTask(task.id, { isEvent: !task.isEvent })}
            className={cn(
              'relative h-6 w-11 rounded-full transition-colors',
              task.isEvent ? 'bg-[var(--accent)]' : 'bg-[var(--bg-quiet)]'
            )}
          >
            <span
              className={cn(
                'absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white transition-transform shadow-sm',
                task.isEvent && 'translate-x-5'
              )}
            />
          </button>
        </label>
      </div>

      {/* Event time pickers (only when isEvent) */}
      {task.isEvent && (
        <div className="space-y-3 p-3 rounded-lg border border-[var(--border)] bg-[var(--bg-subtle)]">
          {/* Start */}
          <div>
            <label className="text-xs text-[var(--fg-quieter)] mb-1.5 block flex items-center gap-1">
              <Clock size={10} /> Start
            </label>
            <div className="space-y-2">
              <input
                type="date"
                value={startDate}
                onChange={(e) => updateStartDateTime(e.target.value, startTime)}
                className="w-full h-10 rounded-lg border border-[var(--border)] bg-[var(--bg-surface)] px-3 text-sm text-[var(--fg)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
              />
              <TimePicker
                value={startTime}
                onChange={(t) => updateStartDateTime(startDate, t)}
              />
            </div>
          </div>
          {/* End */}
          <div>
            <label className="text-xs text-[var(--fg-quieter)] mb-1.5 block flex items-center gap-1">
              <Clock size={10} /> End
            </label>
            <div className="space-y-2">
              <input
                type="date"
                value={endDate}
                onChange={(e) => updateEndDateTime(e.target.value, endTime)}
                className="w-full h-10 rounded-lg border border-[var(--border)] bg-[var(--bg-surface)] px-3 text-sm text-[var(--fg)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
              />
              <TimePicker
                value={endTime}
                onChange={(t) => updateEndDateTime(endDate, t)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Due Date & Time (only for non-events) */}
      {!task.isEvent && (
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="flex items-center gap-2 text-xs font-medium text-[var(--fg-quieter)] mb-2">
              <Calendar size={12} /> Due Date
            </label>
            <input
              type="date"
              value={task.dueDate || ''}
              onChange={(e) => updateTask(task.id, { dueDate: e.target.value || null })}
              className="w-full h-10 rounded-lg border border-[var(--border)] bg-[var(--bg-surface)] px-3 text-sm text-[var(--fg)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
            />
          </div>
          <div>
            <label className="flex items-center gap-2 text-xs font-medium text-[var(--fg-quieter)] mb-2">
              <Clock size={12} /> Time
            </label>
            <TimePicker
              value={task.dueTime || ''}
              onChange={(t) => updateTask(task.id, { dueTime: t || null })}
            />
          </div>
        </div>
      )}

      {/* List (only for non-events) */}
      {!task.isEvent && (
        <div>
          <label className="flex items-center gap-2 text-xs font-medium text-[var(--fg-quieter)] mb-2">
            List
          </label>
          <select
            value={task.listId || ''}
            onChange={(e) => updateTask(task.id, { listId: e.target.value || null })}
            className="w-full h-10 rounded-lg border border-[var(--border)] bg-[var(--bg-surface)] px-3 text-sm text-[var(--fg)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
          >
            <option value="">No list</option>
            {lists.map((l) => (
              <option key={l.id} value={l.id}>{l.emoji} {l.name}</option>
            ))}
          </select>
        </div>
      )}

      {/* Recurring */}
      <div className="border-b border-[var(--border)] my-4" />
      <div>
        <label className="flex items-center gap-2 text-xs font-medium text-[var(--fg-quieter)] mb-2">
          <RotateCcw size={12} /> Recurring
        </label>
        <div className="flex gap-1.5 flex-wrap">
          {recurringOptions.map((opt) => (
            <button
              key={opt.label}
              onClick={() => updateTask(task.id, { recurring: opt.value })}
              className={cn(
                'px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors min-w-[44px]',
                task.recurring === opt.value
                  ? 'bg-[var(--accent)] text-white'
                  : 'text-[var(--fg-quiet)] hover:bg-[var(--bg-quiet)]'
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tags with presets */}
      <div className="border-b border-[var(--border)] my-4" />
      <div>
        <label className="flex items-center gap-2 text-xs font-medium text-[var(--fg-quieter)] mb-2">
          <Tag size={12} /> Tags
        </label>
        {/* Preset tags */}
        <div className="flex flex-wrap gap-1.5 mb-2">
          {TAG_PRESETS.map((tag) => {
            const isActive = task.tags.includes(tag.toLowerCase());
            return (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={cn(
                  'px-2.5 py-1 rounded-full text-xs font-medium transition-colors',
                  isActive
                    ? 'bg-[var(--accent)] text-white'
                    : 'bg-[var(--bg-quiet)] text-[var(--fg-quiet)] hover:text-[var(--fg)]'
                )}
              >
                {tag}
              </button>
            );
          })}
        </div>
        {/* Custom tags */}
        <div className="flex flex-wrap gap-1.5 mb-2">
          {task.tags.filter(t => !TAG_PRESETS.map(p => p.toLowerCase()).includes(t)).map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 rounded-full bg-[var(--bg-quiet)] px-2 py-0.5 text-xs text-[var(--fg-quiet)]"
            >
              #{tag}
              <button onClick={() => removeTag(tag)} className="hover:text-[var(--negative)]">
                <X size={10} />
              </button>
            </span>
          ))}
        </div>
        {/* Add custom tag */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyDown={(e: KeyboardEvent) => e.key === 'Enter' && handleAddCustomTag()}
            placeholder="Custom tag..."
            className="flex-1 bg-transparent text-sm text-[var(--fg)] placeholder:text-[var(--fg-quieter)] focus:outline-none"
          />
          <button onClick={handleAddCustomTag} className="text-[var(--fg-quieter)] hover:text-[var(--fg)]">
            <Plus size={14} />
          </button>
        </div>
      </div>

      {/* Save button */}
      <div className="border-b border-[var(--border)] my-4" />
      <Button onClick={handleSave} className="w-full" variant="primary">
        <Save size={14} />
        Save
      </Button>

      {/* Delete */}
      <Button variant="danger" size="sm" onClick={handleDelete} className="w-full">
        <Trash2 size={14} />
        Delete
      </Button>
    </div>
  );
}
