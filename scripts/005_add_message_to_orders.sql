-- Add message column to orders table
ALTER TABLE orders ADD COLUMN IF NOT EXISTS message TEXT;
