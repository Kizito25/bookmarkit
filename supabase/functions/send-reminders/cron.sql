-- Enable pg_cron extension
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Schedule reminder check every 15 minutes
SELECT cron.schedule(
  'send-bookmark-reminders',
  '*/15 * * * *',
  $$
  SELECT
    net.http_post(
      url:='https://your-project-ref.supabase.co/functions/v1/send-reminders',
      headers:='{"Content-Type": "application/json", "Authorization": "Bearer YOUR_ANON_KEY"}'::jsonb
    ) as request_id;
  $$
);
