-- ============================================================
-- 006 — Table favorites
-- À exécuter dans : Supabase Dashboard > SQL Editor
-- ============================================================

-- ------------------------------------------------------------
-- TABLE
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS favorites (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  space_id   UUID NOT NULL REFERENCES spaces(id)   ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT favorites_unique UNIQUE (user_id, space_id)
);

-- ------------------------------------------------------------
-- RLS
-- ------------------------------------------------------------
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- Un utilisateur ne voit que ses propres favoris
CREATE POLICY "favorites_select_own"
  ON favorites FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

-- Un utilisateur ne peut ajouter que ses propres favoris
CREATE POLICY "favorites_insert_own"
  ON favorites FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

-- Un utilisateur ne peut supprimer que ses propres favoris
CREATE POLICY "favorites_delete_own"
  ON favorites FOR DELETE
  TO authenticated
  USING ((select auth.uid()) = user_id);

-- ------------------------------------------------------------
-- GRANTS
-- ------------------------------------------------------------
GRANT SELECT, INSERT, DELETE ON TABLE public.favorites TO authenticated;
