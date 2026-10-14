-- Run this in Supabase Dashboard → SQL Editor

-- Option 1: Create user via admin API (recommended)
-- This creates auth user + triggers handle_new_user for profile
SELECT auth.admin_create_user(
  email := 'waseemsamra@gmail.com',
  password := 'your-password-here',
  email_confirm := true,
  user_metadata := '{"full_name": "Waseem Samra"}'::jsonb
);

-- Option 2: If that fails, manually create both
-- First create auth user
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'waseemsamra@gmail.com',
  crypt('your-password-here', gen_salt('bf')),
  now(),
  '{"full_name": "Waseem Samra"}'::jsonb,
  now(),
  now(),
  '',
  '',
  ''
) ON CONFLICT (email) DO UPDATE SET
  encrypted_password = EXCLUDED.encrypted_password,
  raw_user_meta_data = EXCLUDED.raw_user_meta_data,
  email_confirmed_at = EXCLUDED.email_confirmed_at;

-- Then create profile (trigger should do this, but manual backup)
INSERT INTO public.profiles (id, email, full_name, role, kyc_level)
SELECT id, email, raw_user_meta_data->>'full_name', 'super_admin', 'none'
FROM auth.users
WHERE email = 'waseemsamra@gmail.com'
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  full_name = EXCLUDED.full_name,
  role = 'super_admin';