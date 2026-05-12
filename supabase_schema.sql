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
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.raw_user_meta_data->>'full_name')
  );
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

-- Seed the counter row if it doesn't exist
INSERT INTO founding_members (id, count, max) VALUES ('1', 0, 100)
ON CONFLICT (id) DO NOTHING;

-- ── Atomic founding member increment (max 100) ─────────────
CREATE OR REPLACE FUNCTION increment_founding()
RETURNS INTEGER AS $$
DECLARE
  new_count INTEGER;
BEGIN
  UPDATE founding_members
  SET count = LEAST(count + 1, max), updated_at = NOW()
  WHERE id = '1'
  RETURNING count INTO new_count;
  RETURN new_count;
END;
$$ LANGUAGE plpgsql;

-- ── Row Level Security ─────────────────────────────────────
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_hooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE founding_members ENABLE ROW LEVEL SECURITY;

-- Profiles: users can only read/write their own row
CREATE POLICY "Users own profile" ON profiles
  FOR ALL USING (auth.uid() = id);

-- Saved hooks: users can only access their own hooks
CREATE POLICY "Users own saved hooks" ON saved_hooks
  FOR ALL USING (auth.uid() = user_id);

-- Founding members: anyone can read the count, only service role can write
CREATE POLICY "Anyone can read founding count" ON founding_members
  FOR SELECT USING (true);

-- ============================================================
-- ✅ Done! Your schema is ready.
-- Next: add these to Vercel env vars:
--   NEXT_PUBLIC_SUPABASE_URL=https://fbzlisaqwabyotgbnpfw.supabase.co
--   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZiemxpc2Fxd2FieW90Z2JucGZ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgxNjk0ODcsImV4cCI6MjA5Mzc0NTQ4N30.7z5W0aqP2hG1aDiEifU4yEtjUDWB5ewoSJpGvBfQ_kI
--   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZiemxpc2Fxd2FieW90Z2JucGZ3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODE2OTQ4NywiZXhwIjoyMDkzNzQ1NDg3fQ==
-- ============================================================
