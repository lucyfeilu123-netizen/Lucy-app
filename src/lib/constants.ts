import { TimerPreset, TimerSettings } from '@/types/timer';
import { Priority } from '@/types/task';
import {
  Inbox, CalendarDays, CalendarClock, Star, ListTodo, CheckCircle2,
} from 'lucide-react';

export const DEFAULT_TIMER_SETTINGS: TimerSettings = {
  workMinutes: 25,
  shortBreakMinutes: 5,
  longBreakMinutes: 15,
  longBreakAfter: 4,
  autoStartBreak: false,
  autoStartWork: false,
  disableBreak: false,
  ringtone: 'gentle-bells',
};

export const TIMER_PRESETS: TimerPreset[] = [
  { label: '5m', minutes: 5 },
  { label: '10m', minutes: 10 },
  { label: '15m', minutes: 15 },
  { label: '25m', minutes: 25 },
  { label: '30m', minutes: 30 },
  { label: '45m', minutes: 45 },
  { label: '60m', minutes: 60 },
];

export const PRIORITY_CONFIG: Record<Priority, { label: string; color: string; weight: number }> = {
  none: { label: 'None', color: 'var(--fg-quieter)', weight: 0 },
  low: { label: 'Low', color: 'var(--limsa-350)', weight: 1 },
  medium: { label: 'Medium', color: 'var(--costa-350)', weight: 2 },
  high: { label: 'High', color: 'var(--terra-350)', weight: 3 },
  urgent: { label: 'Urgent', color: 'var(--rosa-350)', weight: 4 },
};

export const SMART_VIEWS = [
  { id: 'inbox' as const, label: 'Inbox', icon: Inbox },
  { id: 'today' as const, label: 'Today', icon: CalendarDays },
  { id: 'scheduled' as const, label: 'Scheduled', icon: CalendarClock },
  { id: 'flagged' as const, label: 'Flagged', icon: Star },
  { id: 'all' as const, label: 'All Tasks', icon: ListTodo },
  { id: 'completed' as const, label: 'Completed', icon: CheckCircle2 },
];

export const LIST_COLORS = [
  '#ef4444', '#f97316', '#f59e0b', '#22c55e', '#3b82f6',
  '#6366f1', '#a855f7', '#ec4899', '#64748b',
];

export const LIST_EMOJIS = [
  '📁', '💼', '🏠', '❤️', '📚', '🏋️', '🎯', '🎨',
  '🌱', '🚀', '💡', '🎵', '🍕', '✈️', '💰',
];

export const TEMPLATES = [
  {
    id: 'morning-routine',
    name: 'Morning Routine',
    emoji: '🌅',
    description: 'Start your day right',
    tasks: [
      { text: 'Drink a glass of water', priority: 'high' as Priority },
      { text: '10-minute stretching', priority: 'medium' as Priority },
      { text: 'Review daily goals', priority: 'high' as Priority },
      { text: 'Healthy breakfast', priority: 'medium' as Priority },
      { text: '5-minute mindfulness', priority: 'low' as Priority },
      { text: 'Check calendar', priority: 'medium' as Priority },
      { text: 'Clear email inbox', priority: 'low' as Priority },
    ],
  },
  {
    id: 'work-sprint',
    name: 'Work Day Sprint',
    emoji: '💼',
    description: 'Structured work day',
    tasks: [
      { text: 'Review priorities', priority: 'urgent' as Priority },
      { text: 'Deep work block #1', priority: 'high' as Priority },
      { text: 'Respond to messages', priority: 'medium' as Priority },
      { text: 'Standup / sync meeting', priority: 'high' as Priority },
      { text: 'Deep work block #2', priority: 'high' as Priority },
      { text: 'Review tomorrow plan', priority: 'medium' as Priority },
      { text: 'End-of-day wrap-up', priority: 'low' as Priority },
    ],
  },
  {
    id: 'weekly-review',
    name: 'Weekly Review',
    emoji: '📊',
    description: 'Reflect and plan ahead',
    tasks: [
      { text: 'Review completed tasks', priority: 'high' as Priority },
      { text: 'Capture open loops', priority: 'high' as Priority },
      { text: 'Clear inbox to zero', priority: 'medium' as Priority },
      { text: 'Review next week calendar', priority: 'medium' as Priority },
      { text: 'Set top 3 goals', priority: 'urgent' as Priority },
      { text: 'Update project statuses', priority: 'medium' as Priority },
      { text: 'Plan Monday priorities', priority: 'high' as Priority },
    ],
  },
  {
    id: 'fitness',
    name: 'Fitness Goals',
    emoji: '💪',
    description: 'Daily fitness routine',
    tasks: [
      { text: 'Morning workout (30 min)', priority: 'high' as Priority },
      { text: 'Track water intake (8 glasses)', priority: 'medium' as Priority },
      { text: 'Meal prep / healthy eating', priority: 'medium' as Priority },
      { text: '10,000 steps', priority: 'high' as Priority },
      { text: 'Evening stretching', priority: 'low' as Priority },
      { text: 'No screens 1hr before bed', priority: 'medium' as Priority },
      { text: 'Sleep by 10:30 PM', priority: 'high' as Priority },
    ],
  },
  {
    id: 'study-session',
    name: 'Study Session',
    emoji: '📚',
    description: 'Pomodoro study blocks',
    tasks: [
      { text: 'Review previous notes', priority: 'high' as Priority },
      { text: 'Pomodoro: Read chapter', priority: 'high' as Priority },
      { text: 'Break: walk & stretch', priority: 'low' as Priority },
      { text: 'Pomodoro: Practice problems', priority: 'high' as Priority },
      { text: 'Break: snack', priority: 'low' as Priority },
      { text: 'Pomodoro: Review & quiz', priority: 'high' as Priority },
      { text: 'Summarize key takeaways', priority: 'medium' as Priority },
      { text: 'Plan next session topics', priority: 'medium' as Priority },
    ],
  },
  {
    id: 'project-launch',
    name: 'Project Launch',
    emoji: '🚀',
    description: 'New project kickoff',
    tasks: [
      { text: 'Define scope & success criteria', priority: 'urgent' as Priority },
      { text: 'Break into milestones', priority: 'high' as Priority },
      { text: 'Create work breakdown', priority: 'high' as Priority },
      { text: 'Assign priorities', priority: 'medium' as Priority },
      { text: 'Identify dependencies', priority: 'high' as Priority },
      { text: 'Set up communication channel', priority: 'medium' as Priority },
      { text: 'Schedule kickoff meeting', priority: 'high' as Priority },
      { text: 'Create documentation', priority: 'medium' as Priority },
      { text: 'Set deadline & milestones', priority: 'urgent' as Priority },
    ],
  },
];
