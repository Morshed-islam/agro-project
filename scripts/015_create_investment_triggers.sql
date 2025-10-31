-- Create function to update project statistics when investments change
CREATE OR REPLACE FUNCTION update_project_statistics()
RETURNS TRIGGER AS $$
BEGIN
  -- Update the project's raised_amount and investor_count
  -- This works for INSERT, UPDATE, and DELETE operations
  
  -- For INSERT and UPDATE, update the NEW project
  IF (TG_OP = 'INSERT' OR TG_OP = 'UPDATE') THEN
    UPDATE projects
    SET 
      raised_amount = (
        SELECT COALESCE(SUM(amount), 0)
        FROM investments
        WHERE project_id = NEW.project_id
      ),
      investor_count = (
        SELECT COUNT(DISTINCT id)
        FROM investments
        WHERE project_id = NEW.project_id
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
        WHERE project_id = OLD.project_id
      ),
      investor_count = (
        SELECT COUNT(DISTINCT id)
        FROM investments
        WHERE project_id = OLD.project_id
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

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS trigger_update_project_statistics ON investments;

-- Create trigger that fires after INSERT, UPDATE, or DELETE on investments
CREATE TRIGGER trigger_update_project_statistics
AFTER INSERT OR UPDATE OR DELETE ON investments
FOR EACH ROW
EXECUTE FUNCTION update_project_statistics();

-- Update all existing projects to have correct statistics
UPDATE projects p
SET 
  raised_amount = (
    SELECT COALESCE(SUM(amount), 0)
    FROM investments
    WHERE project_id = p.id
  ),
  investor_count = (
    SELECT COUNT(DISTINCT id)
    FROM investments
    WHERE project_id = p.id
  );
