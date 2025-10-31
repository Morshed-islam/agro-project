-- Add message column to investments table
ALTER TABLE investments ADD COLUMN IF NOT EXISTS message TEXT;

-- Update investment_type check constraint to accept payment frequency values
ALTER TABLE investments DROP CONSTRAINT IF EXISTS investments_investment_type_check;
ALTER TABLE investments ADD CONSTRAINT investments_investment_type_check 
  CHECK (investment_type IN ('one-time', 'monthly', 'quarterly', 'equity', 'loan', 'donation'));
