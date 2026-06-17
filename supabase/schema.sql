-- Solo Shop Customer Memory CRM MVP schema
--
-- Run order:
-- 1. Open your Supabase project dashboard.
-- 2. Go to SQL Editor.
-- 3. Paste this entire file and run it once.
-- 4. If you already created tables manually, review conflicts before running.
-- 5. Create the private Storage bucket for treatment photos separately in Supabase Storage.
--
-- Notes:
-- - This schema assumes Supabase Auth is enabled and auth.users exists.
-- - All user-owned tables use Row Level Security.
-- - profiles is owned by auth.users.id and uses auth.uid() = id.
-- - Other app tables use user_id and auth.uid() = user_id.
-- - customers uses soft delete with is_deleted instead of hard delete.
-- - treatment_photos stores storage_path for private bucket + signed URL usage.
-- - Do not store OpenAI API keys or other server secrets in the database.

create extension if not exists "pgcrypto";

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  shop_name text not null,
  owner_name text,
  default_revisit_interval_days integer not null default 28 check (default_revisit_interval_days > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.customers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  phone text,
  memo text,
  preferred_service text,
  default_revisit_interval_days integer check (
    default_revisit_interval_days is null
    or default_revisit_interval_days > 0
  ),
  last_visit_date date,
  next_visit_due_date date,
  is_deleted boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.treatments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  customer_id uuid not null references public.customers(id) on delete cascade,
  treatment_date date not null,
  service_name text not null,
  memo text,
  price integer check (price is null or price >= 0),
  revisit_interval_days integer check (
    revisit_interval_days is null
    or revisit_interval_days > 0
  ),
  next_visit_due_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.treatment_photos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  customer_id uuid not null references public.customers(id) on delete cascade,
  treatment_id uuid not null references public.treatments(id) on delete cascade,
  storage_path text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.follow_up_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  customer_id uuid not null references public.customers(id) on delete cascade,
  follow_up_type text not null check (
    follow_up_type in ('review_request', 'revisit_reminder', 'manual')
  ),
  status text not null default 'pending' check (
    status in ('pending', 'done', 'skipped')
  ),
  message text,
  contacted_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.ai_message_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  customer_id uuid references public.customers(id) on delete set null,
  treatment_id uuid references public.treatments(id) on delete set null,
  message_type text not null check (
    message_type in ('review_request', 'revisit_reminder')
  ),
  input_snapshot jsonb,
  generated_message text not null,
  copied_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists profiles_updated_at_idx
  on public.profiles(updated_at);

create index if not exists customers_user_id_idx
  on public.customers(user_id);

create index if not exists customers_user_id_created_at_idx
  on public.customers(user_id, created_at desc);

create index if not exists customers_user_id_name_idx
  on public.customers(user_id, name);

create index if not exists customers_user_id_next_visit_due_date_idx
  on public.customers(user_id, next_visit_due_date)
  where is_deleted = false;

create index if not exists customers_user_id_is_deleted_idx
  on public.customers(user_id, is_deleted);

create index if not exists treatments_user_id_idx
  on public.treatments(user_id);

create index if not exists treatments_customer_id_treatment_date_idx
  on public.treatments(customer_id, treatment_date desc);

create index if not exists treatments_user_id_treatment_date_idx
  on public.treatments(user_id, treatment_date desc);

create index if not exists treatments_user_id_next_visit_due_date_idx
  on public.treatments(user_id, next_visit_due_date);

create index if not exists treatment_photos_user_id_idx
  on public.treatment_photos(user_id);

create index if not exists treatment_photos_customer_id_idx
  on public.treatment_photos(customer_id);

create index if not exists treatment_photos_treatment_id_idx
  on public.treatment_photos(treatment_id);

create unique index if not exists treatment_photos_storage_path_idx
  on public.treatment_photos(storage_path);

create index if not exists follow_up_logs_user_id_idx
  on public.follow_up_logs(user_id);

create index if not exists follow_up_logs_customer_id_created_at_idx
  on public.follow_up_logs(customer_id, created_at desc);

create index if not exists follow_up_logs_user_id_status_idx
  on public.follow_up_logs(user_id, status);

create index if not exists follow_up_logs_user_id_created_at_idx
  on public.follow_up_logs(user_id, created_at desc);

create index if not exists ai_message_logs_user_id_idx
  on public.ai_message_logs(user_id);

create index if not exists ai_message_logs_customer_id_created_at_idx
  on public.ai_message_logs(customer_id, created_at desc);

create index if not exists ai_message_logs_treatment_id_idx
  on public.ai_message_logs(treatment_id);

create index if not exists ai_message_logs_user_id_created_at_idx
  on public.ai_message_logs(user_id, created_at desc);

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
before update on public.profiles
for each row
execute function public.set_updated_at();

drop trigger if exists set_customers_updated_at on public.customers;
create trigger set_customers_updated_at
before update on public.customers
for each row
execute function public.set_updated_at();

drop trigger if exists set_treatments_updated_at on public.treatments;
create trigger set_treatments_updated_at
before update on public.treatments
for each row
execute function public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.customers enable row level security;
alter table public.treatments enable row level security;
alter table public.treatment_photos enable row level security;
alter table public.follow_up_logs enable row level security;
alter table public.ai_message_logs enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
on public.profiles
for select
to authenticated
using (auth.uid() = id);

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own"
on public.profiles
for insert
to authenticated
with check (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
on public.profiles
for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

drop policy if exists "profiles_delete_own" on public.profiles;
create policy "profiles_delete_own"
on public.profiles
for delete
to authenticated
using (auth.uid() = id);

drop policy if exists "customers_select_own" on public.customers;
create policy "customers_select_own"
on public.customers
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "customers_insert_own" on public.customers;
create policy "customers_insert_own"
on public.customers
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "customers_update_own" on public.customers;
create policy "customers_update_own"
on public.customers
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "customers_delete_own" on public.customers;
create policy "customers_delete_own"
on public.customers
for delete
to authenticated
using (auth.uid() = user_id);

drop policy if exists "treatments_select_own" on public.treatments;
create policy "treatments_select_own"
on public.treatments
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "treatments_insert_own" on public.treatments;
create policy "treatments_insert_own"
on public.treatments
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "treatments_update_own" on public.treatments;
create policy "treatments_update_own"
on public.treatments
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "treatments_delete_own" on public.treatments;
create policy "treatments_delete_own"
on public.treatments
for delete
to authenticated
using (auth.uid() = user_id);

drop policy if exists "treatment_photos_select_own" on public.treatment_photos;
create policy "treatment_photos_select_own"
on public.treatment_photos
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "treatment_photos_insert_own" on public.treatment_photos;
create policy "treatment_photos_insert_own"
on public.treatment_photos
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "treatment_photos_update_own" on public.treatment_photos;
create policy "treatment_photos_update_own"
on public.treatment_photos
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "treatment_photos_delete_own" on public.treatment_photos;
create policy "treatment_photos_delete_own"
on public.treatment_photos
for delete
to authenticated
using (auth.uid() = user_id);

drop policy if exists "follow_up_logs_select_own" on public.follow_up_logs;
create policy "follow_up_logs_select_own"
on public.follow_up_logs
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "follow_up_logs_insert_own" on public.follow_up_logs;
create policy "follow_up_logs_insert_own"
on public.follow_up_logs
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "follow_up_logs_update_own" on public.follow_up_logs;
create policy "follow_up_logs_update_own"
on public.follow_up_logs
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "follow_up_logs_delete_own" on public.follow_up_logs;
create policy "follow_up_logs_delete_own"
on public.follow_up_logs
for delete
to authenticated
using (auth.uid() = user_id);

drop policy if exists "ai_message_logs_select_own" on public.ai_message_logs;
create policy "ai_message_logs_select_own"
on public.ai_message_logs
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "ai_message_logs_insert_own" on public.ai_message_logs;
create policy "ai_message_logs_insert_own"
on public.ai_message_logs
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "ai_message_logs_update_own" on public.ai_message_logs;
create policy "ai_message_logs_update_own"
on public.ai_message_logs
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "ai_message_logs_delete_own" on public.ai_message_logs;
create policy "ai_message_logs_delete_own"
on public.ai_message_logs
for delete
to authenticated
using (auth.uid() = user_id);
