-- Add views column to projects table and create increment function

-- Add views column with default value 0
ALTER TABLE projects ADD COLUMN IF NOT EXISTS views INTEGER DEFAULT 0;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_projects_views ON projects(views DESC);

-- Create function to increment views atomically
CREATE OR REPLACE FUNCTION increment_project_views(project_uuid UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE projects
  SET views = views + 1
  WHERE id = project_uuid;
END;
$$;

-- Grant execute permission to authenticated and anon users
GRANT EXECUTE ON FUNCTION increment_project_views(UUID) TO authenticated, anon;

-- Update existing projects to have 0 views if NULL
UPDATE projects SET views = 0 WHERE views IS NULL;
