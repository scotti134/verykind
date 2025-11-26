/*
  # Create Shop Items Table

  1. New Tables
    - `shop_items`
      - `id` (uuid, primary key)
      - `creator_page_id` (uuid, foreign key to creator_pages)
      - `title` (text)
      - `description` (text)
      - `price` (decimal)
      - `image_url` (text)
      - `category` (text) - e.g., 'digital', 'physical', 'zoom-call', 'ticket', 'instagram', 'other'
      - `tags` (text array) - for filtering (e.g., ['t-shirt', 'print', 'sticker'])
      - `is_active` (boolean)
      - `stock_quantity` (integer, nullable for digital items)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `shop_items` table
    - Add policy for public read access to active items
    - Add policy for creators to manage their own items
*/

CREATE TABLE IF NOT EXISTS shop_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_page_id uuid REFERENCES creator_pages(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text,
  price decimal(10, 2) NOT NULL DEFAULT 0,
  image_url text,
  category text NOT NULL DEFAULT 'other',
  tags text[] DEFAULT '{}',
  is_active boolean DEFAULT true,
  stock_quantity integer,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE shop_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view active shop items"
  ON shop_items
  FOR SELECT
  USING (is_active = true);

CREATE POLICY "Creators can view their own shop items"
  ON shop_items
  FOR SELECT
  TO authenticated
  USING (
    creator_page_id IN (
      SELECT id FROM creator_pages WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Creators can insert their own shop items"
  ON shop_items
  FOR INSERT
  TO authenticated
  WITH CHECK (
    creator_page_id IN (
      SELECT id FROM creator_pages WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Creators can update their own shop items"
  ON shop_items
  FOR UPDATE
  TO authenticated
  USING (
    creator_page_id IN (
      SELECT id FROM creator_pages WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    creator_page_id IN (
      SELECT id FROM creator_pages WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Creators can delete their own shop items"
  ON shop_items
  FOR DELETE
  TO authenticated
  USING (
    creator_page_id IN (
      SELECT id FROM creator_pages WHERE user_id = auth.uid()
    )
  );