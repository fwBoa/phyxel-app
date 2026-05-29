# Plan : Module Admin sur la base Seb (`jd-admin`)

## Contexte
On part de la branche `jd-admin` (base de Seb = `origin/main`). C'est un Next.js 16 + React 19 + Tailwind v4 avec shadcn/ui, structure `src/app/`. Auth, dashboard, profil, réservations, recherche, fiche espace sont déjà implémentés via Client Components + API routes.

## Objectif
1. Downgrade Next.js vers une version stable
2. Ajouter le rôle `is_admin` sur les profils
3. Créer une interface admin CRUD pour les espaces
4. Garder la structure `src/app/` et les patterns existants de Seb

---

## Phase 1 : Downgrade Next.js (stabilité)

Next.js 16 est très récent. On passe à **Next.js 15.5.18** (dernière stable, même version que notre `jd`).

- `next`: `16.2.6` → `15.5.18`
- `eslint-config-next`: `16.2.6` → `15.5.18`
- Vérifier que React 19 + Tailwind v4 fonctionnent avec Next.js 15
- Si conflits React, pin `react@19.2.4 react-dom@19.2.4` (Next.js 15 supporte React 19)
- Tester `npm run build`

## Phase 2 : Schéma — Ajout `is_admin`

**Migration SQL** (`supabase/migrations/00000000000000_initial_schema.sql`):
```sql
ALTER TABLE profiles ADD COLUMN is_admin BOOLEAN DEFAULT FALSE;
```

**Mise à jour `src/types/database.ts`** :
- Ajouter `is_admin: boolean | null` sur `profiles.Row`, `Insert`, `Update`

## Phase 3 : Middleware — Guard admin

Modifier `src/lib/supabase/middleware.ts` :
- Après `getUser()`, vérifier si la route commence par `/admin`
- Si oui, fetch le profil et vérifier `is_admin`
- Si pas admin → redirect `/dashboard`

## Phase 4 : Layout Admin

**`src/app/admin/layout.tsx`** :
- Auth guard (redirect `/login` si pas connecté)
- Admin guard (redirect `/dashboard` si pas admin)
- Sidebar admin simple : Espaces, retour au site
- Réutiliser le style de `src/app/dashboard/layout.tsx`

**`src/app/admin/page.tsx`** :
- Redirect vers `/admin/espaces`

## Phase 5 : Pages Admin

### 5.1 Liste des espaces
**`src/app/admin/espaces/page.tsx`** (Server Component):
- Query tous les espaces (pas de filtre `is_available`)
- Tableau avec : Titre, Type, Ville, Prix/jour, Disponible, Actions
- Bouton "+ Nouvel espace" → `/admin/espaces/nouveau`
- Actions : Éditer (`/admin/espaces/[id]/modifier`), Supprimer (Server Action ou API call)
- Pagination simple

### 5.2 Création
**`src/app/admin/espaces/nouveau/page.tsx`** :
- Server Component qui rend `SpaceForm` en mode "create"

### 5.3 Édition
**`src/app/admin/espaces/[id]/modifier/page.tsx`** :
- Server Component qui fetch l'espace par ID
- Rend `SpaceForm` en mode "edit" avec les données pré-remplies

## Phase 6 : Composant SpaceForm

**`src/app/admin/espaces/SpaceForm.tsx`** (Client Component):

Champs du formulaire (tous ceux de la table `spaces`) :
| Champ | Type | Obligatoire |
|---|---|---|
| Titre | text | ✅ |
| Type | select | ✅ |
| Ville | text | ✅ |
| Quartier | text | ❌ |
| Adresse | text | ❌ |
| Superficie (m²) | number | ❌ |
| Prix/jour (€) | number | ✅ |
| Description | textarea | ❌ |
| Disponible | checkbox | ❌ (default true) |
| Photos | textarea (une URL par ligne) | ❌ |

**Logique photos :**
- Textarea : une URL par ligne
- À la création : INSERT space, puis INSERT chaque URL dans `space_photos` (`is_cover = true` pour la première)
- À l'édition : REPLACE toutes les photos (DELETE anciennes + INSERT nouvelles)

**Soumission :**
- Mode create : `POST /api/admin/spaces`
- Mode edit : `PUT /api/admin/spaces/[id]`
- Messages succès/erreur inline
- Redirect vers `/admin/espaces` après succès

## Phase 7 : API Routes Admin

**`src/app/api/admin/spaces/route.ts`** :
- `GET` → liste tous les espaces (admin only)
- `POST` → crée un espace + photos (admin only)

**`src/app/api/admin/spaces/[id]/route.ts`** :
- `GET` → un espace par ID (admin only)
- `PUT` → modifie un espace + remplace photos (admin only)
- `DELETE` → supprime un espace (cascade space_photos + bookings) (admin only)

**Vérification admin dans chaque handler :**
```typescript
const { data: profile } = await supabase.from('profiles').select('is_admin').eq('id', user.id).single()
if (!profile?.is_admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
```

## Phase 8 : Dashboard — Lien vers Admin

Dans `src/app/dashboard/layout.tsx` :
- Si `profile.is_admin`, ajouter un lien "Admin" dans la sidebar qui mène à `/admin/espaces`

## Phase 9 : Styles

Réutiliser le design system de Seb :
- Couleurs : `#E91E8C` (brand), `#0A0A0A`, `#6B6B6B`, `#F9F9F9`
- Bordures : `border-[#E5E5E5]`, `rounded-2xl`
- Inputs : `rounded-xl border border-[#E5E5E5] px-4 py-2.5`
- Boutons primaires : `bg-[#E91E8C] text-white rounded-full`
- Boutons secondaires : `bg-gray-900 text-white`
- Pas de shadcn/ui pour le formulaire admin (inputs natifs pour garder le contrôle), sauf si Seb utilise déjà des composants shadcn

## Phase 10 : Ordre d'implémentation

1. **Phase 1** — Downgrade Next.js + fix build
2. **Phase 2** — Migration SQL + types
3. **Phase 3** — Middleware admin guard
4. **Phase 4** — Layout admin + redirect
5. **Phase 5 + 6 + 7** — Pages liste, formulaire, API routes (parallélisable)
6. **Phase 8** — Lien admin dans dashboard
7. **Test build** + commit + push `jd-admin`

## Fichiers créés / modifiés

**Modifiés :**
- `package.json` (downgrade next, eslint-config-next)
- `src/lib/supabase/middleware.ts` (admin guard)
- `src/types/database.ts` (ajout `is_admin`)
- `src/app/dashboard/layout.tsx` (lien admin conditionnel)
- `supabase/migrations/00000000000000_initial_schema.sql` (ajout `is_admin`)

**Créés :**
- `src/app/admin/layout.tsx`
- `src/app/admin/page.tsx`
- `src/app/admin/espaces/page.tsx`
- `src/app/admin/espaces/nouveau/page.tsx`
- `src/app/admin/espaces/[id]/modifier/page.tsx`
- `src/app/admin/espaces/SpaceForm.tsx`
- `src/app/api/admin/spaces/route.ts`
- `src/app/api/admin/spaces/[id]/route.ts`
