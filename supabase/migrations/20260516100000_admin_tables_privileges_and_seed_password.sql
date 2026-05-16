-- Ensure API roles cannot read admin credentials or sessions directly (defense in depth).
REVOKE ALL ON TABLE public.admin_users FROM anon, authenticated;
REVOKE ALL ON TABLE public.admin_sessions FROM anon, authenticated;

-- Align legacy seed with the bcrypt hash that was documented in the original migration
-- (only when the row still uses the common Laravel placeholder hash for "password").
CREATE EXTENSION IF NOT EXISTS pgcrypto;

UPDATE public.admin_users
SET password_hash = crypt('admin123', gen_salt('bf'))
WHERE email = 'admin@bookmarkly.com'
  AND password_hash = '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi';
