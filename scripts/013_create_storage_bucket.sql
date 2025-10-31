-- Create storage bucket for project images
INSERT INTO storage.buckets (id, name, public)
VALUES ('project-images', 'project-images', true)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies to allow authenticated users to upload
CREATE POLICY "Allow authenticated users to upload project images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'project-images');

CREATE POLICY "Allow public to view project images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'project-images');

CREATE POLICY "Allow authenticated users to update their uploads"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'project-images');

CREATE POLICY "Allow authenticated users to delete their uploads"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'project-images');
