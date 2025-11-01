-- Update investment status constraint to include all 5 statuses
-- This script only modifies the constraint without dropping the column

-- Drop the existing check constraint if it exists
ALTER TABLE investments 
DROP CONSTRAINT IF EXISTS investments_status_check;

-- Add new check constraint with all 5 statuses
ALTER TABLE investments 
ADD CONSTRAINT investments_status_check 
CHECK (status IN ('pending', 'approved', 'unpaid', 'paid', 'rejected'));

-- Update any NULL status values to 'pending' as default
UPDATE investments 
SET status = 'pending' 
WHERE status IS NULL;

-- Make status column NOT NULL if it isn't already
ALTER TABLE investments 
ALTER COLUMN status SET NOT NULL;

-- Set default value for new rows
ALTER TABLE investments 
ALTER COLUMN status SET DEFAULT 'pending';
