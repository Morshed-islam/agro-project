-- Fix investment status constraint to support all 5 statuses
-- This script properly drops the old constraint and creates a new one

-- Drop the existing check constraint if it exists
ALTER TABLE investments DROP CONSTRAINT IF EXISTS investments_status_check;

-- Drop the status column if it exists
ALTER TABLE investments DROP COLUMN IF EXISTS status;

-- Add status column with all 5 options
ALTER TABLE investments ADD COLUMN status TEXT NOT NULL DEFAULT 'pending';

-- Add the new check constraint with all 5 statuses
ALTER TABLE investments ADD CONSTRAINT investments_status_check 
  CHECK (status IN ('pending', 'approved', 'unpaid', 'paid', 'rejected'));

-- Create index for faster status queries
CREATE INDEX IF NOT EXISTS idx_investments_status ON investments(status);

-- Set all existing records to pending status
UPDATE investments SET status = 'pending' WHERE status IS NULL OR status = '';
