/*
  # Create supporters table

  1. New Tables
    - `supporters`
      - `id` (uuid, primary key) - Unique identifier for each support transaction
      - `creator_id` (uuid) - Foreign key to auth.users (creator being supported)
      - `supporter_name` (text) - Name of the person providing support
      - `supporter_email` (text) - Email of the supporter
      - `amount` (numeric) - Amount of support (minimum $5)
      - `message` (text, optional) - Optional message from supporter
      - `is_anonymous` (boolean) - Whether the support is anonymous
      - `created_at` (timestamptz) - When the support was made

  2. Security
    - Enable RLS on `supporters` table
    - Add policy for anyone to create support records
    - Add policy for creators to view their supporters
    - Add policy for public to view non-anonymous supporters
*/

CREATE TABLE IF NOT EXISTS supporters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  supporter_name text NOT NULL,
  supporter_email text NOT NULL,
  amount numeric NOT NULL CHECK (amount >= 5),
  message text,
  is_anonymous boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE supporters ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create support records"
  ON supporters
  FOR INSERT
  TO authenticated, anon
  WITH CHECK (amount >= 5);

CREATE POLICY "Creators can view their supporters"
  ON supporters
  FOR SELECT
  TO authenticated
  USING (creator_id = auth.uid());

CREATE POLICY "Public can view non-anonymous supporters"
  ON supporters
  FOR SELECT
  TO authenticated, anon
  USING (is_anonymous = false);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_supporters_creator_id ON supporters(creator_id);
CREATE INDEX IF NOT EXISTS idx_supporters_created_at ON supporters(created_at DESC);