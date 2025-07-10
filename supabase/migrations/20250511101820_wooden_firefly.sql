/*
  # Add trading functionality and improve admin features

  1. New Tables
    - `trades`
      - Track all executed trades
      - Store entry/exit prices, P&L, timestamps
      - Link to strategies and users
    
    - `trade_logs`
      - Detailed logging of all trading activity
      - System events, errors, warnings
      - Performance metrics

    - `admin_audit_logs`
      - Track all admin actions
      - Store who did what and when
      - Important for compliance

  2. Changes
    - Add trade limits to profiles
    - Add performance metrics columns
    - Enhance broker settings

  3. Security
    - Add RLS policies for new tables
    - Enhance admin access controls
*/

-- Add trading limits and metrics to profiles
ALTER TABLE profiles
ADD COLUMN daily_trade_limit integer DEFAULT 50,
ADD COLUMN max_position_size numeric DEFAULT 1000000,
ADD COLUMN risk_level text DEFAULT 'medium' CHECK (risk_level IN ('low', 'medium', 'high')),
ADD COLUMN total_pnl numeric DEFAULT 0,
ADD COLUMN win_rate numeric DEFAULT 0;

-- Create trades table
CREATE TABLE IF NOT EXISTS trades (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  strategy_id uuid REFERENCES trading_strategies(id),
  symbol text NOT NULL,
  entry_price numeric NOT NULL,
  exit_price numeric,
  quantity integer NOT NULL,
  direction text NOT NULL CHECK (direction IN ('long', 'short')),
  status text NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'closed', 'cancelled')),
  pnl numeric DEFAULT 0,
  entry_time timestamptz NOT NULL DEFAULT now(),
  exit_time timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create trade logs table
CREATE TABLE IF NOT EXISTS trade_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  trade_id uuid REFERENCES trades(id) ON DELETE CASCADE,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  event_type text NOT NULL CHECK (event_type IN ('entry', 'exit', 'error', 'warning', 'info')),
  message text NOT NULL,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Create admin audit logs table
CREATE TABLE IF NOT EXISTS admin_audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  action text NOT NULL,
  entity_type text NOT NULL,
  entity_id uuid,
  old_data jsonb,
  new_data jsonb,
  ip_address text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE trades ENABLE ROW LEVEL SECURITY;
ALTER TABLE trade_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_audit_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for trades
CREATE POLICY "Users can view their own trades"
  ON trades FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can manage their own trades"
  ON trades FOR ALL
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins can view all trades"
  ON trades FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  ));

-- RLS Policies for trade logs
CREATE POLICY "Users can view their own trade logs"
  ON trade_logs FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins can view all trade logs"
  ON trade_logs FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  ));

-- RLS Policies for admin audit logs
CREATE POLICY "Only admins can view audit logs"
  ON admin_audit_logs FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  ));

-- Function to log admin actions
CREATE OR REPLACE FUNCTION log_admin_action()
RETURNS TRIGGER AS $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND role = 'admin'
  ) THEN
    INSERT INTO admin_audit_logs (
      admin_id,
      action,
      entity_type,
      entity_id,
      old_data,
      new_data,
      ip_address
    ) VALUES (
      auth.uid(),
      TG_OP,
      TG_TABLE_NAME,
      CASE
        WHEN TG_OP = 'DELETE' THEN OLD.id
        ELSE NEW.id
      END,
      CASE
        WHEN TG_OP = 'DELETE' THEN row_to_json(OLD)
        WHEN TG_OP = 'UPDATE' THEN row_to_json(OLD)
        ELSE NULL
      END,
      CASE
        WHEN TG_OP = 'DELETE' THEN NULL
        ELSE row_to_json(NEW)
      END,
      current_setting('request.headers', true)::json->>'x-forwarded-for'
    );
  END IF;
  
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add triggers for admin audit logging
CREATE TRIGGER log_trading_strategies_audit
  AFTER INSERT OR UPDATE OR DELETE ON trading_strategies
  FOR EACH ROW EXECUTE FUNCTION log_admin_action();

CREATE TRIGGER log_profiles_audit
  AFTER UPDATE OR DELETE ON profiles
  FOR EACH ROW EXECUTE FUNCTION log_admin_action();

-- Add updated_at triggers
CREATE TRIGGER trades_updated_at
  BEFORE UPDATE ON trades
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();