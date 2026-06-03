#!/bin/bash
# Script pour ajouter les variables d'environnement sur Vercel
# Usage : ./scripts/setup-vercel-env.sh
# Prérequis : vercel login + vercel link faits

set -e

cd "$(dirname "$0")/.."

echo "Ajout des variables d'environnement sur Vercel..."

# Lecture depuis .env.local
SUPABASE_URL=$(grep NEXT_PUBLIC_SUPABASE_URL .env.local | cut -d= -f2)
ANON_KEY=$(grep NEXT_PUBLIC_SUPABASE_ANON_KEY .env.local | cut -d= -f2)
SERVICE_KEY=$(grep SUPABASE_SERVICE_ROLE_KEY .env.local | cut -d= -f2)
JWT_SECRET=$(grep ADMIN_JWT_SECRET .env.local | cut -d= -f2)
JWT_TTL=$(grep ADMIN_SESSION_TTL_SECONDS .env.local | cut -d= -f2)

echo "→ NEXT_PUBLIC_SUPABASE_URL"
echo "$SUPABASE_URL" | vercel env add NEXT_PUBLIC_SUPABASE_URL production

echo "→ NEXT_PUBLIC_SUPABASE_ANON_KEY"
echo "$ANON_KEY" | vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production

echo "→ SUPABASE_SERVICE_ROLE_KEY"
echo "$SERVICE_KEY" | vercel env add SUPABASE_SERVICE_ROLE_KEY production

echo "→ ADMIN_JWT_SECRET"
echo "$JWT_SECRET" | vercel env add ADMIN_JWT_SECRET production

echo "→ ADMIN_SESSION_TTL_SECONDS"
echo "$JWT_TTL" | vercel env add ADMIN_SESSION_TTL_SECONDS production

echo ""
echo "✅ Variables ajoutées ! Déploie avec : vercel --prod"
