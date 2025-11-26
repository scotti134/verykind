/*
  # Create Posts and Membership Tiers Tables

  1. New Tables
    - `posts`
      - `id` (uuid, primary key) - Unique identifier for the post
      - `creator_id` (uuid, foreign key to profiles) - The creator who wrote the post
      - `title` (text) - Post title
      - `content` (text) - Post content/body
      - `excerpt` (text) - Short preview text
      - `image_url` (text) - Featured image for the post
      - `is_member_only` (boolean) - Whether post is for members only
      - `likes_count` (integer) - Number of likes
      - `comments_count` (integer) - Number of comments
      - `created_at` (timestamptz) - When the post was created
      - `updated_at` (timestamptz) - When the post was last updated

    - `membership_tiers`
      - `id` (uuid, primary key) - Unique identifier for the tier
      - `creator_id` (uuid, foreign key to profiles) - The creator offering the tier
      - `name` (text) - Tier name
      - `description` (text) - Tier description
      - `price` (numeric) - Monthly price
      - `benefits` (jsonb) - Array of benefit strings
      - `is_active` (boolean) - Whether tier is currently available
      - `member_count` (integer) - Number of current members
      - `created_at` (timestamptz) - When the tier was created
      - `updated_at` (timestamptz) - When the tier was last updated

  2. Security
    - Enable RLS on both tables
    - Add policies for viewing and managing posts
    - Add policies for viewing and managing membership tiers
*/

CREATE TABLE IF NOT EXISTS posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  content text DEFAULT '',
  excerpt text DEFAULT '',
  image_url text DEFAULT '',
  is_member_only boolean DEFAULT false,
  likes_count integer DEFAULT 0,
  comments_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view public posts"
  ON posts
  FOR SELECT
  USING (is_member_only = false);

CREATE POLICY "Members can view member-only posts"
  ON posts
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Creators can insert their own posts"
  ON posts
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Creators can update their own posts"
  ON posts
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = creator_id)
  WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Creators can delete their own posts"
  ON posts
  FOR DELETE
  TO authenticated
  USING (auth.uid() = creator_id);

CREATE INDEX IF NOT EXISTS idx_posts_creator_id ON posts(creator_id);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC);

CREATE TABLE IF NOT EXISTS membership_tiers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text DEFAULT '',
  price numeric NOT NULL DEFAULT 0,
  benefits jsonb DEFAULT '[]'::jsonb,
  is_active boolean DEFAULT true,
  member_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE membership_tiers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active membership tiers"
  ON membership_tiers
  FOR SELECT
  USING (is_active = true);

CREATE POLICY "Creators can view their own tiers"
  ON membership_tiers
  FOR SELECT
  TO authenticated
  USING (auth.uid() = creator_id);

CREATE POLICY "Creators can insert their own tiers"
  ON membership_tiers
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Creators can update their own tiers"
  ON membership_tiers
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = creator_id)
  WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Creators can delete their own tiers"
  ON membership_tiers
  FOR DELETE
  TO authenticated
  USING (auth.uid() = creator_id);

CREATE INDEX IF NOT EXISTS idx_membership_tiers_creator_id ON membership_tiers(creator_id);
