-- Migration 014: add services, equipment and rental_conditions to spaces
-- Stockés en JSONB pour flexibilité (array d'objets {label, icon})

BEGIN;

ALTER TABLE spaces
  ADD COLUMN IF NOT EXISTS included_services  JSONB NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS equipment          JSONB NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS rental_conditions  TEXT;

-- =============================================================
-- Seed des 12 espaces existants (mapping depuis 008_spaces_seed.sql)
-- =============================================================

-- 1. Showroom industriel Marais
UPDATE spaces SET
  included_services = '[
    {"label":"Transports à proximité","icon":"bus"},
    {"label":"Accès livraison","icon":"truck"},
    {"label":"Assistance technique","icon":"wrench"},
    {"label":"Wi-Fi haut débit","icon":"wifi"},
    {"label":"Accès handicapé","icon":"accessibility"},
    {"label":"Accès sécurisé 24h/24","icon":"shield"},
    {"label":"Climatisation / chauffage","icon":"thermometer"},
    {"label":"Nettoyage avant mise à disposition","icon":"sparkles"}
  ]'::jsonb,
  equipment = '[
    {"label":"Multiprises et points d''alimentation","icon":"plug"},
    {"label":"Système de caisse (POS)","icon":"credit-card"},
    {"label":"Mobilier événementiel inclus","icon":"armchair"},
    {"label":"Éclairage professionnel","icon":"lightbulb"},
    {"label":"Audio Bluetooth","icon":"speaker"}
  ]'::jsonb,
  rental_conditions = 'Réservation minimum 2 jours. Caution 1 500 €. Frais de service Phyxel 15 %.'
WHERE id = '11111111-0000-0000-0000-000000000001';

-- 2. Boutique Saint-Germain
UPDATE spaces SET
  included_services = '[
    {"label":"Transports à proximité","icon":"bus"},
    {"label":"Accès livraison","icon":"truck"},
    {"label":"Wi-Fi haut débit","icon":"wifi"},
    {"label":"Climatisation / chauffage","icon":"thermometer"},
    {"label":"Nettoyage avant mise à disposition","icon":"sparkles"}
  ]'::jsonb,
  equipment = '[
    {"label":"Système de caisse (POS)","icon":"credit-card"},
    {"label":"Mobilier événementiel inclus","icon":"armchair"},
    {"label":"Éclairage professionnel","icon":"lightbulb"},
    {"label":"Audio Bluetooth","icon":"speaker"}
  ]'::jsonb,
  rental_conditions = 'Réservation minimum 3 jours. Caution 2 000 €. Frais de service Phyxel 15 %.'
WHERE id = '11111111-0000-0000-0000-000000000002';

-- 3. Pop-up Canal Saint-Martin
UPDATE spaces SET
  included_services = '[
    {"label":"Transports à proximité","icon":"bus"},
    {"label":"Wi-Fi haut débit","icon":"wifi"},
    {"label":"Nettoyage avant mise à disposition","icon":"sparkles"}
  ]'::jsonb,
  equipment = '[
    {"label":"Multiprises et points d''alimentation","icon":"plug"},
    {"label":"Éclairage professionnel","icon":"lightbulb"},
    {"label":"Audio Bluetooth","icon":"speaker"}
  ]'::jsonb,
  rental_conditions = 'Réservation minimum 1 jour. Caution 800 €. Frais de service Phyxel 15 %.'
WHERE id = '11111111-0000-0000-0000-000000000003';

