-- ============================================================
-- 002 — Row Level Security
-- À exécuter après 001_tables.sql
-- ============================================================

-- ------------------------------------------------------------
-- PROFILES
-- ------------------------------------------------------------
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Lecture publique (espaces, profils hosts visibles sans connexion)
CREATE POLICY "profiles_select_public"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "profiles_insert_own"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = id);

CREATE POLICY "profiles_update_own"
  ON profiles FOR UPDATE
  TO authenticated
  USING  ((select auth.uid()) = id)
  WITH CHECK ((select auth.uid()) = id);

-- ------------------------------------------------------------
-- SPACES
-- ------------------------------------------------------------
ALTER TABLE spaces ENABLE ROW LEVEL SECURITY;

CREATE POLICY "spaces_select_public"
  ON spaces FOR SELECT
  USING (true);

CREATE POLICY "spaces_insert_host"
  ON spaces FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = host_id);

CREATE POLICY "spaces_update_host"
  ON spaces FOR UPDATE
  TO authenticated
  USING  ((select auth.uid()) = host_id)
  WITH CHECK ((select auth.uid()) = host_id);

CREATE POLICY "spaces_delete_host"
  ON spaces FOR DELETE
  TO authenticated
  USING ((select auth.uid()) = host_id);

-- ------------------------------------------------------------
-- SPACE_PHOTOS
-- ------------------------------------------------------------
ALTER TABLE space_photos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "space_photos_select_public"
  ON space_photos FOR SELECT
  USING (true);

CREATE POLICY "space_photos_insert_host"
  ON space_photos FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM spaces
      WHERE spaces.id = space_photos.space_id
        AND spaces.host_id = (select auth.uid())
    )
  );

CREATE POLICY "space_photos_delete_host"
  ON space_photos FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM spaces
      WHERE spaces.id = space_photos.space_id
        AND spaces.host_id = (select auth.uid())
    )
  );

-- ------------------------------------------------------------
-- BOOKINGS
-- ------------------------------------------------------------
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "bookings_select_own"
  ON bookings FOR SELECT
  TO authenticated
  USING (
    (select auth.uid()) = brand_id
    OR EXISTS (
      SELECT 1 FROM spaces
      WHERE spaces.id = bookings.space_id
        AND spaces.host_id = (select auth.uid())
    )
  );

CREATE POLICY "bookings_insert_brand"
  ON bookings FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = brand_id);

CREATE POLICY "bookings_update_status"
  ON bookings FOR UPDATE
  TO authenticated
  USING (
    (select auth.uid()) = brand_id
    OR EXISTS (
      SELECT 1 FROM spaces
      WHERE spaces.id = bookings.space_id
        AND spaces.host_id = (select auth.uid())
    )
  )
  WITH CHECK (
    (select auth.uid()) = brand_id
    OR EXISTS (
      SELECT 1 FROM spaces
      WHERE spaces.id = bookings.space_id
        AND spaces.host_id = (select auth.uid())
    )
  );
