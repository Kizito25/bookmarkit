-- Add push notification token to profiles for Expo push
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS push_token text;

-- Users can update their own push_token (existing update policy already allows)
CREATE INDEX IF NOT EXISTS idx_profiles_push_token ON profiles(push_token);
