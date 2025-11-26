/*
  # Create Newsletter Signups Table

  1. New Tables
    - `newsletter_signups`
      - `id` (uuid, primary key) - Unique identifier for each signup
      - `email` (text, unique, not null) - Subscriber's email address
      - `source` (text, default 'website') - Where the signup came from (website, news_section, etc.)
      - `subscribed` (boolean, default true) - Whether the user is currently subscribed
      - `created_at` (timestamptz) - When the user signed up
      - `updated_at` (timestamptz) - When the record was last updated

  2. Security
    - Enable RLS on `newsletter_signups` table
    - Add policy to allow anyone to insert (for public signups)
    - Add policy for authenticated users to read their own signups
    - Add policy for service role to manage all signups

  3. Important Notes
    - Emails are unique to prevent duplicate signups
    - Default subscribed to true for new signups
    - Source field helps track signup origin
    - Public insert policy allows unauthenticated newsletter signups
*/

CREATE TABLE IF NOT EXISTS newsletter_signups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  source text DEFAULT 'website',
  subscribed boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE newsletter_signups ENABLE ROW LEVEL SECURITY;

-- Allow anyone to sign up for newsletter (public insert)
CREATE POLICY "Anyone can sign up for newsletter"
  ON newsletter_signups
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Allow users to view their own signups if authenticated
CREATE POLICY "Users can view own newsletter signups"
  ON newsletter_signups
  FOR SELECT
  TO authenticated
  USING (email = auth.jwt()->>'email');

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_newsletter_signups_email ON newsletter_signups(email);

-- Create index on subscribed status for filtering
CREATE INDEX IF NOT EXISTS idx_newsletter_signups_subscribed ON newsletter_signups(subscribed);
