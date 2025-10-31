-- Add status field to investments table for approval workflow
ALTER TABLE investments 
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending' 
CHECK (status IN ('pending', 'approved', 'rejected'));

-- Create index for faster status queries
CREATE INDEX IF NOT EXISTS idx_investments_status ON investments(status);

-- Update existing investments to approved status (backward compatibility)
UPDATE investments SET status = 'approved' WHERE status IS NULL;

-- Drop and recreate the trigger function to only count approved investments
DROP FUNCTION IF EXISTS update_project_statistics() CASCADE;

CREATE OR REPLACE FUNCTION update_project_statistics()
RETURNS TRIGGER AS $$
BEGIN
  -- Update the project's raised_amount and investor_count
  -- Only count APPROVED investments
  
  -- For INSERT and UPDATE, update the NEW project
  IF (TG_OP = 'INSERT' OR TG_OP = 'UPDATE') THEN
    UPDATE projects
    SET 
      raised_amount = (
        SELECT COALESCE(SUM(amount), 0)
        FROM investments
        WHERE project_id = NEW.project_id AND status = 'approved'
      ),
      investor_count = (
        SELECT COUNT(DISTINCT id)
        FROM investments
        WHERE project_id = NEW.project_id AND status = 'approved'
      )
    WHERE id = NEW.project_id;
  END IF;
  
  -- For UPDATE (if project_id changed) or DELETE, update the OLD project
  IF (TG_OP = 'UPDATE' AND OLD.project_id != NEW.project_id) OR (TG_OP = 'DELETE') THEN
    UPDATE projects
    SET 
      raised_amount = (
        SELECT COALESCE(SUM(amount), 0)
        FROM investments
        WHERE project_id = OLD.project_id AND status = 'approved'
      ),
      investor_count = (
        SELECT COUNT(DISTINCT id)
        FROM investments
        WHERE project_id = OLD.project_id AND status = 'approved'
      )
    WHERE id = OLD.project_id;
  END IF;
  
  -- Return the appropriate row
  IF (TG_OP = 'DELETE') THEN
    RETURN OLD;
  ELSE
    RETURN NEW;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Recreate trigger
DROP TRIGGER IF EXISTS trigger_update_project_statistics ON investments;

CREATE TRIGGER trigger_update_project_statistics
AFTER INSERT OR UPDATE OR DELETE ON investments
FOR EACH ROW
EXECUTE FUNCTION update_project_statistics();

-- Recalculate all project statistics based on approved investments only
UPDATE projects p
SET 
  raised_amount = (
    SELECT COALESCE(SUM(amount), 0)
    FROM investments
    WHERE project_id = p.id AND status = 'approved'
  ),
  investor_count = (
    SELECT COUNT(DISTINCT id)
    FROM investments
    WHERE project_id = p.id AND status = 'approved'
  );
