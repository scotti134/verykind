/*
  # Add missing columns to creator_pages table

  1. Changes
    - Add `display_name` column (text, not null with default)
    - Add `bio` column (text, nullable with default)
    - Add `avatar_url` column (text, nullable with default)
    - Add `category` column (text, nullable with default)
    - Add `subcategory` column (text, nullable with default)

  2. Notes
    - These columns are needed for the profile creation flow
    - All columns have safe defaults to prevent errors
    - No data loss as these are new columns
*/

-- Add missing columns to creator_pages table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'creator_pages' AND column_name = 'display_name'
  ) THEN
    ALTER TABLE creator_pages ADD COLUMN display_name text DEFAULT '' NOT NULL;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'creator_pages' AND column_name = 'bio'
  ) THEN
    ALTER TABLE creator_pages ADD COLUMN bio text DEFAULT '';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'creator_pages' AND column_name = 'avatar_url'
  ) THEN
    ALTER TABLE creator_pages ADD COLUMN avatar_url text DEFAULT '';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'creator_pages' AND column_name = 'category'
  ) THEN
    ALTER TABLE creator_pages ADD COLUMN category text DEFAULT 'People';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'creator_pages' AND column_name = 'subcategory'
  ) THEN
    ALTER TABLE creator_pages ADD COLUMN subcategory text DEFAULT '';
  END IF;
END $$;
