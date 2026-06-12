-- Seed: 12 espaces de démo + 2 hosts (Sophie Martin, Lucas Dubois)
-- À exécuter dans le SQL Editor de Supabase, APRÈS 009_admins_and_hosts.sql
--
-- ⚠️  PRÉREQUIS : 009 doit déjà être exécutée (sinon la table hosts n'existe pas
--     et la FK spaces.host_id -> hosts(id) n'est pas en place).

-- =============================================================
-- 1. HOSTS
-- =============================================================
INSERT INTO hosts (id, email, full_name, company_name, is_active) VALUES
  ('bbbbbbbb-0000-0000-0000-000000000001', 'sophie@phyxel.demo', 'Sophie Martin',  'Atelier Marais',         TRUE),
  ('bbbbbbbb-0000-0000-0000-000000000002', 'lucas@phyxel.demo',  'Lucas Dubois',   'Galerie Lumière',        TRUE)
ON CONFLICT (id) DO NOTHING;

-- =============================================================
-- 2. ESPACES (12)
-- =============================================================
-- Couvre la diversité des préférences du wizard d'onboarding :
--   - 5 types (showroom, popup, corner, gallery, boutique)
--   - 6 villes (Paris, Lyon, Marseille, Bordeaux, Lille, Nantes)
--   - 10+ quartiers
--   - 4 tranches de budget (< 500, 500-1000, 1000-2500, 2500+ €/jour)
--   - 5 tranches de surface (15 à 110 m²)

INSERT INTO spaces (id, host_id, title, type, city, district, address, area_sqm, price_day, description, is_available, created_at) VALUES
  -- ===== Sophie Martin (6 espaces) =====

  -- Paris — Marais
  ('11111111-0000-0000-0000-000000000001', 'bbbbbbbb-0000-0000-0000-000000000001',
   'Showroom industriel Marais', 'showroom', 'Paris', 'Marais',
   '12 rue de Bretagne', 85, 850,
   'Ancien atelier transformé en showroom. Murs de briques apparentes, hauteur sous plafond 4m, lumière zénithale. Idéal mode et lifestyle.', true, now()),

  -- Paris — Saint-Germain
  ('11111111-0000-0000-0000-000000000002', 'bbbbbbbb-0000-0000-0000-000000000001',
   'Boutique éphémère Saint-Germain', 'boutique', 'Paris', 'Saint-Germain',
   '18 rue Bonaparte', 45, 1200,
   'Vitrine Beaux-Arts, parquet chêne, comptoir vintage. Trafic piéton premium, parfait pour lancement de collection capsule.', true, now()),

  -- Paris — Opéra
  ('11111111-0000-0000-0000-000000000005', 'bbbbbbbb-0000-0000-0000-000000000001',
   'Corner Opéra', 'corner', 'Paris', 'Opéra / Grands Boulevards',
   '5 boulevard des Capucines', 15, 320,
   'Petit format corner dans un concept store premium. Comptoir vitrine, back-office partagé.', true, now()),

  -- Lyon — Presqu''île
  ('11111111-0000-0000-0000-000000000006', 'bbbbbbbb-0000-0000-0000-000000000001',
   'Boutique Presqu''île', 'boutique', 'Lyon', 'Presqu''île',
   '22 rue de la République', 60, 680,
   'Vitrine large sur artère commerçante principale. RDC, belle hauteur, réserve à l''arrière.', true, now()),

  -- Bordeaux — Chartrons
  ('11111111-0000-0000-0000-000000000010', 'bbbbbbbb-0000-0000-0000-000000000001',
   'Boutique Chartrons', 'boutique', 'Bordeaux', 'Chartrons',
   '40 rue Notre-Dame', 70, 750,
   'Quartier des antiquaires. Belle devanture en bois, ambiance chic et chaleureuse.', true, now()),

  -- Lille — Vieux-Lille
  ('11111111-0000-0000-0000-000000000011', 'bbbbbbbb-0000-0000-0000-000000000001',
   'Pop-up Vieux-Lille', 'popup', 'Lille', 'Vieux-Lille',
   '8 rue de la Monnaie', 40, 420,
   'Plein cœur piéton. Sol tomette, plafond poutres apparentes. Idéal cosmétique et food.', true, now()),

  -- ===== Lucas Dubois (6 espaces) =====

  -- Paris — Canal Saint-Martin
  ('11111111-0000-0000-0000-000000000003', 'bbbbbbbb-0000-0000-0000-000000000002',
   'Pop-up arty Canal', 'popup', 'Paris', 'Canal Saint-Martin',
   '34 rue du Faubourg du Temple', 35, 450,
   'Espace brut idéal pour pop-up mode ou tech. Murs blancs modulables, sol béton ciré, accès PMR.', true, now()),

  -- Paris — Bastille
  ('11111111-0000-0000-0000-000000000004', 'bbbbbbbb-0000-0000-0000-000000000002',
   'Galerie d''art Bastille', 'gallery', 'Paris', 'Bastille',
   '8 rue de Charonne', 110, 1800,
   'Galerie contemporaine avec éclairage muséal. Idéale pour expositions, lancements artistiques, showrooms premium.', true, now()),

  -- Lyon — Confluence
  ('11111111-0000-0000-0000-000000000007', 'bbbbbbbb-0000-0000-0000-000000000002',
   'Pop-up Confluence', 'popup', 'Lyon', 'Confluence',
   '70 cours Charlemagne', 80, 950,
   'Espace modulable dans le centre commercial. Fort trafic, public urbain 25-40 ans.', true, now()),

  -- Marseille — Vieux-Port
  ('11111111-0000-0000-0000-000000000008', 'bbbbbbbb-0000-0000-0000-000000000002',
   'Showroom Vieux-Port', 'showroom', 'Marseille', 'Vieux-Port',
   '3 quai du Port', 95, 1100,
   'Vue mer, loft contemporain. Idéal pour beachwear, cosmétique, art de vivre méditerranéen.', true, now()),

  -- Marseille — Cours Julien
  ('11111111-0000-0000-0000-000000000009', 'bbbbbbbb-0000-0000-0000-000000000002',
   'Galerie Cours Julien', 'gallery', 'Marseille', 'Cours Julien',
   '15 rue d''Aix', 50, 580,
   'Quartier artistique, mur d''escalade intérieur disponible. Lumière naturelle exceptionnelle.', true, now()),

  -- Nantes — Bouffay
  ('11111111-0000-0000-0000-000000000012', 'bbbbbbbb-0000-0000-0000-000000000002',
   'Corner Bouffay', 'corner', 'Nantes', 'Bouffay',
   '12 rue des Halles', 20, 280,
   'Format compact, vitrine sur rue passante. Idéal marque en test, petit budget.', true, now())
ON CONFLICT (id) DO NOTHING;

-- =============================================================
-- 3. PHOTOS (URLs Unsplash libres de droits, hotlink autorisées)
-- =============================================================
INSERT INTO space_photos (space_id, url, is_cover, order_idx) VALUES
  -- Showroom industriel Marais
  ('11111111-0000-0000-0000-000000000001', 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200', true, 0),
  ('11111111-0000-0000-0000-000000000001', 'https://images.unsplash.com/photo-1604328698692-f76ea9498e76?w=1200', false, 1),
  ('11111111-0000-0000-0000-000000000001', 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1200', false, 2),

  -- Boutique Saint-Germain
  ('11111111-0000-0000-0000-000000000002', 'https://images.unsplash.com/photo-1481437156560-3205f6a55735?w=1200', true, 0),
  ('11111111-0000-0000-0000-000000000002', 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=1200', false, 1),

  -- Pop-up Canal Saint-Martin
  ('11111111-0000-0000-0000-000000000003', 'https://images.unsplash.com/photo-1604014237800-1c9102c219da?w=1200', true, 0),
  ('11111111-0000-0000-0000-000000000003', 'https://images.unsplash.com/photo-1582539181751-b041d380c4a4?w=1200', false, 1),

  -- Galerie Bastille
  ('11111111-0000-0000-0000-000000000004', 'https://images.unsplash.com/photo-1531058020387-3be344556be6?w=1200', true, 0),
  ('11111111-0000-0000-0000-000000000004', 'https://images.unsplash.com/photo-1554907984-15263bfd63bd?w=1200', false, 1),
  ('11111111-0000-0000-0000-000000000004', 'https://images.unsplash.com/photo-1545987796-200677ee1662?w=1200', false, 2),

  -- Corner Opéra
  ('11111111-0000-0000-0000-000000000005', 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=1200', true, 0),

  -- Boutique Lyon Presqu'île
  ('11111111-0000-0000-0000-000000000006', 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=1200', true, 0),
  ('11111111-0000-0000-0000-000000000006', 'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=1200', false, 1),

  -- Pop-up Confluence
  ('11111111-0000-0000-0000-000000000007', 'https://images.unsplash.com/photo-1582719188393-bb71ca45dbb9?w=1200', true, 0),
  ('11111111-0000-0000-0000-000000000007', 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=1200', false, 1),

  -- Showroom Vieux-Port
  ('11111111-0000-0000-0000-000000000008', 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=1200', true, 0),
  ('11111111-0000-0000-0000-000000000008', 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=1200', false, 1),

  -- Galerie Cours Julien
  ('11111111-0000-0000-0000-000000000009', 'https://images.unsplash.com/photo-1577720580479-7d839d829c73?w=1200', true, 0),
  ('11111111-0000-0000-0000-000000000009', 'https://images.unsplash.com/photo-1577083552431-6e5fd75a9160?w=1200', false, 1),

  -- Boutique Chartrons
  ('11111111-0000-0000-0000-000000000010', 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=1200', true, 0),
  ('11111111-0000-0000-0000-000000000010', 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=1200', false, 1),

  -- Pop-up Vieux-Lille
  ('11111111-0000-0000-0000-000000000011', 'https://images.unsplash.com/photo-1582539181751-b041d380c4a4?w=1200', true, 0),

  -- Corner Bouffay
  ('11111111-0000-0000-0000-000000000012', 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1200', true, 0)
ON CONFLICT DO NOTHING;