-- 4. Galerie Bastille
UPDATE spaces SET
  included_services = '[
    {"label":"Transports à proximité","icon":"bus"},
    {"label":"Accès livraison","icon":"truck"},
    {"label":"Assistance technique","icon":"wrench"},
    {"label":"Wi-Fi haut débit","icon":"wifi"},
    {"label":"Accès handicapé","icon":"accessibility"},
    {"label":"Climatisation / chauffage","icon":"thermometer"},
    {"label":"Nettoyage avant mise à disposition","icon":"sparkles"}
  ]'::jsonb,
  equipment = '[
    {"label":"Système de caisse (POS)","icon":"credit-card"},
    {"label":"Mobilier événementiel inclus","icon":"armchair"},
    {"label":"Réserve arrière-boutique","icon":"warehouse"},
    {"label":"Éclairage professionnel","icon":"lightbulb"},
    {"label":"Audio Bluetooth","icon":"speaker"}
  ]'::jsonb,
  rental_conditions = 'Réservation minimum 5 jours. Caution 3 000 €. Frais de service Phyxel 15 %.'
WHERE id = '11111111-0000-0000-0000-000000000004';

-- 5. Corner Opéra
UPDATE spaces SET
  included_services = '[
    {"label":"Transports à proximité","icon":"bus"},
    {"label":"Wi-Fi haut débit","icon":"wifi"},
    {"label":"Climatisation / chauffage","icon":"thermometer"}
  ]'::jsonb,
  equipment = '[
    {"label":"Multiprises et points d''alimentation","icon":"plug"},
    {"label":"Système de caisse (POS)","icon":"credit-card"},
    {"label":"Éclairage professionnel","icon":"lightbulb"}
  ]'::jsonb,
  rental_conditions = 'Réservation minimum 1 jour. Caution 500 €. Frais de service Phyxel 15 %.'
WHERE id = '11111111-0000-0000-0000-000000000005';

-- 6. Boutique Lyon Presqu'île
UPDATE spaces SET
  included_services = '[
    {"label":"Transports à proximité","icon":"bus"},
    {"label":"Accès livraison","icon":"truck"},
    {"label":"Wi-Fi haut débit","icon":"wifi"},
    {"label":"Climatisation / chauffage","icon":"thermometer"},
    {"label":"Nettoyage avant mise à disposition","icon":"sparkles"}
  ]'::jsonb,
  equipment = '[
    {"label":"Système de caisse (POS)","icon":"credit-card"},
    {"label":"Mobilier événementiel inclus","icon":"armchair"},
    {"label":"Réserve arrière-boutique","icon":"warehouse"},
    {"label":"Éclairage professionnel","icon":"lightbulb"}
  ]'::jsonb,
  rental_conditions = 'Réservation minimum 2 jours. Caution 1 200 €. Frais de service Phyxel 15 %.'
WHERE id = '11111111-0000-0000-0000-000000000006';

-- 7. Pop-up Confluence
UPDATE spaces SET
  included_services = '[
    {"label":"Transports à proximité","icon":"bus"},
    {"label":"Accès livraison","icon":"truck"},
    {"label":"Wi-Fi haut débit","icon":"wifi"},
    {"label":"Climatisation / chauffage","icon":"thermometer"},
    {"label":"Nettoyage avant mise à disposition","icon":"sparkles"}
  ]'::jsonb,
  equipment = '[
    {"label":"Multiprises et points d''alimentation","icon":"plug"},
    {"label":"Système de caisse (POS)","icon":"credit-card"},
    {"label":"Mobilier événementiel inclus","icon":"armchair"},
    {"label":"Éclairage professionnel","icon":"lightbulb"},
    {"label":"Audio Bluetooth","icon":"speaker"}
  ]'::jsonb,
  rental_conditions = 'Réservation minimum 3 jours. Caution 1 800 €. Frais de service Phyxel 15 %.'
WHERE id = '11111111-0000-0000-0000-000000000007';

