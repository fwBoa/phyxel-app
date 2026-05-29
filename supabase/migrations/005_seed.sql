-- ============================================================
-- 005 — Données de test (seed)
-- À exécuter en dernier, après 004_grants.sql
-- ============================================================

-- ------------------------------------------------------------
-- 1. Création de 2 utilisateurs de test dans auth.users
--    (le trigger handle_new_user créera automatiquement les profils)
-- ------------------------------------------------------------
INSERT INTO auth.users (
  id, instance_id, email, encrypted_password, email_confirmed_at,
  raw_user_meta_data, created_at, updated_at,
  aud, role, confirmation_token, recovery_token,
  email_change_token_new, email_change
)
VALUES
  (
    'aaaaaaaa-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000000',
    'host@phyxel.test',
    crypt('password123', gen_salt('bf')),
    NOW(),
    '{"full_name": "Sophie Martin", "role": "host"}'::jsonb,
    NOW(), NOW(),
    'authenticated', 'authenticated', '', '', '', ''
  ),
  (
    'aaaaaaaa-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000000',
    'brand@phyxel.test',
    crypt('password123', gen_salt('bf')),
    NOW(),
    '{"full_name": "Lucas Dubois", "role": "brand"}'::jsonb,
    NOW(), NOW(),
    'authenticated', 'authenticated', '', '', '', ''
  )
ON CONFLICT (id) DO NOTHING;

-- Mise à jour des profils créés par le trigger
UPDATE public.profiles SET
  brand_name = NULL,
  bio = 'Propriétaire de plusieurs espaces premium à Paris. Spécialisée dans les pop-ups de mode et lifestyle.',
  website = 'https://sophie-spaces.fr'
WHERE id = 'aaaaaaaa-0000-0000-0000-000000000001';

UPDATE public.profiles SET
  brand_name = 'Maison Dubois',
  bio = 'Marque de prêt-à-porter éco-responsable. Cherche des espaces authentiques pour nos pop-ups saisonniers.',
  website = 'https://maisondubois.com'
WHERE id = 'aaaaaaaa-0000-0000-0000-000000000002';

-- ------------------------------------------------------------
-- 2. Espaces physiques
-- ------------------------------------------------------------
INSERT INTO public.spaces (id, host_id, title, type, city, district, address, area_sqm, price_day, description, is_available)
VALUES
  (
    'bbbbbbbb-0000-0000-0000-000000000001',
    'aaaaaaaa-0000-0000-0000-000000000001',
    'Showroom Marais — Lumière naturelle',
    'showroom',
    'Paris', '3ème arrondissement',
    '12 rue de Bretagne, 75003 Paris',
    85, 450.00,
    'Magnifique showroom en rez-de-chaussée avec verrière, sol en béton ciré et murs blancs. Idéal pour présentation de collections mode, déco ou lifestyle. Accès PMR, vitrine sur rue, cave de stockage incluse.',
    true
  ),
  (
    'bbbbbbbb-0000-0000-0000-000000000002',
    'aaaaaaaa-0000-0000-0000-000000000001',
    'Pop-up Saint-Germain — Haussmannien',
    'popup',
    'Paris', '6ème arrondissement',
    '34 rue du Four, 75006 Paris',
    60, 380.00,
    'Appartement haussmannien entièrement rénové, parquet ancien et moulures. Espace intimiste parfait pour une marque premium cherchant un cadre élégant. Cuisine équipée et bureau disponibles.',
    true
  ),
  (
    'bbbbbbbb-0000-0000-0000-000000000003',
    'aaaaaaaa-0000-0000-0000-000000000001',
    'Corner Galeries Lafayette — Flux maximal',
    'corner',
    'Paris', '9ème arrondissement',
    '40 boulevard Haussmann, 75009 Paris',
    20, 890.00,
    'Corner au sein d''un grand magasin parisien à fort trafic. Emplacement stratégique au rayon accessoires, idéal pour test marché ou lancement de produit. Comptoir et présentoirs inclus.',
    true
  ),
  (
    'bbbbbbbb-0000-0000-0000-000000000004',
    'aaaaaaaa-0000-0000-0000-000000000001',
    'Galerie Oberkampf — Espace brut',
    'gallery',
    'Paris', '11ème arrondissement',
    '67 rue Oberkampf, 75011 Paris',
    120, 320.00,
    'Ancienne imprimerie reconvertie en galerie. Hauteur sous plafond de 5m, rails d''accrochage, sol béton. Ambiance industrielle très appréciée des marques créatives et artistiques.',
    true
  ),
  (
    'bbbbbbbb-0000-0000-0000-000000000005',
    'aaaaaaaa-0000-0000-0000-000000000001',
    'Boutique éphémère Lyon Confluence',
    'boutique',
    'Lyon', 'Confluence',
    '2 place Nautique, 69002 Lyon',
    45, 220.00,
    'Boutique clé en main dans le quartier tendance de la Confluence. Vitrine double, mobilier modulable fourni, système d''éclairage professionnel. Environnement commercial dynamique.',
    true
  ),
  (
    'bbbbbbbb-0000-0000-0000-000000000006',
    'aaaaaaaa-0000-0000-0000-000000000001',
    'Showroom Bastille — Vue sur cour',
    'showroom',
    'Paris', '12ème arrondissement',
    '8 rue de la Roquette, 75011 Paris',
    70, 350.00,
    'Showroom avec accès cour privée, parfait pour événements en intérieur/extérieur. Double exposition, parking à proximité. Très prisé pour les marques souhaitant un espace exclusif.',
    false
  )
