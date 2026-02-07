-- Migration: Add personality fields to users table
-- Run this in Supabase SQL Editor

-- Add personality_type column (e.g., "INTJ-A")
ALTER TABLE users
ADD COLUMN IF NOT EXISTS personality_type TEXT;

-- Add personality_data column (stores full quiz results as JSON)
ALTER TABLE users
ADD COLUMN IF NOT EXISTS personality_data JSONB;

-- Add index for faster personality type queries
CREATE INDEX IF NOT EXISTS idx_users_personality_type ON users(personality_type);

-- Verify the changes
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'users'
  AND column_name IN ('personality_type', 'personality_data')
ORDER BY column_name;
