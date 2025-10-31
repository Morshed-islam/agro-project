-- Add project_number column to projects table
ALTER TABLE projects ADD COLUMN IF NOT EXISTS project_number INTEGER UNIQUE;

-- Create a sequence for auto-incrementing project numbers
CREATE SEQUENCE IF NOT EXISTS project_number_seq START 1;

-- Update existing projects with project numbers
UPDATE projects SET project_number = nextval('project_number_seq') WHERE project_number IS NULL;

-- Make project_number NOT NULL after setting values
ALTER TABLE projects ALTER COLUMN project_number SET NOT NULL;

-- Set default for future inserts
ALTER TABLE projects ALTER COLUMN project_number SET DEFAULT nextval('project_number_seq');

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_projects_project_number ON projects(project_number);
