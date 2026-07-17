-- ============================================================
--  Work Experience ordering
--  Adds a persisted sort position so the admin can drag-reorder
--  entries and the public site reflects that order.
--  Safe to run more than once.
-- ============================================================

-- 1. Position column -------------------------------------------
alter table public."WorkExperience"
  add column if not exists position int;

-- 2. Backfill existing rows using the current (created_at) order
--    so nothing visibly reorders on first deploy.
with ordered as (
  select
    id,
    (row_number() over (order by created_at asc)) - 1 as rn
  from public."WorkExperience"
  where position is null
)
update public."WorkExperience" w
   set position = o.rn
  from ordered o
 where w.id = o.id;

-- 3. Default for future inserts (admin sets an explicit value,
--    this is just a safety net).
alter table public."WorkExperience"
  alter column position set default 0;

create index if not exists work_experience_position_idx
  on public."WorkExperience" (position asc);
