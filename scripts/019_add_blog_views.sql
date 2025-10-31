-- Add views column to blog_posts table
ALTER TABLE blog_posts
ADD COLUMN IF NOT EXISTS views INTEGER DEFAULT 0;

-- Create index for better performance when sorting by views
CREATE INDEX IF NOT EXISTS idx_blog_posts_views ON blog_posts(views DESC);

-- Update existing posts to have 0 views
UPDATE blog_posts SET views = 0 WHERE views IS NULL;
