-- Update investment status column to support 5 statuses
-- Drop existing status column if it exists and recreate with new values
ALTER TABLE investments DROP COLUMN IF EXISTS status;

-- Add status column with 5 options including rejected
ALTER TABLE investments ADD COLUMN status TEXT NOT NULL DEFAULT 'pending' 
  CHECK (status IN ('pending', 'approved', 'unpaid', 'paid', 'rejected'));

-- Create index for faster status queries
CREATE INDEX IF NOT EXISTS idx_investments_status ON investments(status);

-- Update existing records to have pending status
UPDATE investments SET status = 'pending' WHERE status IS NULL;
