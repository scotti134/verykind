/*
  # Setup Creator Images Storage

  1. Storage Setup
    - Create `creator-images` bucket for storing profile pictures, cover images, and gallery images
    - Enable public access for viewing images
    - Set up RLS policies for secure uploads
    
  2. Security
    - Only authenticated users can upload images
    - Users can only upload to their own folders
    - Public read access for all images (needed for displaying on public pages)
    - File size limits will be enforced at application level
*/

-- Create storage bucket for creator images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'creator-images',
  'creator-images',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/jpg']
)
ON CONFLICT (id) DO NOTHING;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can upload own images" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own images" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own images" ON storage.objects;
DROP POLICY IF EXISTS "Public can view images" ON storage.objects;

-- Allow authenticated users to upload images to their own folder
CREATE POLICY "Users can upload own images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'creator-images' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow authenticated users to update their own images
CREATE POLICY "Users can update own images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'creator-images' AND
  (storage.foldername(name))[1] = auth.uid()::text
)
WITH CHECK (
  bucket_id = 'creator-images' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow authenticated users to delete their own images
CREATE POLICY "Users can delete own images"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'creator-images' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow public read access to all images
CREATE POLICY "Public can view images"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'creator-images');