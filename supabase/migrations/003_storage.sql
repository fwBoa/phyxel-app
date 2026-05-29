-- ============================================================
-- 003 — Storage buckets + policies
-- À exécuter après 002_rls.sql
-- ============================================================

-- Bucket photos des espaces (public)
INSERT INTO storage.buckets (id, name, public)
VALUES ('space-photos', 'space-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Bucket avatars utilisateurs (public)
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- ------------------------------------------------------------
-- Nettoyage des anciennes policies si elles existent
-- ------------------------------------------------------------
DROP POLICY IF EXISTS "space_photos_public_read"  ON storage.objects;
DROP POLICY IF EXISTS "space_photos_host_upload"  ON storage.objects;
DROP POLICY IF EXISTS "space_photos_host_update"  ON storage.objects;
DROP POLICY IF EXISTS "space_photos_host_delete"  ON storage.objects;
DROP POLICY IF EXISTS "avatars_public_read"        ON storage.objects;
DROP POLICY IF EXISTS "avatars_owner_upload"       ON storage.objects;
DROP POLICY IF EXISTS "avatars_owner_update"       ON storage.objects;

-- ------------------------------------------------------------
-- Policies storage — space-photos
-- ------------------------------------------------------------
CREATE POLICY "space_photos_public_read"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'space-photos');

CREATE POLICY "space_photos_host_upload"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'space-photos');

CREATE POLICY "space_photos_host_update"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING  (bucket_id = 'space-photos' AND (select auth.uid())::text = (storage.foldername(name))[1])
  WITH CHECK (bucket_id = 'space-photos' AND (select auth.uid())::text = (storage.foldername(name))[1]);

CREATE POLICY "space_photos_host_delete"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'space-photos'
    AND (select auth.uid())::text = (storage.foldername(name))[1]
  );

-- ------------------------------------------------------------
-- Policies storage — avatars
-- ------------------------------------------------------------
CREATE POLICY "avatars_public_read"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'avatars');

CREATE POLICY "avatars_owner_upload"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'avatars'
    AND (select auth.uid())::text = (storage.foldername(name))[1]
  );

CREATE POLICY "avatars_owner_update"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'avatars'
    AND (select auth.uid())::text = (storage.foldername(name))[1]
  )
  WITH CHECK (
    bucket_id = 'avatars'
    AND (select auth.uid())::text = (storage.foldername(name))[1]
  );
