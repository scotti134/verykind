/*
  # Add Gallery Images to Creator Pages

  1. Schema Changes
    - Add `gallery_images` column to store array of gallery image URLs (up to 10 images)
    - Uses JSONB array to store image data with URLs and metadata
    
  2. Notes
    - Gallery images will be stored as JSONB array
    - Each image entry contains: url, caption (optional), order
    - Maximum 10 images enforced at application level
*/

-- Add gallery images array
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'creator_pages' AND column_name = 'gallery_images'
  ) THEN
    ALTER TABLE creator_pages ADD COLUMN gallery_images jsonb DEFAULT '[]'::jsonb;
  END IF;
END $$;