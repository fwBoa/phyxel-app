-- 1. Colonne avatar_url sur la table profiles
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- 2. Bucket de stockage pour les avatars
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'avatars',
  'avatars',
  true,
  2097152, -- 2 Mo max par fichier
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- 3. Policies RLS sur le bucket avatars

-- Lecture publique (les avatars sont visibles par tous)
CREATE POLICY "Avatars publics en lecture"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'avatars');

-- Upload : uniquement son propre dossier (avatars/<user_id>/*)
CREATE POLICY "Upload avatar par le propriétaire"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'avatars'
    AND (storage.foldername(name))[1] = (SELECT auth.uid()::text)
  );

-- Mise à jour : uniquement son propre dossier
CREATE POLICY "Mise à jour avatar par le propriétaire"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'avatars'
    AND (storage.foldername(name))[1] = (SELECT auth.uid()::text)
  )
  WITH CHECK (
    bucket_id = 'avatars'
    AND (storage.foldername(name))[1] = (SELECT auth.uid()::text)
  );

-- Suppression : uniquement son propre dossier
CREATE POLICY "Suppression avatar par le propriétaire"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'avatars'
    AND (storage.foldername(name))[1] = (SELECT auth.uid()::text)
  );
