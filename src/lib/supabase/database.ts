import { createClient } from './client';
import { Task, Subtask, TaskList } from '@/types/task';

const supabase = () => createClient();

// ---- TASKS ----

function taskToRow(task: Task, userId: string) {
  return {
    id: task.id,
    user_id: userId,
    text: task.text,
    notes: task.notes,
    priority: task.priority,
    done: task.done,
    done_at: task.doneAt,
    due_date: task.dueDate,
    due_time: task.dueTime,
    flagged: task.flagged,
    tags: task.tags,
    list_id: task.listId,
    recurring: task.recurring,
    is_event: task.isEvent,
    event_start_time: task.eventStartTime,
    event_end_time: task.eventEndTime,
    created_at: task.createdAt,
  };
}

function rowToTask(row: Record<string, unknown>, subtasks: Subtask[] = []): Task {
  return {
    id: row.id as string,
    text: row.text as string,
    notes: (row.notes as string) || '',
    priority: (row.priority as Task['priority']) || 'none',
    done: row.done as boolean,
    doneAt: row.done_at as string | null,
    dueDate: row.due_date as string | null,
    dueTime: row.due_time as string | null,
    flagged: row.flagged as boolean,
    subtasks,
    tags: (row.tags as string[]) || [],
    listId: row.list_id as string | null,
    recurring: row.recurring as Task['recurring'],
    isEvent: (row.is_event as boolean) || false,
    eventStartTime: row.event_start_time as string | null,
    eventEndTime: row.event_end_time as string | null,
    createdAt: row.created_at as string,
  };
}

export async function fetchTasks(userId: string): Promise<Task[]> {
  const { data: taskRows, error } = await supabase()
    .from('tasks')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error || !taskRows) return [];

  const taskIds = taskRows.map((t: Record<string, unknown>) => t.id as string);

  let subtaskRows: Record<string, unknown>[] = [];
  if (taskIds.length > 0) {
    const { data } = await supabase()
      .from('subtasks')
      .select('*')
      .in('task_id', taskIds)
      .order('sort_order');
    subtaskRows = data || [];
  }

  const subtasksByTask = new Map<string, Subtask[]>();
  for (const row of subtaskRows) {
    const taskId = row.task_id as string;
    if (!subtasksByTask.has(taskId)) subtasksByTask.set(taskId, []);
    subtasksByTask.get(taskId)!.push({
      id: row.id as string,
      text: row.text as string,
      done: row.done as boolean,
    });
  }

  return taskRows.map((row: Record<string, unknown>) =>
    rowToTask(row, subtasksByTask.get(row.id as string) || [])
  );
}

export async function upsertTask(task: Task, userId: string): Promise<void> {
  const row = taskToRow(task, userId);
  await supabase().from('tasks').upsert(row, { onConflict: 'id' });

  // Sync subtasks: delete all then re-insert
  await supabase().from('subtasks').delete().eq('task_id', task.id);
  if (task.subtasks.length > 0) {
    const subtaskRows = task.subtasks.map((s, i) => ({
      id: s.id,
      task_id: task.id,
      text: s.text,
      done: s.done,
      sort_order: i,
    }));
    await supabase().from('subtasks').insert(subtaskRows);
  }
}

export async function deleteTaskFromDb(taskId: string): Promise<void> {
  await supabase().from('tasks').delete().eq('id', taskId);
}

// ---- LISTS ----

export async function fetchLists(userId: string): Promise<TaskList[]> {
  const { data, error } = await supabase()
    .from('lists')
    .select('*')
    .eq('user_id', userId)
    .order('created_at');

  if (error || !data) return [];

  return data.map((row: Record<string, unknown>) => ({
    id: row.id as string,
    name: row.name as string,
    color: (row.color as string) || '#3b82f6',
    emoji: (row.emoji as string) || '\u{1F4C1}',
    createdAt: row.created_at as string,
  }));
}

export async function upsertList(list: TaskList, userId: string): Promise<void> {
  await supabase().from('lists').upsert({
    id: list.id,
    user_id: userId,
    name: list.name,
    color: list.color,
    emoji: list.emoji,
    created_at: list.createdAt,
  }, { onConflict: 'id' });
}

export async function deleteListFromDb(listId: string): Promise<void> {
  await supabase().from('lists').delete().eq('id', listId);
}
