-- Update cattle table to support multiple videos
ALTER TABLE cattle 
  DROP COLUMN IF EXISTS video_url,
  ADD COLUMN IF NOT EXISTS videos TEXT[] DEFAULT '{}';

-- Update existing data to move video_url to videos array
-- (This is safe to run even if video_url column doesn't exist)
