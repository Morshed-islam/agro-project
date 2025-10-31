-- Add cattle_number column to cattle table for user-friendly URLs
ALTER TABLE cattle ADD COLUMN cattle_number INTEGER UNIQUE;

-- Create a sequence for auto-incrementing cattle numbers
CREATE SEQUENCE cattle_number_seq START 1;

-- Set default value for cattle_number to use the sequence
ALTER TABLE cattle ALTER COLUMN cattle_number SET DEFAULT nextval('cattle_number_seq');

-- Create an index on cattle_number for faster queries
CREATE INDEX idx_cattle_number ON cattle(cattle_number);
