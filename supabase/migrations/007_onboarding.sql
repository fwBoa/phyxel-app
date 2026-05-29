-- Onboarding wizard: brand_preferences table + has_completed_onboarding flag

-- 1. Ajoute le flag d'onboarding sur profiles
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS has_completed_onboarding BOOLEAN NOT NULL DEFAULT FALSE;

-- 2. Crée la table brand_preferences
CREATE TABLE IF NOT EXISTS brand_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,

  -- Step 1: Infos marque
  sector           TEXT,
  product_types    TEXT[],
  main_city        TEXT,
  company_size     TEXT,
  approx_budget    TEXT,

  -- Step 2: Objectifs physiques
  physical_objectives JSONB DEFAULT '[]'::jsonb,

  -- Step 3: Besoins du lieu
  target_city       TEXT,
  desired_duration  TEXT,
  space_types       JSONB DEFAULT '[]'::jsonb,
  desired_area      TEXT,
  needed_services   JSONB DEFAULT '[]'::jsonb,

  -- Step 4: Préférences
  max_budget         TEXT,
  preferred_districts JSONB DEFAULT '[]'::jsonb,
  desired_ambiance   JSONB DEFAULT '[]'::jsonb,
  ideal_dates        TEXT,

  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT unique_profile_prefs UNIQUE (profile_id)
);

-- Index sur profile_id pour les requêtes rapides
CREATE INDEX IF NOT EXISTS idx_brand_prefs_profile_id ON brand_preferences(profile_id);

-- 3. RLS: active RLS sur la table
ALTER TABLE brand_preferences ENABLE ROW LEVEL SECURITY;

-- Politique: un utilisateur authentifié ne voit que ses propres préférences
CREATE POLICY brand_prefs_select_own ON brand_preferences
  FOR SELECT USING (auth.uid() = profile_id);

CREATE POLICY brand_prefs_insert_own ON brand_preferences
  FOR INSERT WITH CHECK (auth.uid() = profile_id);

CREATE POLICY brand_prefs_update_own ON brand_preferences
  FOR UPDATE USING (auth.uid() = profile_id);

-- 4. Trigger pour mettre à jour updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_brand_preferences_updated_at
  BEFORE UPDATE ON brand_preferences
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
