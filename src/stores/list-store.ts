import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { TaskList } from '@/types/task';
import { generateId } from '@/lib/utils';

interface ListStore {
  lists: TaskList[];
  addList: (partial: Partial<TaskList>) => void;
  updateList: (id: string, updates: Partial<TaskList>) => void;
  deleteList: (id: string) => void;
}

export const useListStore = create<ListStore>()(
  persist(
    (set) => ({
      lists: [],

      addList: (partial) => {
        const list: TaskList = {
          id: generateId(),
          name: partial.name || 'New List',
          color: partial.color || '#3b82f6',
          emoji: partial.emoji || '\u{1F4C1}',
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ lists: [...state.lists, list] }));
      },

      updateList: (id, updates) => {
        set((state) => ({
          lists: state.lists.map(l => l.id === id ? { ...l, ...updates } : l),
        }));
      },

      deleteList: (id) => {
        set((state) => ({
          lists: state.lists.filter(l => l.id !== id),
        }));
      },
    }),
    { name: 'lucy-lists' }
  )
);
