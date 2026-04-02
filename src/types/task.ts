export type Priority = 'none' | 'low' | 'medium' | 'high' | 'urgent';
export type RecurringRule = 'daily' | 'weekly' | 'monthly' | null;
export type SmartViewType = 'inbox' | 'today' | 'scheduled' | 'flagged' | 'all' | 'completed';

export interface Subtask {
  id: string;
  text: string;
  done: boolean;
}

export interface Task {
  id: string;
  text: string;
  notes: string;
  priority: Priority;
  done: boolean;
  doneAt: string | null;
  dueDate: string | null;
  dueTime: string | null;
  flagged: boolean;
  subtasks: Subtask[];
  tags: string[];
  listId: string | null;
  recurring: RecurringRule;
  createdAt: string;
}

export interface TaskList {
  id: string;
  name: string;
  color: string;
  emoji: string;
  createdAt: string;
}
