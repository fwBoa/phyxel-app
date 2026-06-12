-- Seed étendu : +40 espaces supplémentaires pour tester le matching
-- À exécuter dans le SQL Editor de Supabase
-- Couvre 10 villes, 5 types, 15+ quartiers, 5 tranches de budget

-- =============================================================
-- 1. NOUVEAUX HOSTS
-- =============================================================
INSERT INTO hosts (id, email, full_name, company_name, is_active) VALUES
  ('bbbbbbbb-0000-0000-0000-000000000003', 'marie@phyxel.demo', 'Marie Lefebvre',  'Espaces Urbains',        TRUE),
  ('bbbbbbbb-0000-0000-0000-000000000004', 'pierre@phyxel.demo', 'Pierre Moreau',   'Pop-Up Factory',         TRUE),
  ('bbbbbbbb-0000-0000-0000-000000000005', 'camille@phyxel.demo', 'Camille Bernard', 'Galerie Moderne',        TRUE)
ON CONFLICT (id) DO NOTHING;

-- =============================================================
-- 2. NOUVEAUX ESPACES (+40)
-- =============================================================
INSERT INTO spaces (id, host_id, title, type, city, district, address, area_sqm, price_day, description, is_available, created_at) VALUES

  -- ===== PARIS (15 nouveaux) =====
  
  -- Marais
  ('22222222-0000-0000-0000-000000000001', 'bbbbbbbb-0000-0000-0000-000000000003',
   'Pop-up design Marais', 'popup', 'Paris', 'Marais',
   '25 rue des Francs-Bourgeois', 30, 380,
   'Espace design au cœur du Marais. Parquet haussmannien, moulures, grande hauteur sous plafond.', true, now()),

  ('22222222-0000-0000-0000-000000000002', 'bbbbbbbb-0000-0000-0000-000000000004',
   'Corner mode rue de Rivoli', 'corner', 'Paris', 'Marais',
   '112 rue de Rivoli', 12, 250,
   'Format corner dans galerie commerciale. Trafic touristique intense.', true, now()),

  -- Saint-Germain
  ('22222222-0000-0000-0000-000000000003', 'bbbbbbbb-0000-0000-0000-000000000003',
   'Showroom luxe Saint-Germain', 'showroom', 'Paris', 'Saint-Germain',
   '45 rue de Buci', 120, 2200,
   'Showroom haut de gamme. Marbre, laiton, éclairage scénographié. Idéal marques premium.', true, now()),

  ('22222222-0000-0000-0000-000000000004', 'bbbbbbbb-0000-0000-0000-000000000005',
   'Boutique concept Saint-Germain', 'boutique', 'Paris', 'Saint-Germain',
   '8 rue de l''Odéon', 55, 950,
   'Boutique littéraire reconvertie. Ambiance intellectuelle chic, clientèle CSP+.', true, now()),

  -- Opéra
  ('22222222-0000-0000-0000-000000000005', 'bbbbbbbb-0000-0000-0000-000000000004',
   'Showroom haussmannien Opéra', 'showroom', 'Paris', 'Opéra / Grands Boulevards',
   '15 rue de la Paix', 200, 3500,
   'Prestigieux showroom haussmannien. Boiseries, miroirs, lustres. Adresse mythique.', true, now()),

  ('22222222-0000-0000-0000-000000000006', 'bbbbbbbb-0000-0000-0000-000000000003',
   'Pop-up digital Opéra', 'popup', 'Paris', 'Opéra / Grands Boulevards',
   '28 boulevard Haussmann', 45, 680,
   'Espace tech-friendly. Écrans LED intégrés, réalité augmentée possible.', true, now()),

  -- Bastille
  ('22222222-0000-0000-0000-000000000007', 'bbbbbbbb-0000-0000-0000-000000000005',
   'Galerie loft Bastille', 'gallery', 'Paris', 'Bastille',
   '22 rue de Charonne', 80, 720,
   'Loft industriel avec verrière. Sol béton, murs briques. Ambiance créative.', true, now()),

  ('22222222-0000-0000-0000-000000000008', 'bbbbbbbb-0000-0000-0000-000000000004',
   'Boutique éthique Bastille', 'boutique', 'Paris', 'Bastille',
   '10 rue de Lappe', 35, 420,
   'Petite boutique rue piétonne. Clientèle locale fidèle, ambiance village.', true, now()),

  -- Canal Saint-Martin
  ('22222222-0000-0000-0000-000000000009', 'bbbbbbbb-0000-0000-0000-000000000003',
   'Showroom créatif Canal', 'showroom', 'Paris', 'Canal Saint-Martin',
   '55 quai de Jemmapes', 70, 580,
   'Vue sur le canal, espace lumineux. Clientèle bobo, créative.', true, now()),

  ('22222222-0000-0000-0000-000000000010', 'bbbbbbbb-0000-0000-0000-000000000005',
   'Corner trendy Canal', 'corner', 'Paris', 'Canal Saint-Martin',
   '18 rue Bichat', 18, 320,
   'Corner dans concept store tendance. Public jeune, urbain.', true, now()),

  -- Montmartre
  ('22222222-0000-0000-0000-000000000011', 'bbbbbbbb-0000-0000-0000-000000000004',
   'Boutique artistique Montmartre', 'boutique', 'Paris', 'Montmartre',
   '12 rue des Abbesses', 40, 480,
   'Charme montmartrois authentique. Poutres, pierres apparentes. Trafic touristique.', true, now()),

  -- Champs-Élysées
  ('22222222-0000-0000-0000-000000000012', 'bbbbbbbb-0000-0000-0000-000000000003',
   'Showroom prestige Champs-Élysées', 'showroom', 'Paris', 'Champs-Élysées',
   '78 avenue des Champs-Élysées', 150, 4500,
   'Adresse prestigieuse. Vitrine sur avenue la plus célèbre du monde.', true, now()),

  -- République
  ('22222222-0000-0000-0000-000000000013', 'bbbbbbbb-0000-0000-0000-000000000005',
   'Pop-up urbain République', 'popup', 'Paris', 'République',
   '3 boulevard Voltaire', 50, 550,
   'Carrefour stratégique, métro direct. Public diversifié, grand volume.', true, now()),

  -- Bourse / Sentier
  ('22222222-0000-0000-0000-000000000014', 'bbbbbbbb-0000-0000-0000-000000000004',
   'Corner business Bourse', 'corner', 'Paris', 'Bourse / Sentier',
   '20 rue du Sentier', 22, 380,
   'Quartier d''affaires. Clientèle déjeuner, after-work. Format test idéal.', true, now()),

  -- Nation
  ('22222222-0000-0000-0000-000000000015', 'bbbbbbbb-0000-0000-0000-000000000003',
   'Boutique familiale Nation', 'boutique', 'Paris', 'Nation',
   '45 avenue de la République', 65, 620,
   'Quartier résidentiel dynamique. Familles, jeunes couples. Bon rapport qualité/prix.', true, now()),

  -- ===== LYON (5 nouveaux) =====
  
  -- Vieux Lyon
  ('22222222-0000-0000-0000-000000000016', 'bbbbbbbb-0000-0000-0000-000000000003',
   'Showroom Renaissance Vieux Lyon', 'showroom', 'Lyon', 'Vieux Lyon',
   '5 rue du Bœuf', 90, 780,
   'Traboule lyonnaise rénovée. Pierres dorées, voûtes. Charme historique.', true, now()),

  -- Part-Dieu
  ('22222222-0000-0000-0000-000000000017', 'bbbbbbbb-0000-0000-0000-000000000004',
   'Corner commercial Part-Dieu', 'corner', 'Lyon', 'Part-Dieu',
   'Centre commercial Part-Dieu, niveau 1', 25, 450,
   'Centre commercial majeur de Lyon. Trafic garanti, public familial.', true, now()),

  -- Croix-Rousse
  ('22222222-0000-0000-0000-000000000018', 'bbbbbbbb-0000-0000-0000-000000000005',
   'Galerie atypique Croix-Rousse', 'gallery', 'Lyon', 'Croix-Rousse',
   '30 boulevard de la Croix-Rousse', 110, 650,
   'Ancien atelier de soierie. Hauteur sous plafond 5m, grande luminosité.', true, now()),

  -- Guillotière
  ('22222222-0000-0000-0000-000000000019', 'bbbbbbbb-0000-0000-0000-000000000003',
   'Pop-up multiculturel Guillotière', 'popup', 'Lyon', 'Guillotière',
   '12 rue Moncey', 40, 320,
   'Quartier cosmopolite, jeune et dynamique. Loyer abordable, forte visibilité.', true, now()),

  -- Brotteaux
  ('22222222-0000-0000-0000-000000000020', 'bbbbbbbb-0000-0000-0000-000000000004',
   'Boutique chic Brotteaux', 'boutique', 'Lyon', 'Brotteaux',
   '8 rue de la République', 55, 720,
   'Quartier bourgeois. Clientèle aisée, proximité gare.', true, now()),

  -- ===== MARSEILLE (5 nouveaux) =====
  
  -- Le Panier
  ('22222222-0000-0000-0000-000000000021', 'bbbbbbbb-0000-0000-0000-000000000005',
   'Boutique provençale Panier', 'boutique', 'Marseille', 'Le Panier',
   '25 rue du Panier', 30, 280,
   'Quartier historique pittoresque. Touristes et locaux. Ambiance authentique.', true, now()),

  -- La Joliette
  ('22222222-0000-0000-0000-000000000022', 'bbbbbbbb-0000-0000-0000-000000000003',
   'Showroom contemporain Joliette', 'showroom', 'Marseille', 'La Joliette',
   '45 rue de la République', 130, 980,
   'Quartier d''affaires en pleine mutation. Architecture moderne, public CSP+.', true, now()),

  -- Castellane
  ('22222222-0000-0000-0000-000000000023', 'bbbbbbbb-0000-0000-0000-000000000004',
   'Corner pratique Castellane', 'corner', 'Marseille', 'Castellane',
   'Centre commercial Les Terrasses du Port', 20, 380,
   'Centre commercial en bord de mer. Trafic estival important.', true, now()),

  -- Notre-Dame du Mont
  ('22222222-0000-0000-0000-000000000024', 'bbbbbbbb-0000-0000-0000-000000000005',
   'Pop-up arty Cours Julien', 'popup', 'Marseille', 'Cours Julien',
   '18 rue Crudère', 45, 420,
   'Quartier artistique branché. Street art, jeunes créateurs, ambiance festive.', true, now()),

  -- Endoume
  ('22222222-0000-0000-0000-000000000025', 'bbbbbbbb-0000-0000-0000-000000000003',
   'Galerie vue mer Endoume', 'gallery', 'Marseille', 'Endoume',
   '8 rue du Fort Notre-Dame', 75, 650,
   'Vue imprenable sur la mer. Espace lumineux, idéal pour lancement produit.', true, now()),

  -- ===== BORDEAUX (5 nouveaux) =====
  
  -- Saint-Pierre
  ('22222222-0000-0000-0000-000000000026', 'bbbbbbbb-0000-0000-0000-000000000004',
   'Boutique historique Saint-Pierre', 'boutique', 'Bordeaux', 'Saint-Pierre',
   '12 rue Saint-Rémi', 50, 580,
   'Rue piétonne historique. Pierres apparentes, cave voutée. Trafic touristique.', true, now()),

  -- Gambetta
  ('22222222-0000-0000-0000-000000000027', 'bbbbbbbb-0000-0000-0000-000000000005',
   'Showroom élégant Gambetta', 'showroom', 'Bordeaux', 'Gambetta',
   '55 cours Georges Clemenceau', 100, 850,
   'Artère commerçante principale. Belle devanture, public aisé.', true, now()),

  -- Les Chartrons
  ('22222222-0000-0000-0000-000000000028', 'bbbbbbbb-0000-0000-0000-000000000003',
   'Galerie loft Chartrons', 'gallery', 'Bordeaux', 'Chartrons',
   '22 rue Notre-Dame', 85, 720,
   'Ancien entrepôt de vin rénové. Poutres, briques, charme industriel.', true, now()),

  -- La Bastide
  ('22222222-0000-0000-0000-000000000029', 'bbbbbbbb-0000-0000-0000-000000000004',
   'Pop-up riverside Bastide', 'popup', 'Bordeaux', 'La Bastide',
   'Quai des Queyries', 60, 480,
   'Vue sur la Garonne et la Cité du Vin. Espace moderne, public jeune.', true, now()),

  -- Mériadeck
  ('22222222-0000-0000-0000-000000000030', 'bbbbbbbb-0000-0000-0000-000000000005',
   'Corner business Mériadeck', 'corner', 'Bordeaux', 'Mériadeck',
   'Centre commercial Mériadeck', 18, 350,
   'Centre commercial en centre-ville. Trafic de bureau quotidien.', true, now()),

  -- ===== LILLE (3 nouveaux) =====
  
  -- Wazemmes
  ('22222222-0000-0000-0000-000000000031', 'bbbbbbbb-0000-0000-0000-000000000003',
   'Pop-up marché Wazemmes', 'popup', 'Lille', 'Wazemmes',
   'Place de la Nouvelle Aventure', 35, 280,
   'Quartier populaire et créatif. Marché du dimanche, ambiance festive.', true, now()),

  -- Euralille
  ('22222222-0000-0000-0000-000000000032', 'bbbbbbbb-0000-0000-0000-000000000004',
   'Corner gare Euralille', 'corner', 'Lille', 'Euralille',
   'Centre commercial Euralille', 22, 420,
   'Gare Lille Europe + centre commercial. Trafic national et international.', true, now()),

  -- Bois Blancs
  ('22222222-0000-0000-0000-000000000033', 'bbbbbbbb-0000-0000-0000-000000000005',
   'Showroom design Bois Blancs', 'showroom', 'Lille', 'Bois Blancs',
   '45 rue du Molinel', 70, 550,
   'Quartier en reconversion. Espace contemporain, loyers attractifs.', true, now()),

  -- ===== NANTES (3 nouveaux) =====
  
  -- Île de Nantes
  ('22222222-0000-0000-0000-000000000034', 'bbbbbbbb-0000-0000-0000-000000000003',
   'Showroom créatif Île de Nantes', 'showroom', 'Nantes', 'Île de Nantes',
   '3 boulevard Léon Bureau', 95, 680,
   'Quartier innovant, Machines de l''île. Architecture contemporaine.', true, now()),

  -- Passage Pommeraye
  ('22222222-0000-0000-0000-000000000035', 'bbbbbbbb-0000-0000-0000-000000000004',
   'Boutique prestige Passage Pommeraye', 'boutique', 'Nantes', 'Passage Pommeraye',
   '10 rue Santeuil', 40, 520,
   'Passage couvert classé monument historique. Élégance et charme XIXe.', true, now()),

  -- Talensac
  ('22222222-0000-0000-0000-000000000036', 'bbbbbbbb-0000-0000-0000-000000000005',
   'Corner marché Talensac', 'corner', 'Nantes', 'Talensac',
   'Place du Marché', 15, 220,
   'Marché alimentaire historique. Trafic matinal, produits frais.', true, now()),

  -- ===== TOULOUSE (3 nouveaux) =====
  
  -- Capitole
  ('22222222-0000-0000-0000-000000000037', 'bbbbbbbb-0000-0000-0000-000000000003',
   'Boutique rose Capitole', 'boutique', 'Toulouse', 'Capitole',
   '15 rue d''Alsace-Lorraine', 55, 480,
   'Rue commerçante emblématique. Façades roses, ambiance toulousaine.', true, now()),

  -- Saint-Cyprien
  ('22222222-0000-0000-0000-000000000038', 'bbbbbbbb-0000-0000-0000-000000000004',
   'Showroom loft Saint-Cyprien', 'showroom', 'Toulouse', 'Saint-Cyprien',
   '28 allées de Brienne', 80, 580,
   'Quartier trendy en bord de Garonne. Lofts, bars, jeunes créatifs.', true, now()),

  -- Carmes
  ('22222222-0000-0000-0000-000000000039', 'bbbbbbbb-0000-0000-0000-000000000005',
   'Galerie historique Carmes', 'gallery', 'Toulouse', 'Carmes',
   '8 rue des Filatiers', 65, 450,
   'Rue médiévale pavée. Pierres et briques, charme authentique du vieux Toulouse.', true, now()),

  -- ===== STRASBOURG (2 nouveaux) =====
  
  -- Petite France
  ('22222222-0000-0000-0000-000000000040', 'bbbbbbbb-0000-0000-0000-000000000003',
   'Boutique alsacienne Petite France', 'boutique', 'Strasbourg', 'Petite France',
   '12 rue du Bain-aux-Plantes', 45, 520,
   'Quartier touristique le plus pittoresque. Colombages, canaux, charme alsacien.', true, now()),

  -- Krutenau
  ('22222222-0000-0000-0000-000000000041', 'bbbbbbbb-0000-0000-0000-000000000004',
   'Pop-up étudiant Krutenau', 'popup', 'Strasbourg', 'Krutenau',
   '25 rue des Veaux', 30, 280,
   'Quartier étudiant et branché. Bars, restos, ambiance jeune et internationale.', true, now()),

  -- ===== NICE (2 nouveaux) =====
  
  -- Vieux Nice
  ('22222222-0000-0000-0000-000000000042', 'bbbbbbbb-0000-0000-0000-000000000005',
   'Boutique méditerranéenne Vieux Nice', 'boutique', 'Nice', 'Vieux Nice',
   '8 rue Rossetti', 35, 650,
   'Ruelles pittoresques du vieux Nice. Trafic touristique toute l''année.', true, now()),

  -- Carré d''Or
  ('22222222-0000-0000-0000-000000000043', 'bbbbbbbb-0000-0000-0000-000000000003',
   'Showroom luxe Carré d''Or', 'showroom', 'Nice', 'Carré d''Or',
   '12 avenue de Suède', 110, 1800,
   'Quartier luxueux, proche Promenade des Anglais. Clientèle haut de gamme.', true, now()),

  -- ===== RENNES (2 nouveaux) =====
  
  -- Centre historique
  ('22222222-0000-0000-0000-000000000044', 'bbbbbbbb-0000-0000-0000-000000000004',
   'Boutique bretonne centre historique', 'boutique', 'Rennes', 'Centre historique',
   '15 rue du Chapitre', 40, 380,
   'Rue piétonne commerçante. Pierres anciennes, public jeune et dynamique.', true, now()),

  -- Saint-Grégoire
  ('22222222-0000-0000-0000-000000000045', 'bbbbbbbb-0000-0000-0000-000000000005',
   'Showroom moderne Saint-Grégoire', 'showroom', 'Rennes', 'Saint-Grégoire',
   'Zone commerciale La Visitation', 120, 720,
   'Zone commerciale périphérique. Grand parking, accessibilité, familles.', true, now())

