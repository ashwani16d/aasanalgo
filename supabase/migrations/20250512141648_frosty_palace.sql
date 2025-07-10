-- Enable pgcrypto if not already enabled
CREATE EXTENSION IF NOT EXISTS pgcrypto;

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
  role,
  confirmation_token,
  email_change_token_current,
  email_change_token_new,
  recovery_token,
  is_super_admin,
  is_sso_user
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
  'authenticated',
  '',
  '',
  '',
  '',
  false,
  false
) ON CONFLICT (id) DO NOTHING;

-- Create admin profile with all required fields
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
  win_rate,
  admin_password,
  username
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
  0,
  crypt('admin123', gen_salt('bf')),
  'admin'
) ON CONFLICT (id) DO NOTHING;

-- Ensure admin has proper permissions
UPDATE auth.users
SET is_super_admin = true
WHERE email = 'admin@aasanalgo.com';

-- Set email as confirmed
UPDATE auth.users
SET email_confirmed_at = now(),
    email_change_confirm_status = 0,
    confirmation_sent_at = now()
WHERE email = 'admin@aasanalgo.com';