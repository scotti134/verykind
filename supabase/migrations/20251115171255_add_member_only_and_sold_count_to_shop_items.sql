/*
  # Add is_member_only and sold_count to shop_items

  1. Changes
    - Add `is_member_only` (boolean) - Whether item is exclusive to members
    - Add `sold_count` (integer) - Number of times item has been sold
  
  2. Notes
    - Uses IF NOT EXISTS to prevent errors if columns already exist
    - Sets default values for existing rows
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'shop_items' AND column_name = 'is_member_only'
  ) THEN
    ALTER TABLE shop_items ADD COLUMN is_member_only boolean DEFAULT false;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'shop_items' AND column_name = 'sold_count'
  ) THEN
    ALTER TABLE shop_items ADD COLUMN sold_count integer DEFAULT 0;
  END IF;
END $$;
