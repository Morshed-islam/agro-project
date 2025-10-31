-- Update investment_type check constraint to accept 6-months and 12-months
ALTER TABLE investments DROP CONSTRAINT IF EXISTS investments_investment_type_check;
ALTER TABLE investments ADD CONSTRAINT investments_investment_type_check 
  CHECK (investment_type IN ('6-months', '12-months', 'one-time', 'monthly', 'quarterly', 'equity', 'loan', 'donation'));
