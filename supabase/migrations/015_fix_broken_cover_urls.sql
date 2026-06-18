-- Migration 015: replace 2 broken Unsplash cover URLs
-- Photos 'photo-1582539181751-b041d380c4a4' et 'photo-1545987796-200677ee1662'
-- retournaient 404 (supprimees par Unsplash)
-- Replaced by working alternatives already in use in the seed

BEGIN;

-- Pop-up Vieux-Lille (id 11)
UPDATE space_photos
SET url = 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200'
WHERE space_id = '11111111-0000-0000-0000-000000000011'
  AND is_cover = TRUE
  AND url = 'https://images.unsplash.com/photo-1582539181751-b041d380c4a4?w=1200';

-- Galerie design Lyon Confluence (id 2 du seed etendu, prefix 33333)
UPDATE space_photos
SET url = 'https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=1200'
WHERE space_id = '33333333-0000-0000-0000-000000000002'
  AND is_cover = TRUE
  AND url = 'https://images.unsplash.com/photo-1545987796-200677ee1662?w=1200';

COMMIT;
