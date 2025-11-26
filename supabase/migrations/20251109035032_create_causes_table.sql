/*
  # Create Causes Table for Community Care

  1. New Tables
    - `causes`
      - `id` (uuid, primary key) - Unique identifier for the cause
      - `creator_id` (uuid, foreign key to profiles) - The creator who added this cause
      - `title` (text) - Name of the cause
      - `description` (text) - Detailed description of the cause
      - `image_url` (text) - Image URL for the cause
      - `target_amount` (numeric) - Fundraising goal amount
      - `current_amount` (numeric) - Current amount raised
      - `category` (text) - Category (people, animals, planet)
      - `status` (text) - Status (active, completed, archived)
      - `created_at` (timestamptz) - When the cause was created
      - `updated_at` (timestamptz) - When the cause was last updated

  2. Security
    - Enable RLS on `causes` table
    - Add policy for anyone to view active causes
    - Add policy for creators to manage their own causes
    - Add policy for authenticated users to view all their causes
*/

CREATE TABLE IF NOT EXISTS causes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text DEFAULT '',
  image_url text DEFAULT '',
  target_amount numeric DEFAULT 0,
  current_amount numeric DEFAULT 0,
  category text DEFAULT 'people',
  status text DEFAULT 'active',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE causes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active causes"
  ON causes
  FOR SELECT
  USING (status = 'active');

CREATE POLICY "Creators can view their own causes"
  ON causes
  FOR SELECT
  TO authenticated
  USING (auth.uid() = creator_id);

CREATE POLICY "Creators can insert their own causes"
  ON causes
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Creators can update their own causes"
  ON causes
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = creator_id)
  WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Creators can delete their own causes"
  ON causes
  FOR DELETE
  TO authenticated
  USING (auth.uid() = creator_id);

CREATE INDEX IF NOT EXISTS idx_causes_creator_id ON causes(creator_id);
CREATE INDEX IF NOT EXISTS idx_causes_status ON causes(status);
CREATE INDEX IF NOT EXISTS idx_causes_category ON causes(category);