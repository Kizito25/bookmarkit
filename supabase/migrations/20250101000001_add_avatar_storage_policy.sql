-- Create a new storage bucket for avatars
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Set up Row Level Security (RLS) for the avatars bucket
-- Allow authenticated users to view their own avatar
CREATE POLICY "authenticated_select_own_avatar"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'avatars' AND owner = auth.uid());

-- Allow authenticated users to upload a new avatar
CREATE POLICY "authenticated_insert_avatar"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'avatars' AND owner = auth.uid());

-- Allow authenticated users to update their own avatar
CREATE POLICY "authenticated_update_own_avatar"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'avatars' AND owner = auth.uid());

-- Allow authenticated users to delete their own avatar
CREATE POLICY "authenticated_delete_own_avatar"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'avatars' AND owner = auth.uid());
