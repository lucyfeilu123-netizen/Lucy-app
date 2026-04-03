-- Tasks table
create table if not exists public.tasks (
  id uuid primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  text text not null,
  notes text default '',
  priority text default 'none' check (priority in ('none','low','medium','high','urgent')),
  done boolean default false,
  done_at timestamptz,
  due_date date,
  due_time time,
  flagged boolean default false,
  tags text[] default '{}',
  list_id uuid,
  recurring text check (recurring in ('daily','weekly','monthly') or recurring is null),
  is_event boolean default false,
  event_start_time timestamptz,
  event_end_time timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Subtasks table
create table if not exists public.subtasks (
  id uuid primary key,
  task_id uuid references public.tasks(id) on delete cascade not null,
  text text not null,
  done boolean default false,
  sort_order int default 0,
  created_at timestamptz default now()
);

-- Lists table
create table if not exists public.lists (
  id uuid primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  color text,
  emoji text,
  created_at timestamptz default now()
);

-- User settings table
create table if not exists public.user_settings (
  user_id uuid references auth.users(id) on delete cascade primary key,
  timer_settings jsonb default '{}',
  ui_settings jsonb default '{}',
  ambient_settings jsonb default '{}',
  updated_at timestamptz default now()
);

-- Row Level Security
alter table public.tasks enable row level security;
alter table public.subtasks enable row level security;
alter table public.lists enable row level security;
alter table public.user_settings enable row level security;

-- Policies: users can only access their own data
create policy "Users manage own tasks" on public.tasks
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users manage own subtasks" on public.subtasks
  for all using (task_id in (select id from public.tasks where user_id = auth.uid()))
  with check (task_id in (select id from public.tasks where user_id = auth.uid()));

create policy "Users manage own lists" on public.lists
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users manage own settings" on public.user_settings
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Indexes
create index if not exists idx_tasks_user on public.tasks(user_id);
create index if not exists idx_tasks_user_done on public.tasks(user_id, done);
create index if not exists idx_subtasks_task on public.subtasks(task_id);
create index if not exists idx_lists_user on public.lists(user_id);