ON CONFLICT (id) DO NOTHING;

-- =============================================================
-- 3. PHOTOS POUR LES NOUVEAUX ESPACES
-- =============================================================
INSERT INTO space_photos (space_id, url, is_cover, order_idx) VALUES
  -- Paris
  ('22222222-0000-0000-0000-000000000001', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200', true, 0),
  ('22222222-0000-0000-0000-000000000002', 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=1200', true, 0),
  ('22222222-0000-0000-0000-000000000003', 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200', true, 0),
  ('22222222-0000-0000-0000-000000000004', 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=1200', true, 0),
  ('22222222-0000-0000-0000-000000000005', 'https://images.unsplash.com/photo-1604328698692-f76ea9498e76?w=1200', true, 0),
  ('22222222-0000-0000-0000-000000000006', 'https://images.unsplash.com/photo-1604014237800-1c9102c219da?w=1200', true, 0),
  ('22222222-0000-0000-0000-000000000007', 'https://images.unsplash.com/photo-1531058020387-3be344556be6?w=1200', true, 0),
  ('22222222-0000-0000-0000-000000000008', 'https://images.unsplash.com/photo-1582539181751-b041d380c4a4?w=1200', true, 0),
  ('22222222-0000-0000-0000-000000000009', 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200', true, 0),
  ('22222222-0000-0000-0000-000000000010', 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1200', true, 0),
  ('22222222-0000-0000-0000-000000000011', 'https://images.unsplash.com/photo-1481437156560-3205f6a55735?w=1200', true, 0),
  ('22222222-0000-0000-0000-000000000012', 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200', true, 0),
  ('22222222-0000-0000-0000-000000000013', 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=1200', true, 0),
  ('22222222-0000-0000-0000-000000000014', 'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=1200', true, 0),
  ('22222222-0000-0000-0000-000000000015', 'https://images.unsplash.com/photo-1582719188393-bb71ca45dbb9?w=1200', true, 0),
  
  -- Lyon
  ('22222222-0000-0000-0000-000000000016', 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=1200', true, 0),
  ('22222222-0000-0000-0000-000000000017', 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=1200', true, 0),
  ('22222222-0000-0000-0000-000000000018', 'https://images.unsplash.com/photo-1577720580479-7d839d829c73?w=1200', true, 0),
  ('22222222-0000-0000-0000-000000000019', 'https://images.unsplash.com/photo-1577083552431-6e5fd75a9160?w=1200', true, 0),
  ('22222222-0000-0000-0000-000000000020', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200', true, 0),
  
  -- Marseille
  ('22222222-0000-0000-0000-000000000021', 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=1200', true, 0),
  ('22222222-0000-0000-0000-000000000022', 'https://images.unsplash.com/photo-1604328698692-f76ea9498e76?w=1200', true, 0),
  ('22222222-0000-0000-0000-000000000023', 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200', true, 0),
  ('22222222-0000-0000-0000-000000000024', 'https://images.unsplash.com/photo-1604014237800-1c9102c219da?w=1200', true, 0),
  ('22222222-0000-0000-0000-000000000025', 'https://images.unsplash.com/photo-1531058020387-3be344556be6?w=1200', true, 0),
  
  -- Bordeaux
  ('22222222-0000-0000-0000-000000000026', 'https://images.unsplash.com/photo-1481437156560-3205f6a55735?w=1200', true, 0),
  ('22222222-0000-0000-0000-000000000027', 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200', true, 0),
  ('22222222-0000-0000-0000-000000000028', 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1200', true, 0),
  ('22222222-0000-0000-0000-000000000029', 'https://images.unsplash.com/photo-1582539181751-b041d380c4a4?w=1200', true, 0),
  ('22222222-0000-0000-0000-000000000030', 'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=1200', true, 0),
  
  -- Lille
  ('22222222-0000-0000-0000-000000000031', 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=1200', true, 0),
  ('22222222-0000-0000-0000-000000000032', 'https://images.unsplash.com/photo-1582719188393-bb71ca45dbb9?w=1200', true, 0),
  ('22222222-0000-0000-0000-000000000033', 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=1200', true, 0),
  
  -- Nantes
  ('22222222-0000-0000-0000-000000000034', 'https://images.unsplash.com/photo-1577720580479-7d839d829c73?w=1200', true, 0),
  ('22222222-0000-0000-0000-000000000035', 'https://images.unsplash.com/photo-1577083552431-6e5fd75a9160?w=1200', true, 0),
  ('22222222-0000-0000-0000-000000000036', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200', true, 0),
  
  -- Toulouse
  ('22222222-0000-0000-0000-000000000037', 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=1200', true, 0),
  ('22222222-0000-0000-0000-000000000038', 'https://images.unsplash.com/photo-1604328698692-f76ea9498e76?w=1200', true, 0),
  ('22222222-0000-0000-0000-000000000039', 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200', true, 0),
  
  -- Strasbourg
  ('22222222-0000-0000-0000-000000000040', 'https://images.unsplash.com/photo-1604014237800-1c9102c219da?w=1200', true, 0),
  ('22222222-0000-0000-0000-000000000041', 'https://images.unsplash.com/photo-1531058020387-3be344556be6?w=1200', true, 0),
  
  -- Nice
  ('22222222-0000-0000-0000-000000000042', 'https://images.unsplash.com/photo-1481437156560-3205f6a55735?w=1200', true, 0),
  ('22222222-0000-0000-0000-000000000043', 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200', true, 0),
  
  -- Rennes
  ('22222222-0000-0000-0000-000000000044', 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1200', true, 0),
  ('22222222-0000-0000-0000-000000000045', 'https://images.unsplash.com/photo-1582539181751-b041d380c4a4?w=1200', true, 0)

ON CONFLICT DO NOTHING;