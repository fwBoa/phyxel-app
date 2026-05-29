-- ============================================================
-- 004 — Grants explicites pour l'API Data (REST)
-- Requis depuis avril 2026 : les tables ne sont plus exposées
-- automatiquement via l'API Data.
-- À exécuter après 003_storage.sql
-- ============================================================

-- anon : lecture seule sur les tables publiques
GRANT SELECT ON TABLE public.profiles     TO anon;
GRANT SELECT ON TABLE public.spaces       TO anon;
GRANT SELECT ON TABLE public.space_photos TO anon;

-- authenticated : accès complet (les RLS filtrent ensuite)
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.profiles     TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.spaces       TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.space_photos TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.bookings     TO authenticated;
