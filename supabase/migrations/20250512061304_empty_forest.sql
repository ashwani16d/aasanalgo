/*
  # Set up Nifty 50 Options Trading Strategy

  1. New Tables
    - `strategy_signals`
      - Track trading signals and patterns
      - Store entry prices and strike prices
      - Link to trading strategies

  2. Functions
    - `calculate_buffer_price`
      - Calculate buffer prices for trades
      - Handle rounding precision
*/

-- Insert default strategy if not exists
INSERT INTO trading_strategies (
  name,
  description,
  parameters,
  is_active
) 
SELECT 
  'Nifty 50 Options',
  'Automated options trading strategy for Nifty 50 index based on swing detection and timeframe rules',
  jsonb_build_object(
    'name', 'Nifty 50 Options',
    'description', 'Automated Nifty 50 options trading based on swing detection',
    'tradingHours', jsonb_build_object(
      'start', '09:15',
      'morningEnd', '10:30',
      'end', '15:00'
    ),
    'timeframes', jsonb_build_object(
      'morning', '1',
      'day', '3'
    ),
    'swingRules', jsonb_build_object(
      'consecutiveCandles', 3,
      'bufferPoints', 2,
      'roundingPrecision', 0.1
    ),
    'active', true
  ),
  true
WHERE NOT EXISTS (
  SELECT 1 FROM trading_strategies WHERE name = 'Nifty 50 Options'
);

-- Update existing strategy parameters if exists
UPDATE trading_strategies
SET parameters = jsonb_build_object(
  'name', 'Nifty 50 Options',
  'description', 'Automated Nifty 50 options trading based on swing detection',
  'tradingHours', jsonb_build_object(
    'start', '09:15',
    'morningEnd', '10:30',
    'end', '15:00'
  ),
  'timeframes', jsonb_build_object(
    'morning', '1',
    'day', '3'
  ),
  'swingRules', jsonb_build_object(
    'consecutiveCandles', 3,
    'bufferPoints', 2,
    'roundingPrecision', 0.1
  ),
  'active', true
)
WHERE name = 'Nifty 50 Options';

-- Create table for strategy signals
CREATE TABLE IF NOT EXISTS strategy_signals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  strategy_id uuid REFERENCES trading_strategies(id) ON DELETE CASCADE,
  symbol text NOT NULL,
  direction text NOT NULL CHECK (direction IN ('call', 'put')),
  entry_price numeric NOT NULL,
  strike_price numeric NOT NULL,
  buffer_price numeric NOT NULL,
  candle_pattern jsonb NOT NULL,
  timeframe text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE strategy_signals ENABLE ROW LEVEL SECURITY;

-- Add RLS policies
CREATE POLICY "Users can view signals for their strategies"
  ON strategy_signals FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_strategies
      WHERE user_strategies.strategy_id = strategy_signals.strategy_id
      AND user_strategies.user_id = auth.uid()
    )
  );

-- Create function to calculate buffer price
CREATE OR REPLACE FUNCTION calculate_buffer_price(
  base_price numeric,
  buffer_points numeric DEFAULT 2,
  rounding_precision numeric DEFAULT 0.1
) RETURNS numeric AS $$
DECLARE
  rounded_base numeric;
  buffer_price numeric;
BEGIN
  -- Round the base price
  rounded_base := round(base_price / rounding_precision) * rounding_precision;
  
  -- Add buffer points
  buffer_price := rounded_base + buffer_points;
  
  -- Round the final price
  RETURN round(buffer_price / rounding_precision) * rounding_precision;
END;
$$ LANGUAGE plpgsql;