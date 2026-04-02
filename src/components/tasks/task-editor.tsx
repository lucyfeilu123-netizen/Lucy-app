'use client';

import { useState, KeyboardEvent } from 'react';
import {
  Star, Trash2, Plus, X, RotateCcw,
  Flag, Calendar, Clock, Tag, List, AlertCircle
} from 'lucide-react';
import { Task, Priority, RecurringRule } from '@/types/task';
import { useTaskStore } from '@/stores/task-store';
import { useListStore } from '@/stores/list-store';
import { useUIStore } from '@/stores/ui-store';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
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

export function TaskEditor({ task }: TaskEditorProps) {
  const updateTask = useTaskStore((s) => s.updateTask);
  const deleteTask = useTaskStore((s) => s.deleteTask);
  const toggleDone = useTaskStore((s) => s.toggleDone);
  const selectTask = useTaskStore((s) => s.selectTask);
  const addSubtask = useTaskStore((s) => s.addSubtask);
  const toggleSubtask = useTaskStore((s) => s.toggleSubtask);
  const deleteSubtask = useTaskStore((s) => s.deleteSubtask);
  const setDetailPanelOpen = useUIStore((s) => s.setDetailPanelOpen);
  const lists = useListStore((s) => s.lists);

  const [newSubtask, setNewSubtask] = useState('');
  const [newTag, setNewTag] = useState('');

  const handleDelete = () => {
    deleteTask(task.id);
    selectTask(null);
    setDetailPanelOpen(false);
  };

  const handleAddSubtask = () => {
    if (!newSubtask.trim()) return;
    addSubtask(task.id, newSubtask.trim());
    setNewSubtask('');
  };

  const handleAddTag = () => {
    if (!newTag.trim()) return;
    const tag = newTag.trim().replace(/^#/, '');
    if (!task.tags.includes(tag)) {
      updateTask(task.id, { tags: [...task.tags, tag] });
    }
    setNewTag('');
  };

  const removeTag = (tag: string) => {
    updateTask(task.id, { tags: task.tags.filter(t => t !== tag) });
  };

  return (
    <div className="space-y-5">
      {/* Title */}
      <div className="flex items-start gap-3">
        <div className="pt-1">
          <Checkbox checked={task.done} onChange={() => toggleDone(task.id)} />
        </div>
        <input
          type="text"
          value={task.text}
          onChange={(e) => updateTask(task.id, { text: e.target.value })}
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
      <div>
        <label className="flex items-center gap-2 text-xs font-medium text-[var(--fg-quieter)] mb-2">
          <AlertCircle size={12} /> Priority
        </label>
        <div className="flex gap-1.5">
          {priorities.map((p) => (
            <button
              key={p}
              onClick={() => updateTask(task.id, { priority: p })}
              className={cn(
                'px-2.5 py-1 rounded-md text-xs font-medium transition-colors',
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

      {/* Due Date & Time */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="flex items-center gap-2 text-xs font-medium text-[var(--fg-quieter)] mb-2">
            <Calendar size={12} /> Due Date
          </label>
          <input
            type="date"
            value={task.dueDate || ''}
            onChange={(e) => updateTask(task.id, { dueDate: e.target.value || null })}
            className="w-full h-9 rounded-lg border border-[var(--border)] bg-[var(--bg-surface)] px-3 text-sm text-[var(--fg)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
          />
        </div>
        <div>
          <label className="flex items-center gap-2 text-xs font-medium text-[var(--fg-quieter)] mb-2">
            <Clock size={12} /> Time
          </label>
          <input
            type="time"
            value={task.dueTime || ''}
            onChange={(e) => updateTask(task.id, { dueTime: e.target.value || null })}
            className="w-full h-9 rounded-lg border border-[var(--border)] bg-[var(--bg-surface)] px-3 text-sm text-[var(--fg)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
          />
        </div>
      </div>

      {/* List assignment */}
      <div>
        <label className="flex items-center gap-2 text-xs font-medium text-[var(--fg-quieter)] mb-2">
          <List size={12} /> List
        </label>
        <select
          value={task.listId || ''}
          onChange={(e) => updateTask(task.id, { listId: e.target.value || null })}
          className="w-full h-9 rounded-lg border border-[var(--border)] bg-[var(--bg-surface)] px-3 text-sm text-[var(--fg)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
        >
          <option value="">No list</option>
          {lists.map((l) => (
            <option key={l.id} value={l.id}>{l.emoji} {l.name}</option>
          ))}
        </select>
      </div>

      {/* Recurring */}
      <div>
        <label className="flex items-center gap-2 text-xs font-medium text-[var(--fg-quieter)] mb-2">
          <RotateCcw size={12} /> Recurring
        </label>
        <div className="flex gap-1.5">
          {recurringOptions.map((opt) => (
            <button
              key={opt.label}
              onClick={() => updateTask(task.id, { recurring: opt.value })}
              className={cn(
                'px-2.5 py-1 rounded-md text-xs font-medium transition-colors',
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

      {/* Subtasks */}
      <div>
        <label className="flex items-center gap-2 text-xs font-medium text-[var(--fg-quieter)] mb-2">
          Subtasks ({task.subtasks.filter(s => s.done).length}/{task.subtasks.length})
        </label>
        <div className="space-y-1">
          {task.subtasks.map((sub) => (
            <div key={sub.id} className="flex items-center gap-2 group">
              <Checkbox
                checked={sub.done}
                onChange={() => toggleSubtask(task.id, sub.id)}
                className="h-4 w-4"
              />
              <span className={cn(
                'flex-1 text-sm text-[var(--fg-quiet)]',
                sub.done && 'line-through text-[var(--fg-quieter)]'
              )}>
                {sub.text}
              </span>
              <button
                onClick={() => deleteSubtask(task.id, sub.id)}
                className="opacity-0 group-hover:opacity-100 p-0.5 rounded text-[var(--fg-quieter)] hover:text-[var(--negative)] transition-all"
              >
                <X size={12} />
              </button>
            </div>
          ))}
          <div className="flex items-center gap-2 mt-1">
            <input
              type="text"
              value={newSubtask}
              onChange={(e) => setNewSubtask(e.target.value)}
              onKeyDown={(e: KeyboardEvent) => e.key === 'Enter' && handleAddSubtask()}
              placeholder="Add subtask..."
              className="flex-1 bg-transparent text-sm text-[var(--fg)] placeholder:text-[var(--fg-quieter)] focus:outline-none"
            />
            <button onClick={handleAddSubtask} className="text-[var(--fg-quieter)] hover:text-[var(--fg)]">
              <Plus size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Tags */}
      <div>
        <label className="flex items-center gap-2 text-xs font-medium text-[var(--fg-quieter)] mb-2">
          <Tag size={12} /> Tags
        </label>
        <div className="flex flex-wrap gap-1.5 mb-2">
          {task.tags.map((tag) => (
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
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyDown={(e: KeyboardEvent) => e.key === 'Enter' && handleAddTag()}
            placeholder="Add tag..."
            className="flex-1 bg-transparent text-sm text-[var(--fg)] placeholder:text-[var(--fg-quieter)] focus:outline-none"
          />
          <button onClick={handleAddTag} className="text-[var(--fg-quieter)] hover:text-[var(--fg)]">
            <Plus size={14} />
          </button>
        </div>
      </div>

      {/* Delete */}
      <div className="pt-4 border-t border-[var(--border)]">
        <Button variant="danger" size="sm" onClick={handleDelete} className="w-full">
          <Trash2 size={14} />
          Delete Task
        </Button>
      </div>
    </div>
  );
}
