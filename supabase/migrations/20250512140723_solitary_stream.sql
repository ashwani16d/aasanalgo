/*
  # Create Admin User

  1. Changes
    - Create admin user with email: admin@aasanalgo.com and password: admin123
    - Set up admin profile with proper permissions
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
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  aud,
  role
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  '00000000-0000-0000-0000-000000000000',
  'admin@aasanalgo.com',
  crypt('admin123', gen_salt('bf')),
  now(),
  now(),
  now(),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{"full_name":"Admin"}',
  'authenticated',
  'authenticated'
) ON CONFLICT (id) DO NOTHING;

-- Create admin profile
INSERT INTO public.profiles (
  id,
  email,
  full_name,
  role,
  is_owner,
  created_at,
  updated_at,
  balance,
  daily_trade_limit,
  max_position_size,
  risk_level,
  total_pnl,
  win_rate
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  'admin@aasanalgo.com',
  'Admin',
  'admin',
  true,
  now(),
  now(),
  1000000,
  1000,
  10000000,
  'high',
  0,
  0
) ON CONFLICT (id) DO NOTHING;