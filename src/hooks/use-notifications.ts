'use client';

import { useEffect, useRef } from 'react';
import { useTaskStore } from '@/stores/task-store';
import { requestNotificationPermission, scheduleNotification, getTimeUntil } from '@/lib/notifications';

export function useNotifications() {
  const tasks = useTaskStore((s) => s.tasks);
  const scheduledRef = useRef<Set<string>>(new Set());
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);

  useEffect(() => {
    // Request permission on mount
    requestNotificationPermission();
  }, []);

  useEffect(() => {
    // Clear old scheduled notifications
    for (const t of timeoutsRef.current) {
      clearTimeout(t);
    }
    timeoutsRef.current = [];
    scheduledRef.current.clear();

    for (const task of tasks) {
      if (task.done) continue;

      // Event notifications (5 minutes before start)
      if (task.isEvent && task.eventStartTime) {
        const key = `event-${task.id}`;
        if (scheduledRef.current.has(key)) continue;

        const msUntil = getTimeUntil(task.eventStartTime);
        const fiveMinBefore = msUntil - 5 * 60 * 1000;

        if (fiveMinBefore > 0 && fiveMinBefore < 24 * 60 * 60 * 1000) {
          // Schedule 5 min before
          const timeout = scheduleNotification(
            `\u{1F5D3} ${task.text}`,
            `Starting in 5 minutes`,
            fiveMinBefore
          );
          timeoutsRef.current.push(timeout);
          scheduledRef.current.add(key);
        }

        if (msUntil > 0 && msUntil < 24 * 60 * 60 * 1000) {
          // Schedule at start time
          const timeout = scheduleNotification(
            `\u{1F5D3} ${task.text}`,
            `Event starting now`,
            msUntil
          );
          timeoutsRef.current.push(timeout);
        }
      }

      // Task due notifications (at due date + time, or 9 AM on due date)
      if (task.dueDate && !task.isEvent) {
        const key = `task-${task.id}`;
        if (scheduledRef.current.has(key)) continue;

        const dueTime = task.dueTime || '09:00';
        const dueDateTime = `${task.dueDate}T${dueTime}`;
        const msUntil = getTimeUntil(dueDateTime);

        if (msUntil > 0 && msUntil < 24 * 60 * 60 * 1000) {
          const timeout = scheduleNotification(
            `\u23F0 Task Due: ${task.text}`,
            `Due at ${dueTime.replace(/^0/, '')}`,
            msUntil
          );
          timeoutsRef.current.push(timeout);
          scheduledRef.current.add(key);
        }
      }
    }

    return () => {
      for (const t of timeoutsRef.current) {
        clearTimeout(t);
      }
    };
  }, [tasks]);
}
