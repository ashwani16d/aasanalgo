/*
  # Add strategy parameters

  1. Changes
    - Add default parameters to trading_strategies table
    - Update existing rows with default parameters
*/

DO $$ 
BEGIN
  -- Update existing rows with default parameters if they don't have them
  UPDATE trading_strategies
  SET parameters = '{
    "startTime": "09:15",
    "endTime": "15:00",
    "morningTimeframe": "1",
    "dayTimeframe": "3",
    "morningEndTime": "10:30"
  }'::jsonb
  WHERE parameters IS NULL OR parameters = '{}'::jsonb;
END $$;