'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useTimerStore } from '@/stores/timer-store';
import { playRingtone, RingtoneId } from '@/lib/ringtones';

export function useTimer() {
  const status = useTimerStore((s) => s.status);
  const remainingSeconds = useTimerStore((s) => s.remainingSeconds);
  const ringtone = useTimerStore((s) => s.settings.ringtone);
  const tick = useTimerStore((s) => s.tick);
  const skip = useTimerStore((s) => s.skip);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const prevRemainingRef = useRef(remainingSeconds);

  const playAlarm = useCallback(() => {
    try {
      playRingtone(ringtone as RingtoneId);
    } catch {
      // Audio not available
    }
  }, [ringtone]);

  useEffect(() => {
    if (status === 'running') {
      intervalRef.current = setInterval(() => {
        tick();
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [status, tick]);

  // Detect when timer hits 0
  useEffect(() => {
    if (prevRemainingRef.current > 0 && remainingSeconds === 0 && status === 'idle') {
      playAlarm();
      // Auto-transition after ringtone plays
      const timeout = setTimeout(() => {
        skip();
      }, 3000);
      return () => clearTimeout(timeout);
    }
    prevRemainingRef.current = remainingSeconds;
  }, [remainingSeconds, status, playAlarm, skip]);

  return { playAlarm };
}
