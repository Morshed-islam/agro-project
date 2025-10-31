-- Add investment_deadline column to investments table
ALTER TABLE investments
ADD COLUMN IF NOT EXISTS investment_deadline DATE;

COMMENT ON COLUMN investments.investment_deadline IS 'Preferred date by which investor wants to complete the investment';
