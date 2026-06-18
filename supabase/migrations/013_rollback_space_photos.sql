-- Migration 013: rollback space photos to original URLs from 008_spaces_seed.sql
-- Annule les changements introduits par 012_space_photos_update.sql

BEGIN;

-- 1. Showroom industriel Marais
UPDATE space_photos SET url = 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200'
  WHERE space_id = '11111111-0000-0000-0000-000000000001' AND order_idx = 0;
UPDATE space_photos SET url = 'https://images.unsplash.com/photo-1604328698692-f76ea9498e76?w=1200'
  WHERE space_id = '11111111-0000-0000-0000-000000000001' AND order_idx = 1;
UPDATE space_photos SET url = 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1200'
  WHERE space_id = '11111111-0000-0000-0000-000000000001' AND order_idx = 2;

-- 2. Boutique Saint-Germain
UPDATE space_photos SET url = 'https://images.unsplash.com/photo-1481437156560-3205f6a55735?w=1200'
  WHERE space_id = '11111111-0000-0000-0000-000000000002' AND order_idx = 0;
UPDATE space_photos SET url = 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=1200'
  WHERE space_id = '11111111-0000-0000-0000-000000000002' AND order_idx = 1;

-- 3. Pop-up Canal Saint-Martin
UPDATE space_photos SET url = 'https://images.unsplash.com/photo-1604014237800-1c9102c219da?w=1200'
  WHERE space_id = '11111111-0000-0000-0000-000000000003' AND order_idx = 0;
UPDATE space_photos SET url = 'https://images.unsplash.com/photo-1582539181751-b041d380c4a4?w=1200'
  WHERE space_id = '11111111-0000-0000-0000-000000000003' AND order_idx = 1;

-- 4. Galerie Bastille
UPDATE space_photos SET url = 'https://images.unsplash.com/photo-1531058020387-3be344556be6?w=1200'
  WHERE space_id = '11111111-0000-0000-0000-000000000004' AND order_idx = 0;
UPDATE space_photos SET url = 'https://images.unsplash.com/photo-1554907984-15263bfd63bd?w=1200'
  WHERE space_id = '11111111-0000-0000-0000-000000000004' AND order_idx = 1;
UPDATE space_photos SET url = 'https://images.unsplash.com/photo-1545987796-200677ee1662?w=1200'
  WHERE space_id = '11111111-0000-0000-0000-000000000004' AND order_idx = 2;

-- 5. Corner Opéra
UPDATE space_photos SET url = 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=1200'
  WHERE space_id = '11111111-0000-0000-0000-000000000005' AND order_idx = 0;

-- 6. Boutique Lyon Presqu'île
UPDATE space_photos SET url = 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=1200'
  WHERE space_id = '11111111-0000-0000-0000-000000000006' AND order_idx = 0;
UPDATE space_photos SET url = 'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=1200'
  WHERE space_id = '11111111-0000-0000-0000-000000000006' AND order_idx = 1;

-- 7. Pop-up Confluence
UPDATE space_photos SET url = 'https://images.unsplash.com/photo-1582719188393-bb71ca45dbb9?w=1200'
  WHERE space_id = '11111111-0000-0000-0000-000000000007' AND order_idx = 0;
UPDATE space_photos SET url = 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=1200'
  WHERE space_id = '11111111-0000-0000-0000-000000000007' AND order_idx = 1;

-- 8. Showroom Vieux-Port
UPDATE space_photos SET url = 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=1200'
  WHERE space_id = '11111111-0000-0000-0000-000000000008' AND order_idx = 0;
UPDATE space_photos SET url = 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=1200'
  WHERE space_id = '11111111-0000-0000-0000-000000000008' AND order_idx = 1;

-- 9. Galerie Cours Julien
UPDATE space_photos SET url = 'https://images.unsplash.com/photo-1577720580479-7d839d829c73?w=1200'
  WHERE space_id = '11111111-0000-0000-0000-000000000009' AND order_idx = 0;
UPDATE space_photos SET url = 'https://images.unsplash.com/photo-1577083552431-6e5fd75a9160?w=1200'
  WHERE space_id = '11111111-0000-0000-0000-000000000009' AND order_idx = 1;

-- 10. Boutique Chartrons
UPDATE space_photos SET url = 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=1200'
  WHERE space_id = '11111111-0000-0000-0000-000000000010' AND order_idx = 0;
UPDATE space_photos SET url = 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=1200'
  WHERE space_id = '11111111-0000-0000-0000-000000000010' AND order_idx = 1;

-- 11. Pop-up Vieux-Lille
UPDATE space_photos SET url = 'https://images.unsplash.com/photo-1582539181751-b041d380c4a4?w=1200'
  WHERE space_id = '11111111-0000-0000-0000-000000000011' AND order_idx = 0;

-- 12. Corner Bouffay
UPDATE space_photos SET url = 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1200'
  WHERE space_id = '11111111-0000-0000-0000-000000000012' AND order_idx = 0;

COMMIT;
