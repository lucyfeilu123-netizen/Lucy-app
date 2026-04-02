export type TimerMode = 'work' | 'shortBreak' | 'longBreak';
export type TimerStatus = 'idle' | 'running' | 'paused';

export interface TimerSettings {
  workMinutes: number;
  shortBreakMinutes: number;
  longBreakMinutes: number;
  longBreakAfter: number;
  autoStartBreak: boolean;
  autoStartWork: boolean;
  disableBreak: boolean;
  ringtone: string;
}

export interface TimerPreset {
  label: string;
  minutes: number;
}
