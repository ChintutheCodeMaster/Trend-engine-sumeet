-- Purchases table — one row per completed Stripe payment
CREATE TABLE IF NOT EXISTS purchases (
  id                UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug              TEXT NOT NULL,
  email             TEXT NOT NULL,
  token             TEXT UNIQUE NOT NULL DEFAULT gen_random_uuid()::text,
  stripe_session_id TEXT UNIQUE NOT NULL,
  created_at        TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS purchases_token_idx ON purchases(token);
CREATE INDEX IF NOT EXISTS purchases_slug_idx  ON purchases(slug);
CREATE INDEX IF NOT EXISTS purchases_email_idx ON purchases(email);
