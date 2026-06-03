-- Refonte : table admins (auth custom) + table hosts (propriétaires d'espaces)
-- + suppression de la colonne role de profiles
-- + FK spaces.host_id -> hosts(id)
--
-- À exécuter dans le SQL Editor de Supabase.
--
-- ⚠️  AVANT D'EXÉCUTER :
--   1. Remplace ADMIN_EMAIL_PLACEHOLDER et ADMIN_PASSWORD_HASH_PLACEHOLDER
--      dans la section 4 (Seed superadmin) par ton email et un hash bcrypt.
--      Pour générer un hash bcrypt, lance dans un terminal :
--        node -e "console.log(require('bcryptjs').hashSync('TON_MOT_DE_PASSE', 12))"
--   2. Si tu as déjà des espaces en base, fais :
--        TRUNCATE spaces CASCADE;
--      avant d'exécuter cette migration (les host_id ne pointeront plus vers auth.users).
--   3. Génère un JWT secret et mets-le dans .env.local :
--        node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
--      → ADMIN_JWT_SECRET

-- =============================================================
-- 1. PROFILES — supprime la colonne role (n'est plus utilisée)
-- =============================================================
ALTER TABLE profiles DROP COLUMN IF EXISTS role;

-- =============================================================
-- 2. TABLE admins — auth custom (bcrypt + JWT côté serveur)
-- =============================================================
CREATE TABLE IF NOT EXISTS admins (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email         TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  full_name     TEXT,
  is_active     BOOLEAN NOT NULL DEFAULT TRUE,
  last_login_at TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_admins_email ON admins (lower(email));

-- RLS activé sans aucune policy = deny-all par défaut.
-- Toutes les opérations sur admins passent par le serveur Next.js (cookie admin_session).
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- Trigger updated_at (la fonction update_updated_at_column() est créée par 007_onboarding.sql)
DROP TRIGGER IF EXISTS update_admins_updated_at ON admins;
CREATE TRIGGER update_admins_updated_at
  BEFORE UPDATE ON admins
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =============================================================
-- 3. TABLE hosts — propriétaires d'espaces (pas de compte app, gérés par l'admin)
-- =============================================================
CREATE TABLE IF NOT EXISTS hosts (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email        TEXT NOT NULL UNIQUE,
  full_name    TEXT,
  company_name TEXT,
  phone        TEXT,
  is_active    BOOLEAN NOT NULL DEFAULT TRUE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_hosts_email ON hosts (lower(email));

-- RLS activé sans aucune policy = deny-all par défaut.
-- Lecture/écriture via le serveur Next.js (le client Supabase navigateur ne peut rien faire).
ALTER TABLE hosts ENABLE ROW LEVEL SECURITY;

DROP TRIGGER IF EXISTS update_hosts_updated_at ON hosts;
CREATE TRIGGER update_hosts_updated_at
  BEFORE UPDATE ON hosts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =============================================================
-- 4. SPACES — ajoute FK spaces.host_id -> hosts(id) si manquante
-- =============================================================
-- Supprime l'éventuelle FK vers auth.users (créée par défaut dans certaines installs)
ALTER TABLE spaces DROP CONSTRAINT IF EXISTS spaces_host_id_fkey;

-- Ajoute la FK vers hosts(id) (RESTRICT pour éviter la suppression accidentelle d'un host
-- qui possède encore des espaces)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'spaces_host_id_hosts_fkey'
      AND table_name = 'spaces'
  ) THEN
    ALTER TABLE spaces
      ADD CONSTRAINT spaces_host_id_hosts_fkey
      FOREIGN KEY (host_id) REFERENCES hosts(id) ON DELETE RESTRICT;
  END IF;
END $$;

-- =============================================================
-- 5. SEED SUPERADMIN UNIQUE
-- =============================================================
-- ⚠️  REMPLACE LES 2 PLACEHOLDERS CI-DESSOUS AVANT D'EXÉCUTER :
--     - 'admin@phyxel.local'            → ton email
--     - 'ADMIN_PASSWORD_HASH_PLACEHOLDER' → hash bcrypt de ton mot de passe
--       (génère-le avec : node -e "console.log(require('bcryptjs').hashSync('TON_MOT_DE_PASSE', 12))")
INSERT INTO admins (email, password_hash, full_name, is_active)
VALUES (
  'jeandavidzamblezie@outlook.fr',
  'bcrypt hash',
  'Admin Phyxel',
  TRUE
)
ON CONFLICT (email) DO NOTHING;
