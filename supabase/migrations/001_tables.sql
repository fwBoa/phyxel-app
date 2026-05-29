-- ============================================================
-- 001 — Tables principales
-- À exécuter dans : Supabase Dashboard > SQL Editor
-- ============================================================

-- Extension UUID (activée par défaut sur Supabase)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ------------------------------------------------------------
-- PROFILES — extension de auth.users
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name   TEXT,
  avatar_url  TEXT,
  role        TEXT NOT NULL CHECK (role IN ('brand', 'host')),
  brand_name  TEXT,
  website     TEXT,
  bio         TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Crée automatiquement un profil à chaque inscription
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data ->> 'full_name',
    COALESCE(NEW.raw_user_meta_data ->> 'role', 'brand')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ------------------------------------------------------------
-- SPACES — espaces physiques
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS spaces (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  host_id      UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title        TEXT NOT NULL,
  type         TEXT NOT NULL CHECK (type IN ('showroom', 'popup', 'corner', 'gallery', 'boutique')),
  city         TEXT NOT NULL,
  district     TEXT,
  address      TEXT,
  area_sqm     INTEGER,
  price_day    DECIMAL(10,2),
  description  TEXT,
  is_available BOOLEAN NOT NULL DEFAULT TRUE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------
-- SPACE_PHOTOS — photos des espaces
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS space_photos (
  id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  space_id  UUID NOT NULL REFERENCES spaces(id) ON DELETE CASCADE,
  url       TEXT NOT NULL,
  is_cover  BOOLEAN NOT NULL DEFAULT FALSE,
  order_idx INTEGER NOT NULL DEFAULT 0
);

-- ------------------------------------------------------------
-- BOOKINGS — réservations
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS bookings (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  space_id    UUID NOT NULL REFERENCES spaces(id),
  brand_id    UUID NOT NULL REFERENCES profiles(id),
  start_date  DATE NOT NULL,
  end_date    DATE NOT NULL,
  status      TEXT NOT NULL CHECK (status IN ('pending', 'confirmed', 'cancelled')) DEFAULT 'pending',
  total_price DECIMAL(10,2),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT bookings_dates_check CHECK (end_date >= start_date)
);
