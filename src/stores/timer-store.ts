import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { TimerMode, TimerStatus, TimerSettings } from '@/types/timer';
import { DEFAULT_TIMER_SETTINGS } from '@/lib/constants';

interface TimerStore {
  mode: TimerMode;
  status: TimerStatus;
  remainingSeconds: number;
  totalSeconds: number;
  sessionsCompleted: number;
  focusTaskId: string | null;
  settings: TimerSettings;

  start: () => void;
  pause: () => void;
  reset: () => void;
  skip: () => void;
  tick: () => void;
  setMode: (mode: TimerMode) => void;
  setPreset: (minutes: number) => void;
  updateSettings: (s: Partial<TimerSettings>) => void;
  setFocusTask: (taskId: string | null) => void;
}

function getModeSeconds(mode: TimerMode, settings: TimerSettings): number {
  switch (mode) {
    case 'work': return settings.workMinutes * 60;
    case 'shortBreak': return settings.shortBreakMinutes * 60;
    case 'longBreak': return settings.longBreakMinutes * 60;
  }
}

export const useTimerStore = create<TimerStore>()(
  persist(
    (set, get) => ({
      mode: 'work',
      status: 'idle',
      remainingSeconds: DEFAULT_TIMER_SETTINGS.workMinutes * 60,
      totalSeconds: DEFAULT_TIMER_SETTINGS.workMinutes * 60,
      sessionsCompleted: 0,
      focusTaskId: null,
      settings: DEFAULT_TIMER_SETTINGS,

      start: () => set({ status: 'running' }),
      pause: () => set({ status: 'paused' }),

      reset: () => {
        const { mode, settings } = get();
        const secs = getModeSeconds(mode, settings);
        set({ status: 'idle', remainingSeconds: secs, totalSeconds: secs });
      },

      skip: () => {
        const { mode, sessionsCompleted, settings } = get();
        if (mode === 'work') {
          const newCompleted = sessionsCompleted + 1;
          if (settings.disableBreak) {
            const secs = getModeSeconds('work', settings);
            set({ sessionsCompleted: newCompleted, remainingSeconds: secs, totalSeconds: secs, status: settings.autoStartWork ? 'running' : 'idle' });
          } else {
            const nextMode = newCompleted % settings.longBreakAfter === 0 ? 'longBreak' : 'shortBreak';
            const secs = getModeSeconds(nextMode, settings);
            set({ mode: nextMode, sessionsCompleted: newCompleted, remainingSeconds: secs, totalSeconds: secs, status: settings.autoStartBreak ? 'running' : 'idle' });
          }
        } else {
          const secs = getModeSeconds('work', settings);
          set({ mode: 'work', remainingSeconds: secs, totalSeconds: secs, status: settings.autoStartWork ? 'running' : 'idle' });
        }
      },

      tick: () => {
        const { remainingSeconds, status } = get();
        if (status !== 'running') return;
        if (remainingSeconds <= 1) {
          set({ remainingSeconds: 0, status: 'idle' });
        } else {
          set({ remainingSeconds: remainingSeconds - 1 });
        }
      },

      setMode: (mode) => {
        const { settings } = get();
        const secs = getModeSeconds(mode, settings);
        set({ mode, remainingSeconds: secs, totalSeconds: secs, status: 'idle' });
      },

      setPreset: (minutes) => {
        const secs = minutes * 60;
        set({ remainingSeconds: secs, totalSeconds: secs, status: 'idle', mode: 'work' });
      },

      updateSettings: (s) => {
        set((state) => {
          const newSettings = { ...state.settings, ...s };
          const secs = getModeSeconds(state.mode, newSettings);
          return {
            settings: newSettings,
            remainingSeconds: state.status === 'idle' ? secs : state.remainingSeconds,
            totalSeconds: state.status === 'idle' ? secs : state.totalSeconds,
          };
        });
      },

      setFocusTask: (taskId) => set({ focusTaskId: taskId }),
    }),
    {
      name: 'lucy-timer',
      partialize: (state) => ({
        settings: state.settings,
        sessionsCompleted: state.sessionsCompleted,
      }),
    }
  )
);
