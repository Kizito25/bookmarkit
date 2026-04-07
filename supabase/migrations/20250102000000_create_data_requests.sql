-- Create table to track user data access/deletion requests
CREATE TABLE public.data_requests (
  id bigserial PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('delete', 'export')),
  details text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'rejected')),
  processed_by uuid REFERENCES auth.users,
  result_url text,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  processed_at timestamptz
);

ALTER TABLE public.data_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert their own data requests." ON public.data_requests
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own data requests." ON public.data_requests
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage all data requests." ON public.data_requests
  FOR ALL USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');