-- 8. Showroom Vieux-Port
UPDATE spaces SET
  included_services = '[
    {"label":"Transports à proximité","icon":"bus"},
    {"label":"Accès livraison","icon":"truck"},
    {"label":"Assistance technique","icon":"wrench"},
    {"label":"Wi-Fi haut débit","icon":"wifi"},
    {"label":"Accès handicapé","icon":"accessibility"},
    {"label":"Climatisation / chauffage","icon":"thermometer"},
    {"label":"Nettoyage avant mise à disposition","icon":"sparkles"}
  ]'::jsonb,
  equipment = '[
    {"label":"Système de caisse (POS)","icon":"credit-card"},
    {"label":"Mobilier événementiel inclus","icon":"armchair"},
    {"label":"Réserve arrière-boutique","icon":"warehouse"},
    {"label":"Éclairage professionnel","icon":"lightbulb"},
    {"label":"Audio Bluetooth","icon":"speaker"}
  ]'::jsonb,
  rental_conditions = 'Réservation minimum 3 jours. Caution 2 500 €. Frais de service Phyxel 15 %.'
WHERE id = '11111111-0000-0000-0000-000000000008';

-- 9. Galerie Cours Julien
UPDATE spaces SET
  included_services = '[
    {"label":"Transports à proximité","icon":"bus"},
    {"label":"Wi-Fi haut débit","icon":"wifi"},
    {"label":"Climatisation / chauffage","icon":"thermometer"},
    {"label":"Nettoyage avant mise à disposition","icon":"sparkles"}
  ]'::jsonb,
  equipment = '[
    {"label":"Mobilier événementiel inclus","icon":"armchair"},
    {"label":"Éclairage professionnel","icon":"lightbulb"},
    {"label":"Audio Bluetooth","icon":"speaker"}
  ]'::jsonb,
  rental_conditions = 'Réservation minimum 2 jours. Caution 1 000 €. Frais de service Phyxel 15 %.'
WHERE id = '11111111-0000-0000-0000-000000000009';

-- 10. Boutique Chartrons
UPDATE spaces SET
  included_services = '[
    {"label":"Transports à proximité","icon":"bus"},
    {"label":"Wi-Fi haut débit","icon":"wifi"},
    {"label":"Climatisation / chauffage","icon":"thermometer"},
    {"label":"Nettoyage avant mise à disposition","icon":"sparkles"}
  ]'::jsonb,
  equipment = '[
    {"label":"Système de caisse (POS)","icon":"credit-card"},
    {"label":"Mobilier événementiel inclus","icon":"armchair"},
    {"label":"Réserve arrière-boutique","icon":"warehouse"},
    {"label":"Éclairage professionnel","icon":"lightbulb"}
  ]'::jsonb,
  rental_conditions = 'Réservation minimum 2 jours. Caution 1 500 €. Frais de service Phyxel 15 %.'
WHERE id = '11111111-0000-0000-0000-000000000010';

-- 11. Pop-up Vieux-Lille
UPDATE spaces SET
  included_services = '[
    {"label":"Transports à proximité","icon":"bus"},
    {"label":"Wi-Fi haut débit","icon":"wifi"},
    {"label":"Nettoyage avant mise à disposition","icon":"sparkles"}
  ]'::jsonb,
  equipment = '[
    {"label":"Multiprises et points d''alimentation","icon":"plug"},
    {"label":"Système de caisse (POS)","icon":"credit-card"},
    {"label":"Éclairage professionnel","icon":"lightbulb"},
    {"label":"Audio Bluetooth","icon":"speaker"}
  ]'::jsonb,
  rental_conditions = 'Réservation minimum 1 jour. Caution 600 €. Frais de service Phyxel 15 %.'
WHERE id = '11111111-0000-0000-0000-000000000011';

-- 12. Corner Bouffay
UPDATE spaces SET
  included_services = '[
    {"label":"Transports à proximité","icon":"bus"},
    {"label":"Wi-Fi haut débit","icon":"wifi"},
    {"label":"Climatisation / chauffage","icon":"thermometer"}
  ]'::jsonb,
  equipment = '[
    {"label":"Multiprises et points d''alimentation","icon":"plug"},
    {"label":"Éclairage professionnel","icon":"lightbulb"}
  ]'::jsonb,
  rental_conditions = 'Réservation minimum 1 jour. Caution 400 €. Frais de service Phyxel 15 %.'
WHERE id = '11111111-0000-0000-0000-000000000012';

COMMIT;
