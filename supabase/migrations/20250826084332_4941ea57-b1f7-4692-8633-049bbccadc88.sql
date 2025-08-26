-- Remove the previous invalid user creation migration
-- This migration removes data that should not have been inserted directly into auth.users

-- The previous migration attempted to insert directly into auth.users which is not allowed
-- Users should be created through the Supabase auth API instead