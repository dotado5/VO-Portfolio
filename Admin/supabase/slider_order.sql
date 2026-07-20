-- ============================================================
--  Slider image ordering
--  Adds a persisted sort position so the admin can shuffle the
--  slider sequence and the public site reflects that order.
--  Safe to run more than once.
-- ============================================================

-- 1. Position column -------------------------------------------
alter table public."SliderImage"
  add column if not exists position int;

-- 2. Backfill existing rows using the current order (newest first)
--    so nothing visibly reorders on first deploy.
with ordered as (
  select
    id,
    (row_number() over (order by created_at desc)) - 1 as rn
  from public."SliderImage"
  where position is null
)
update public."SliderImage" s
   set position = o.rn
  from ordered o
 where s.id = o.id;

-- 3. Default for future inserts (admin sets an explicit value).
alter table public."SliderImage"
  alter column position set default 0;

create index if not exists slider_image_position_idx
  on public."SliderImage" (position asc);