ON CONFLICT (id) DO NOTHING;

-- ------------------------------------------------------------
-- 3. Photos (URLs Unsplash libres de droits)
-- ------------------------------------------------------------
INSERT INTO public.space_photos (space_id, url, is_cover, order_idx)
VALUES
  -- Showroom Marais
  ('bbbbbbbb-0000-0000-0000-000000000001', 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800', true,  0),
  ('bbbbbbbb-0000-0000-0000-000000000001', 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800', false, 1),
  ('bbbbbbbb-0000-0000-0000-000000000001', 'https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=800', false, 2),

  -- Pop-up Saint-Germain
  ('bbbbbbbb-0000-0000-0000-000000000002', 'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=800', true,  0),
  ('bbbbbbbb-0000-0000-0000-000000000002', 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800', false, 1),

  -- Corner Galeries Lafayette
  ('bbbbbbbb-0000-0000-0000-000000000003', 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800', true,  0),
  ('bbbbbbbb-0000-0000-0000-000000000003', 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=800', false, 1),

  -- Galerie Oberkampf
  ('bbbbbbbb-0000-0000-0000-000000000004', 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800', true,  0),
  ('bbbbbbbb-0000-0000-0000-000000000004', 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800', false, 1),

  -- Boutique Lyon
  ('bbbbbbbb-0000-0000-0000-000000000005', 'https://images.unsplash.com/photo-1604014237800-1c9102c219da?w=800', true,  0),
  ('bbbbbbbb-0000-0000-0000-000000000005', 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=800', false, 1),

  -- Showroom Bastille
  ('bbbbbbbb-0000-0000-0000-000000000006', 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800', true,  0)

ON CONFLICT DO NOTHING;

-- ------------------------------------------------------------
-- 4. Réservation de test
-- ------------------------------------------------------------
INSERT INTO public.bookings (space_id, brand_id, start_date, end_date, status, total_price)
VALUES
  (
    'bbbbbbbb-0000-0000-0000-000000000001',
    'aaaaaaaa-0000-0000-0000-000000000002',
    '2026-06-10', '2026-06-14',
    'confirmed',
    1800.00
  ),
  (
    'bbbbbbbb-0000-0000-0000-000000000002',
    'aaaaaaaa-0000-0000-0000-000000000002',
    '2026-07-01', '2026-07-03',
    'pending',
    760.00
  )
ON CONFLICT DO NOTHING;
