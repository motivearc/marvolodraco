-- Restrict writes to users with app_metadata.role = 'admin'.
-- Run after schema.sql. Pair with make-admin.sql for your admin user.

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin',
    false
  );
$$;

-- Products
drop policy if exists "Authenticated write products" on public.products;
drop policy if exists "Admin write products" on public.products;
create policy "Admin write products"
  on public.products for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Site settings
drop policy if exists "Authenticated write site_settings" on public.site_settings;
drop policy if exists "Admin write site_settings" on public.site_settings;
create policy "Admin write site_settings"
  on public.site_settings for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Lookbook
drop policy if exists "Authenticated write lookbook_images" on public.lookbook_images;
drop policy if exists "Admin write lookbook_images" on public.lookbook_images;
create policy "Admin write lookbook_images"
  on public.lookbook_images for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Storage writes
drop policy if exists "Authenticated upload media" on storage.objects;
drop policy if exists "Admin upload media" on storage.objects;
create policy "Admin upload media"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'media' and public.is_admin());

drop policy if exists "Authenticated update media" on storage.objects;
drop policy if exists "Admin update media" on storage.objects;
create policy "Admin update media"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'media' and public.is_admin())
  with check (bucket_id = 'media' and public.is_admin());

drop policy if exists "Authenticated delete media" on storage.objects;
drop policy if exists "Admin delete media" on storage.objects;
create policy "Admin delete media"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'media' and public.is_admin());

-- Reviews: public can submit pending notes; admins approve them.
-- Skipped when the table has not been created yet.
do $$
begin
  if to_regclass('public.reviews') is null then
    return;
  end if;

  execute 'drop policy if exists "Public read reviews" on public.reviews';
  execute 'create policy "Public read reviews" on public.reviews for select to anon, authenticated using (status = ''approved'' or public.is_admin())';

  execute 'drop policy if exists "Public submit reviews" on public.reviews';
  execute 'create policy "Public submit reviews" on public.reviews for insert to anon, authenticated with check (status = ''pending'')';

  execute 'drop policy if exists "Admin update reviews" on public.reviews';
  execute 'create policy "Admin update reviews" on public.reviews for update to authenticated using (public.is_admin()) with check (public.is_admin())';

  execute 'drop policy if exists "Admin delete reviews" on public.reviews';
  execute 'create policy "Admin delete reviews" on public.reviews for delete to authenticated using (public.is_admin())';
end $$;
