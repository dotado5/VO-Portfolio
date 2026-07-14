-- ============================================================
--  Blog viewership tracking
--  Run AFTER blog.sql. Safe to run more than once.
-- ============================================================

-- 1. View counter column ---------------------------------------
alter table public."Blog"
  add column if not exists views int not null default 0;

-- 2. Increment function ----------------------------------------
-- SECURITY DEFINER lets the public (anon) key bump the counter
-- WITHOUT granting it UPDATE rights on the Blog table. It can only
-- ever increment views on a published post — nothing else.
create or replace function public.increment_blog_views(blog_slug text)
returns void
language sql
security definer
set search_path = public
as $$
  update public."Blog"
     set views = views + 1
   where slug = blog_slug
     and status = 'published';
$$;

-- Only the counter function is exposed to anon/authenticated.
grant execute on function public.increment_blog_views(text) to anon, authenticated;
