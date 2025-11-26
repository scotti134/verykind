/*
  # Update Shop Items Table with Additional Fields

  1. Changes
    - Add `success_type` (text) - 'message' or 'redirect'
    - Add `success_message` (text) - confirmation message after purchase
    - Add `redirect_url` (text) - URL to redirect after purchase
    - Add `categories` (text array) - custom categories for filtering
    - Add `ask_question` (boolean) - whether to ask buyer a question
    - Add `question_text` (text) - the question to ask
    - Add `limit_slots` (boolean) - whether to limit available quantity
    - Add `allow_quantity` (boolean) - whether buyer can choose quantity
    - Add `featured_image_url` (text) - separate from main image_url
    - Add `content_agreement` (boolean) - whether creator agreed to content policy
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'shop_items' AND column_name = 'success_type'
  ) THEN
    ALTER TABLE shop_items ADD COLUMN success_type text DEFAULT 'message';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'shop_items' AND column_name = 'success_message'
  ) THEN
    ALTER TABLE shop_items ADD COLUMN success_message text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'shop_items' AND column_name = 'redirect_url'
  ) THEN
    ALTER TABLE shop_items ADD COLUMN redirect_url text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'shop_items' AND column_name = 'categories'
  ) THEN
    ALTER TABLE shop_items ADD COLUMN categories text[] DEFAULT '{}';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'shop_items' AND column_name = 'ask_question'
  ) THEN
    ALTER TABLE shop_items ADD COLUMN ask_question boolean DEFAULT false;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'shop_items' AND column_name = 'question_text'
  ) THEN
    ALTER TABLE shop_items ADD COLUMN question_text text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'shop_items' AND column_name = 'limit_slots'
  ) THEN
    ALTER TABLE shop_items ADD COLUMN limit_slots boolean DEFAULT false;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'shop_items' AND column_name = 'allow_quantity'
  ) THEN
    ALTER TABLE shop_items ADD COLUMN allow_quantity boolean DEFAULT false;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'shop_items' AND column_name = 'featured_image_url'
  ) THEN
    ALTER TABLE shop_items ADD COLUMN featured_image_url text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'shop_items' AND column_name = 'content_agreement'
  ) THEN
    ALTER TABLE shop_items ADD COLUMN content_agreement boolean DEFAULT false;
  END IF;
END $$;