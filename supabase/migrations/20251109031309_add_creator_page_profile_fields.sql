/*
  # Add Profile Fields to Creator Pages

  1. New Columns Added
    - `profile_image_url` (text) - URL for creator's profile picture
    - `cover_image_url` (text) - URL for page cover/banner image
    - `tagline` (text) - Short catchy tagline/slogan
    - `social_twitter` (text) - Twitter/X handle
    - `social_instagram` (text) - Instagram handle
    - `social_website` (text) - Personal or business website URL
    - `show_supporter_count` (boolean) - Toggle to show/hide supporter count
    - `support_item_name` (text) - Custom name for support item (default: "coffee")
    - `support_item_emoji` (text) - Custom emoji for support item (default: "☕")
    - `support_price` (numeric) - Default support/coffee price
    
  2. Notes
    - All fields have sensible defaults
    - Maintains existing data integrity
    - No data loss for existing records
*/

-- Add profile image URL
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'creator_pages' AND column_name = 'profile_image_url'
  ) THEN
    ALTER TABLE creator_pages ADD COLUMN profile_image_url text DEFAULT '';
  END IF;
END $$;

-- Add cover image URL
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'creator_pages' AND column_name = 'cover_image_url'
  ) THEN
    ALTER TABLE creator_pages ADD COLUMN cover_image_url text DEFAULT '';
  END IF;
END $$;

-- Add tagline
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'creator_pages' AND column_name = 'tagline'
  ) THEN
    ALTER TABLE creator_pages ADD COLUMN tagline text DEFAULT '';
  END IF;
END $$;

-- Add social media links
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'creator_pages' AND column_name = 'social_twitter'
  ) THEN
    ALTER TABLE creator_pages ADD COLUMN social_twitter text DEFAULT '';
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'creator_pages' AND column_name = 'social_instagram'
  ) THEN
    ALTER TABLE creator_pages ADD COLUMN social_instagram text DEFAULT '';
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'creator_pages' AND column_name = 'social_website'
  ) THEN
    ALTER TABLE creator_pages ADD COLUMN social_website text DEFAULT '';
  END IF;
END $$;

-- Add supporter count visibility toggle
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'creator_pages' AND column_name = 'show_supporter_count'
  ) THEN
    ALTER TABLE creator_pages ADD COLUMN show_supporter_count boolean DEFAULT true;
  END IF;
END $$;

-- Add custom support item customization
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'creator_pages' AND column_name = 'support_item_name'
  ) THEN
    ALTER TABLE creator_pages ADD COLUMN support_item_name text DEFAULT 'coffee';
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'creator_pages' AND column_name = 'support_item_emoji'
  ) THEN
    ALTER TABLE creator_pages ADD COLUMN support_item_emoji text DEFAULT '☕';
  END IF;
END $$;

-- Add support price
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'creator_pages' AND column_name = 'support_price'
  ) THEN
    ALTER TABLE creator_pages ADD COLUMN support_price numeric DEFAULT 5.00;
  END IF;
END $$;