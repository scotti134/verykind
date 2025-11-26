/*
  # Add subcategory field and update category structure
  
  1. Schema Changes
    - Add `subcategory` column to profiles table for more granular categorization
    - Add `main_category` column to replace generic `category` field
    - Add `location` and `organization_type` fields for better filtering
    - Add `monthly_supporters` and `goal_amount` for display stats
    
  2. Security
    - Maintain existing RLS policies
*/

-- Add new columns to profiles table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'subcategory'
  ) THEN
    ALTER TABLE profiles ADD COLUMN subcategory text DEFAULT '';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'main_category'
  ) THEN
    ALTER TABLE profiles ADD COLUMN main_category text DEFAULT 'people';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'location'
  ) THEN
    ALTER TABLE profiles ADD COLUMN location text DEFAULT '';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'organization_type'
  ) THEN
    ALTER TABLE profiles ADD COLUMN organization_type text DEFAULT 'individual';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'monthly_supporters'
  ) THEN
    ALTER TABLE profiles ADD COLUMN monthly_supporters integer DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'goal_amount'
  ) THEN
    ALTER TABLE profiles ADD COLUMN goal_amount numeric DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'current_amount'
  ) THEN
    ALTER TABLE profiles ADD COLUMN current_amount numeric DEFAULT 0;
  END IF;
END $$;