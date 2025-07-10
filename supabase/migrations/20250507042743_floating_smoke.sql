/*
  # Add payment and broker integration tables

  1. New Tables
    - `deposits`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `amount` (numeric)
      - `status` (text)
      - `transaction_id` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `broker_settings`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `broker_name` (text)
      - `api_key` (text)
      - `api_secret` (text)
      - `is_active` (boolean)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Changes
    - Add balance column to profiles table
    - Add broker integration fields to profiles

  3. Security
    - Enable RLS on new tables
    - Add policies for users and admins
*/

-- Add balance to profiles
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS balance numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS broker_api_key text,
ADD COLUMN IF NOT EXISTS broker_secret text;

-- Create deposits table
CREATE TABLE IF NOT EXISTS deposits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles ON DELETE CASCADE,
  amount numeric NOT NULL CHECK (amount > 0),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
  transaction_id text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create broker settings table
CREATE TABLE IF NOT EXISTS broker_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles ON DELETE CASCADE,
  broker_name text NOT NULL,
  api_key text NOT NULL,
  api_secret text NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE deposits ENABLE ROW LEVEL SECURITY;
ALTER TABLE broker_settings ENABLE ROW LEVEL SECURITY;

-- Deposits policies
CREATE POLICY "Users can view their own deposits"
  ON deposits FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins can view all deposits"
  ON deposits FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  ));

CREATE POLICY "Admins can manage deposits"
  ON deposits FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  ));

-- Broker settings policies
CREATE POLICY "Users can view their own broker settings"
  ON broker_settings FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can manage their own broker settings"
  ON broker_settings FOR ALL
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins can view all broker settings"
  ON broker_settings FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  ));

-- Triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER deposits_updated_at
  BEFORE UPDATE ON deposits
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER broker_settings_updated_at
  BEFORE UPDATE ON broker_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();