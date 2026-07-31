-- Promote an existing Auth user to admin.
-- 1. Create the user first (Authentication → Users → Add user), then run this.
-- 2. Replace the email below with your admin email.
-- 3. Sign out / sign in again so the JWT picks up the new role.

update auth.users
set raw_app_meta_data =
  coalesce(raw_app_meta_data, '{}'::jsonb) || '{"role": "admin"}'::jsonb
where email = 'you@example.com';

-- Optional: confirm it worked
select id, email, raw_app_meta_data
from auth.users
where email = 'you@example.com';
