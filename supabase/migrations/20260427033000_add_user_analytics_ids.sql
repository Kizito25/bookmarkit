/*
  # Add user analytics identifier mapping

  Creates a dedicated table that links each auth user to a stable analytics
  identifier used by Vexo device identification.
*/

CREATE TABLE IF NOT EXISTS public.user_analytics_ids (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  analytics_id text NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.user_analytics_ids ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own analytics id." ON public.user_analytics_ids;
CREATE POLICY "Users can view their own analytics id."
ON public.user_analytics_ids
FOR SELECT
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own analytics id." ON public.user_analytics_ids;
CREATE POLICY "Users can insert their own analytics id."
ON public.user_analytics_ids
FOR INSERT
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own analytics id." ON public.user_analytics_ids;
CREATE POLICY "Users can update their own analytics id."
ON public.user_analytics_ids
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);
