-- ============================================================
-- Phyxel — Schéma Supabase
-- Exécuter dans l'éditeur SQL de votre projet Supabase
-- ============================================================

-- Profils utilisateurs (extension de auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name   TEXT,
  avatar_url  TEXT,
  role        TEXT CHECK (role IN ('brand', 'host')) NOT NULL,
  brand_name  TEXT,
  website     TEXT,
  bio         TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Espaces physiques
CREATE TABLE IF NOT EXISTS spaces (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  host_id      UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title        TEXT NOT NULL,
  type         TEXT CHECK (type IN ('showroom', 'popup', 'corner', 'gallery', 'boutique')),
  city         TEXT NOT NULL,
  district     TEXT,
  address      TEXT,
  area_sqm     INTEGER,
  price_day    DECIMAL(10,2),
  description  TEXT,
  is_available BOOLEAN DEFAULT TRUE,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- Photos des espaces
CREATE TABLE IF NOT EXISTS space_photos (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  space_id   UUID REFERENCES spaces(id) ON DELETE CASCADE,
  url        TEXT NOT NULL,
  is_cover   BOOLEAN DEFAULT FALSE,
  order_idx  INTEGER DEFAULT 0
);

-- Réservations
CREATE TABLE IF NOT EXISTS bookings (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  space_id    UUID REFERENCES spaces(id),
  brand_id    UUID REFERENCES profiles(id),
  start_date  DATE NOT NULL,
  end_date    DATE NOT NULL,
  status      TEXT CHECK (status IN ('pending', 'confirmed', 'cancelled')) DEFAULT 'pending',
  total_price DECIMAL(10,2),
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- Row Level Security (RLS)
-- ============================================================

ALTER TABLE profiles    ENABLE ROW LEVEL SECURITY;
ALTER TABLE spaces      ENABLE ROW LEVEL SECURITY;
ALTER TABLE space_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings    ENABLE ROW LEVEL SECURITY;

-- profiles : lecture publique, écriture par le propriétaire
CREATE POLICY "profiles_public_read"   ON profiles FOR SELECT USING (true);
CREATE POLICY "profiles_owner_write"   ON profiles FOR ALL   USING (auth.uid() = id);

-- spaces : lecture publique, écriture par le host
CREATE POLICY "spaces_public_read"     ON spaces FOR SELECT USING (true);
CREATE POLICY "spaces_host_write"      ON spaces FOR ALL    USING (auth.uid() = host_id);

-- space_photos : lecture publique, écriture par le host de l'espace
CREATE POLICY "photos_public_read"     ON space_photos FOR SELECT USING (true);
CREATE POLICY "photos_host_write"      ON space_photos FOR ALL USING (
  auth.uid() = (SELECT host_id FROM spaces WHERE id = space_id)
);

-- bookings : accès brand + host concerné
CREATE POLICY "bookings_brand_read"    ON bookings FOR SELECT USING (auth.uid() = brand_id);
CREATE POLICY "bookings_brand_write"   ON bookings FOR INSERT WITH CHECK (auth.uid() = brand_id);
CREATE POLICY "bookings_brand_update"  ON bookings FOR UPDATE USING (auth.uid() = brand_id);

-- ============================================================
-- Trigger : créer le profil automatiquement à l'inscription
-- ============================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO public.profiles (id, role)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'role', 'brand'))
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ============================================================
-- Storage Buckets
-- ============================================================
-- Créer manuellement dans Supabase Storage :
--   - Bucket "space-photos" (public)
--   - Bucket "avatars" (public)
