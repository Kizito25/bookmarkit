-- Add admin fields to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS referrer TEXT DEFAULT 'direct',
ADD COLUMN IF NOT EXISTS plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'pro')),
ADD COLUMN IF NOT EXISTS created_at timestamptz DEFAULT now();

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_plan ON profiles(plan);
CREATE INDEX IF NOT EXISTS idx_profiles_referrer ON profiles(referrer);
CREATE INDEX IF NOT EXISTS idx_profiles_created_at ON profiles(created_at);
