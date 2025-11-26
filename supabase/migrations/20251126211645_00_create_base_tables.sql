/*
  # Create Base Tables for Creator Support Platform

  1. New Tables
    - `creator_pages`
      - `id` (uuid, primary key) - Unique identifier for creator page
      - `user_id` (uuid, foreign key to auth.users) - Owner of the page
      - `created_at` (timestamptz) - When page was created
      - `updated_at` (timestamptz) - Last update time
      
    - `profiles`
      - `id` (uuid, primary key) - Unique identifier
      - `user_id` (uuid, foreign key to auth.users) - User reference
      - `created_at` (timestamptz) - Creation time
      - `updated_at` (timestamptz) - Last update time

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
    
  3. Important Notes
    - Base structure for the creator support platform
    - Additional columns will be added by subsequent migrations
*/

-- Create creator_pages table
CREATE TABLE IF NOT EXISTS creator_pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE creator_pages ENABLE ROW LEVEL SECURITY;

-- Policies for creator_pages
CREATE POLICY "Users can view all creator pages"
  ON creator_pages
  FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Users can create own creator page"
  ON creator_pages
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own creator page"
  ON creator_pages
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own creator page"
  ON creator_pages
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policies for profiles
CREATE POLICY "Users can view all profiles"
  ON profiles
  FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Users can create own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own profile"
  ON profiles
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_creator_pages_user_id ON creator_pages(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);
