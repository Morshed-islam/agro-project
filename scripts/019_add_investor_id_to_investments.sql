-- Add investor_id column to investments table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'investments' AND column_name = 'investor_id'
  ) THEN
    ALTER TABLE investments ADD COLUMN investor_id UUID REFERENCES investor_profiles(id) ON DELETE SET NULL;
    CREATE INDEX IF NOT EXISTS idx_investments_investor_id ON investments(investor_id);
  END IF;
END $$;
