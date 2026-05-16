/*
  # Backfill analytics identifiers for existing users

  Inserts analytics identifiers for all existing auth users that do not yet
  have a row in public.user_analytics_ids.
*/

INSERT INTO public.user_analytics_ids (user_id, analytics_id)
SELECT
  u.id AS user_id,
  CONCAT(
    'vexo_',
    SUBSTRING(u.id::text FROM 1 FOR 8),
    '_',
    SUBSTRING(MD5(u.id::text || clock_timestamp()::text || random()::text) FROM 1 FOR 12)
  ) AS analytics_id
FROM auth.users u
LEFT JOIN public.user_analytics_ids a ON a.user_id = u.id
WHERE a.user_id IS NULL
ON CONFLICT (user_id) DO NOTHING;
