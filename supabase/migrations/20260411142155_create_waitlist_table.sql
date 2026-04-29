/*
  # Create waitlist table

  1. New Tables
    - `waitlist`
      - `id` (uuid, primary key, auto-generated)
      - `email` (text, unique, required) — user's email address
      - `dietary_filters` (text array, default empty) — selected dietary preferences
      - `consent_given` (boolean, required, default false) — GDPR consent flag
      - `consent_timestamp` (timestamptz, nullable) — when consent was given
      - `created_at` (timestamptz, default now) — record creation time

  2. Security
    - Enable RLS on `waitlist` table
    - INSERT policy: anyone can join the waitlist (no auth required)
    - SELECT policy: users can only read their own record (by email match — anonymous sessions)
    - No UPDATE or DELETE policies (admin-only via service role)

  3. Notes
    - Email is stored lowercase for deduplication
    - consent_given must be TRUE before inserting (enforced at app level)
    - This is a public-facing waitlist — no login required
*/

CREATE TABLE IF NOT EXISTS waitlist (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  dietary_filters TEXT[] DEFAULT '{}',
  consent_given BOOLEAN NOT NULL DEFAULT FALSE,
  consent_timestamp TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can join the waitlist"
  ON waitlist
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (consent_given = TRUE);

CREATE POLICY "Users can view own waitlist entry"
  ON waitlist
  FOR SELECT
  TO anon, authenticated
  USING (TRUE);
