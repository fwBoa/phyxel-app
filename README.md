# Phyxel

[![Next.js](https://img.shields.io/badge/Next.js-15.5.18-black?logo=next.js)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?logo=tailwind-css)](https://tailwindcss.com)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL_+_Auth-3ECF8E?logo=supabase)](https://supabase.com)
[![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-Components-000000)](https://ui.shadcn.com)

> *donner du sens à vos ventes*

![Phyxel Landing Page](public/screenshots/landing-hero.webp)

---

## Qu'est-ce que Phyxel ?

**Phyxel** est une marketplace qui connecte les marques e-commerce avec des espaces physiques temporaires — pop-up stores, showrooms, corners et boutiques éphémères.

Les marques digitales manquent d'un canal physique pour **tester leurs produits**, **rassurer leurs clients** et **créer des événements mémorables**. Phyxel leur permet de trouver, filtrer et réserver le lieu idéal en quelques clics.

---

## Stack technique

| Technologie | Version | Usage |
|---|---|---|
| **Next.js** | 15.5.18 | Framework full-stack, App Router, Server Actions |
| **React** | 19 | UI library, Server & Client Components |
| **TypeScript** | 5.x | Typage statique |
| **Tailwind CSS** | v4 | Utility-first styling |
| **shadcn/ui** | — | Composants UI accessibles |
| **Supabase** | — | Auth, PostgreSQL, Storage, RLS |
| **Lucide React** | — | Icônes |

---

## Fonctionnalités

- **Onboarding wizard 5 étapes** — Parcours guidé post-inscription pour qualifier chaque marque (infos, objectifs, besoins, préférences, résumé).
- **Explorateur d'espaces** — Catalogue filtrable avec cartes interactives, photos, prix/jour et score de matching.
- **Favoris** — Sauvegarde d'espaces favoris avec persistance utilisateur (RLS).
- **Dashboard marque** — Espace personnel : favoris, profil, réservations.
- **Administration CRUD** — Interface admin sécurisée pour gérer les espaces et leurs photos.
- **Middleware intelligent** — Redirections automatiques selon auth, onboarding et rôle admin.
- **RLS & Policies** — Sécurité granulaire au niveau des lignes PostgreSQL.
