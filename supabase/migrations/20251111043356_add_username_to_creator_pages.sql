/*
  # Add Username Field to Creator Pages

  1. Changes
    - Add `username` (text, unique) - for creating shareable URLs like buymeacoffee.com/username
    - Generate default usernames from user IDs for existing records

  2. Security
    - Username must be unique
    - Required field for all creator pages
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'creator_pages' AND column_name = 'username'
  ) THEN
    ALTER TABLE creator_pages ADD COLUMN username text;
    
    UPDATE creator_pages 
    SET username = LOWER(REGEXP_REPLACE(title, '[^a-zA-Z0-9]', '', 'g'))
    WHERE username IS NULL;
    
    ALTER TABLE creator_pages ALTER COLUMN username SET NOT NULL;
    
    CREATE UNIQUE INDEX IF NOT EXISTS creator_pages_username_unique 
    ON creator_pages(username);
  END IF;
END $$;