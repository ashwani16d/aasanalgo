/*
  # Create Admin Account

  1. Changes
    - Create admin user with email and password
    - Set up admin profile with required permissions
*/

-- Create admin user if not exists
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  last_sign_in_at
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  '00000000-0000-0000-0000-000000000000',
  'admin@aasanalgo.com',
  crypt('admin123', gen_salt('bf')),
  now(),
  now(),
  now(),
  now()
) ON CONFLICT (id) DO NOTHING;

-- Create admin profile
INSERT INTO public.profiles (
  id,
  email,
  full_name,
  role,
  is_owner,
  created_at,
  updated_at
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  'admin@aasanalgo.com',
  'Admin',
  'admin',
  true,
  now(),
  now()
) ON CONFLICT (id) DO NOTHING;