'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useTimerStore } from '@/stores/timer-store';

export function useTimer() {
  const status = useTimerStore((s) => s.status);
  const remainingSeconds = useTimerStore((s) => s.remainingSeconds);
  const tick = useTimerStore((s) => s.tick);
  const skip = useTimerStore((s) => s.skip);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const prevRemainingRef = useRef(remainingSeconds);

  const playAlarm = useCallback(() => {
    try {
      const ctx = new AudioContext();
      const playTone = (time: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = 880;
        osc.type = 'sine';
        gain.gain.setValueAtTime(0.3, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.3);
        osc.start(time);
        osc.stop(time + 0.3);
      };
      playTone(ctx.currentTime);
      playTone(ctx.currentTime + 0.4);
      playTone(ctx.currentTime + 0.8);
    } catch {
      // Audio not available
    }
  }, []);

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
      // Auto-transition after a short delay
      const timeout = setTimeout(() => {
        skip();
      }, 1500);
      return () => clearTimeout(timeout);
    }
    prevRemainingRef.current = remainingSeconds;
  }, [remainingSeconds, status, playAlarm, skip]);

  return { playAlarm };
}
