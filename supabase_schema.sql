-- ============================================================
-- Made by Friday — Supabase Schema
-- Run this in: Supabase Dashboard → SQL Editor
-- ============================================================

-- ── Profiles ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  name TEXT,
  avatar_url TEXT,
  plan TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'pro', 'max', 'lifetime')),
  scripts_used INTEGER NOT NULL DEFAULT 0,
  scripts_reset_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  workspace_data JSONB,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS workspace_data JSONB;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT;

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.raw_user_meta_data->>'full_name')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ── Saved Hooks ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS saved_hooks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  hook_data JSONB NOT NULL,
  saved_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  is_this_week BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE INDEX IF NOT EXISTS idx_saved_hooks_user ON saved_hooks(user_id);

-- ── Founding Members Counter ────────────────────────────────
CREATE TABLE IF NOT EXISTS founding_members (
  id TEXT PRIMARY KEY DEFAULT '1',
  count INTEGER NOT NULL DEFAULT 0,
  max INTEGER NOT NULL DEFAULT 100,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO founding_members (id, count, max) VALUES ('1', 0, 100)
ON CONFLICT (id) DO NOTHING;

-- Atomic founding member increment.
-- Returns the updated row only when a seat was actually claimed.
CREATE OR REPLACE FUNCTION claim_founding_seat()
RETURNS TABLE(count INTEGER, max INTEGER) AS $$
BEGIN
  RETURN QUERY
  UPDATE founding_members fm
  SET count = fm.count + 1,
      updated_at = NOW()
  WHERE fm.id = '1'
    AND fm.count < fm.max
  RETURNING fm.count, fm.max;
END;
$$ LANGUAGE plpgsql;

-- Backwards-compatible wrapper for older app code/manual checks.
CREATE OR REPLACE FUNCTION increment_founding()
RETURNS INTEGER AS $$
DECLARE
  new_count INTEGER;
BEGIN
  SELECT c.count INTO new_count FROM claim_founding_seat() AS c;
  RETURN new_count;
END;
$$ LANGUAGE plpgsql;

-- Stripe webhook event idempotency.
CREATE TABLE IF NOT EXISTS stripe_events (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Optional purchase ledger for support/refunds/debugging.
CREATE TABLE IF NOT EXISTS purchases (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  stripe_checkout_session_id TEXT UNIQUE,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  plan TEXT NOT NULL,
  amount_total INTEGER,
  currency TEXT,
  status TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_purchases_user ON purchases(user_id);

-- ── Row Level Security ─────────────────────────────────────
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_hooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE founding_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE stripe_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users own profile" ON profiles;
CREATE POLICY "Users own profile" ON profiles
  FOR ALL USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users own saved hooks" ON saved_hooks;
CREATE POLICY "Users own saved hooks" ON saved_hooks
  FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Anyone can read founding count" ON founding_members;
CREATE POLICY "Anyone can read founding count" ON founding_members
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can read own purchases" ON purchases;
CREATE POLICY "Users can read own purchases" ON purchases
  FOR SELECT USING (auth.uid() = user_id);

-- stripe_events and purchase writes are service-role only by omission.

-- ============================================================
-- ✅ Done. Add required runtime secrets via Vercel/Supabase dashboards.
-- Never commit real service-role keys or API secrets into this file.
-- ============================================================
