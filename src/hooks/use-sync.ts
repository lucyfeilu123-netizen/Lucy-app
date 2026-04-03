'use client';

import { useEffect, useRef, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useTaskStore } from '@/stores/task-store';
import { useListStore } from '@/stores/list-store';
import {
  fetchTasks, upsertTask, deleteTaskFromDb,
  fetchLists, upsertList, deleteListFromDb,
} from '@/lib/supabase/database';
import { Task, TaskList } from '@/types/task';

export function useSync() {
  const initializedRef = useRef(false);
  const userIdRef = useRef<string | null>(null);
  const prevTaskIdsRef = useRef<Set<string>>(new Set());
  const prevListIdsRef = useRef<Set<string>>(new Set());
  const syncTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const loadFromCloud = useCallback(async (userId: string) => {
    const [cloudTasks, cloudLists] = await Promise.all([
      fetchTasks(userId),
      fetchLists(userId),
    ]);

    const localTasks = useTaskStore.getState().tasks;
    const localLists = useListStore.getState().lists;

    // Merge strategy: cloud wins for existing items, keep local-only items
    const cloudTaskMap = new Map(cloudTasks.map(t => [t.id, t]));

    const mergedTasks: Task[] = [];
    // Add all cloud tasks
    for (const task of cloudTasks) {
      mergedTasks.push(task);
    }
    // Add local-only tasks (not in cloud) and upload them
    for (const task of localTasks) {
      if (!cloudTaskMap.has(task.id)) {
        mergedTasks.push(task);
        upsertTask(task, userId);
      }
    }

    const cloudListMap = new Map(cloudLists.map(l => [l.id, l]));
    const mergedLists: TaskList[] = [];
    for (const list of cloudLists) {
      mergedLists.push(list);
    }
    for (const list of localLists) {
      if (!cloudListMap.has(list.id)) {
        mergedLists.push(list);
        upsertList(list, userId);
      }
    }

    useTaskStore.setState({ tasks: mergedTasks });
    useListStore.setState({ lists: mergedLists });

    prevTaskIdsRef.current = new Set(mergedTasks.map(t => t.id));
    prevListIdsRef.current = new Set(mergedLists.map(l => l.id));
  }, []);

  // Subscribe to store changes and sync to cloud
  useEffect(() => {
    const unsubTasks = useTaskStore.subscribe((state) => {
      const userId = userIdRef.current;
      if (!userId || !initializedRef.current) return;

      if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current);
      syncTimeoutRef.current = setTimeout(() => {
        const currentIds = new Set(state.tasks.map(t => t.id));

        // Detect deleted tasks
        for (const prevId of prevTaskIdsRef.current) {
          if (!currentIds.has(prevId)) {
            deleteTaskFromDb(prevId);
          }
        }

        // Upsert all current tasks
        for (const task of state.tasks) {
          upsertTask(task, userId);
        }

        prevTaskIdsRef.current = currentIds;
      }, 1000);
    });

    const unsubLists = useListStore.subscribe((state) => {
      const userId = userIdRef.current;
      if (!userId || !initializedRef.current) return;

      const currentIds = new Set(state.lists.map(l => l.id));

      for (const prevId of prevListIdsRef.current) {
        if (!currentIds.has(prevId)) {
          deleteListFromDb(prevId);
        }
      }

      for (const list of state.lists) {
        upsertList(list, userId);
      }

      prevListIdsRef.current = currentIds;
    });

    return () => {
      unsubTasks();
      unsubLists();
    };
  }, []);

  // Initialize on mount
  useEffect(() => {
    const init = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        userIdRef.current = user.id;
        await loadFromCloud(user.id);
        initializedRef.current = true;
      }
    };

    init();
  }, [loadFromCloud]);
}
