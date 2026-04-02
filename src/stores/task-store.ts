import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Task, Subtask, Priority, SmartViewType } from '@/types/task';
import { generateId, isToday, isOverdue, isFuture, isTomorrow, isThisWeek, isNextSevenDays, getNextRecurringDate } from '@/lib/utils';
import { PRIORITY_CONFIG } from '@/lib/constants';

interface TaskStore {
  tasks: Task[];
  selectedTaskId: string | null;
  searchQuery: string;
  sortMode: 'created' | 'priority' | 'dueDate' | 'alpha';

  addTask: (partial: Partial<Task>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleDone: (id: string) => void;

  addSubtask: (taskId: string, text: string) => void;
  toggleSubtask: (taskId: string, subtaskId: string) => void;
  deleteSubtask: (taskId: string, subtaskId: string) => void;

  selectTask: (id: string | null) => void;
  setSearchQuery: (q: string) => void;
  setSortMode: (mode: 'created' | 'priority' | 'dueDate' | 'alpha') => void;

  getTasksByView: (view: SmartViewType) => Task[];
  getTasksByList: (listId: string) => Task[];
  getTaskCount: (view: SmartViewType) => number;
  getFocusQueue: () => Task[];
}

function sortTasks(tasks: Task[], mode: 'created' | 'priority' | 'dueDate' | 'alpha'): Task[] {
  return [...tasks].sort((a, b) => {
    switch (mode) {
      case 'priority':
        return (PRIORITY_CONFIG[b.priority]?.weight ?? 0) - (PRIORITY_CONFIG[a.priority]?.weight ?? 0);
      case 'dueDate':
        if (!a.dueDate && !b.dueDate) return 0;
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return a.dueDate.localeCompare(b.dueDate);
      case 'alpha':
        return a.text.localeCompare(b.text);
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });
}

function filterByView(tasks: Task[], view: SmartViewType): Task[] {
  switch (view) {
    case 'inbox':
      return tasks.filter(t => !t.done && !t.listId && !isFuture(t.dueDate));
    case 'today':
      return tasks.filter(t => !t.done && (isToday(t.dueDate) || isOverdue(t.dueDate)));
    case 'overdue':
      return tasks.filter(t => !t.done && isOverdue(t.dueDate));
    case 'tomorrow':
      return tasks.filter(t => !t.done && isTomorrow(t.dueDate));
    case 'thisWeek':
      return tasks.filter(t => !t.done && isThisWeek(t.dueDate));
    case 'next7Days':
      return tasks.filter(t => !t.done && isNextSevenDays(t.dueDate));
    case 'scheduled':
      return tasks.filter(t => !t.done && t.dueDate && isFuture(t.dueDate));
    case 'planned':
      return tasks.filter(t => !t.done && t.dueDate);
    case 'flagged':
      return tasks.filter(t => !t.done && t.flagged);
    case 'all':
      return tasks.filter(t => !t.done);
    case 'someday':
      return tasks.filter(t => !t.done && !t.dueDate && !t.listId);
    case 'events':
      return tasks.filter(t => !t.done && t.isEvent);
    case 'completed':
      return tasks.filter(t => t.done);
    default:
      return tasks;
  }
}

function applySearch(tasks: Task[], query: string): Task[] {
  if (!query.trim()) return tasks;
  const q = query.toLowerCase();
  return tasks.filter(t =>
    t.text.toLowerCase().includes(q) || t.notes.toLowerCase().includes(q)
  );
}

export const useTaskStore = create<TaskStore>()(
  persist(
    (set, get) => ({
      tasks: [],
      selectedTaskId: null,
      searchQuery: '',
      sortMode: 'created' as const,

      addTask: (partial) => {
        const task: Task = {
          id: generateId(),
          text: partial.text || '',
          notes: partial.notes || '',
          priority: partial.priority || 'none',
          done: false,
          doneAt: null,
          dueDate: partial.dueDate || null,
          dueTime: partial.dueTime || null,
          flagged: partial.flagged || false,
          subtasks: partial.subtasks || [],
          tags: partial.tags || [],
          listId: partial.listId || null,
          recurring: partial.recurring || null,
          isEvent: partial.isEvent || false,
          eventStartTime: partial.eventStartTime || null,
          eventEndTime: partial.eventEndTime || null,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ tasks: [task, ...state.tasks] }));
      },

      updateTask: (id, updates) => {
        set((state) => ({
          tasks: state.tasks.map(t => t.id === id ? { ...t, ...updates } : t),
        }));
      },

      deleteTask: (id) => {
        set((state) => ({
          tasks: state.tasks.filter(t => t.id !== id),
          selectedTaskId: state.selectedTaskId === id ? null : state.selectedTaskId,
        }));
      },

      toggleDone: (id) => {
        set((state) => {
          const newTasks = [...state.tasks];
          const idx = newTasks.findIndex(t => t.id === id);
          if (idx === -1) return state;

          const task = newTasks[idx];
          const wasDone = task.done;

          if (!wasDone && task.recurring && task.dueDate) {
            // Create next recurring instance
            const nextDate = getNextRecurringDate(task.dueDate, task.recurring);
            const clone: Task = {
              ...task,
              id: generateId(),
              done: false,
              doneAt: null,
              dueDate: nextDate,
              createdAt: new Date().toISOString(),
            };
            newTasks.push(clone);
          }

          newTasks[idx] = {
            ...task,
            done: !wasDone,
            doneAt: !wasDone ? new Date().toISOString() : null,
          };

          return { tasks: newTasks };
        });
      },

      addSubtask: (taskId, text) => {
        const subtask: Subtask = { id: generateId(), text, done: false };
        set((state) => ({
          tasks: state.tasks.map(t =>
            t.id === taskId ? { ...t, subtasks: [...t.subtasks, subtask] } : t
          ),
        }));
      },

      toggleSubtask: (taskId, subtaskId) => {
        set((state) => ({
          tasks: state.tasks.map(t =>
            t.id === taskId
              ? {
                  ...t,
                  subtasks: t.subtasks.map(s =>
                    s.id === subtaskId ? { ...s, done: !s.done } : s
                  ),
                }
              : t
          ),
        }));
      },

      deleteSubtask: (taskId, subtaskId) => {
        set((state) => ({
          tasks: state.tasks.map(t =>
            t.id === taskId
              ? { ...t, subtasks: t.subtasks.filter(s => s.id !== subtaskId) }
              : t
          ),
        }));
      },

      selectTask: (id) => set({ selectedTaskId: id }),
      setSearchQuery: (q) => set({ searchQuery: q }),
      setSortMode: (mode) => set({ sortMode: mode }),

      getTasksByView: (view) => {
        const { tasks, searchQuery, sortMode } = get();
        return sortTasks(applySearch(filterByView(tasks, view), searchQuery), sortMode);
      },

      getTasksByList: (listId) => {
        const { tasks, searchQuery, sortMode } = get();
        const filtered = tasks.filter(t => !t.done && t.listId === listId);
        return sortTasks(applySearch(filtered, searchQuery), sortMode);
      },

      getTaskCount: (view) => {
        return filterByView(get().tasks, view).length;
      },

      getFocusQueue: () => {
        const tasks = get().tasks.filter(t => !t.done);
        return tasks.sort((a, b) => {
          const aUrgent = isToday(a.dueDate) || isOverdue(a.dueDate) ? 1 : 0;
          const bUrgent = isToday(b.dueDate) || isOverdue(b.dueDate) ? 1 : 0;
          if (bUrgent !== aUrgent) return bUrgent - aUrgent;
          const aPri = PRIORITY_CONFIG[a.priority]?.weight ?? 0;
          const bPri = PRIORITY_CONFIG[b.priority]?.weight ?? 0;
          if (bPri !== aPri) return bPri - aPri;
          return (b.flagged ? 1 : 0) - (a.flagged ? 1 : 0);
        });
      },
    }),
    {
      name: 'lucy-tasks',
      partialize: (state) => ({ tasks: state.tasks }),
    }
  )
);
