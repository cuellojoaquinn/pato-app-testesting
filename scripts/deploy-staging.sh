#!/bin/bash
set -e

echo "🚀 Iniciando deploy a Staging (Vercel)..."

if [ -z "$VERCEL_TOKEN" ]; then
  echo "ERROR: La variable VERCEL_TOKEN no está definida."
  exit 1
fi


# Deploy sin el flag --prod crea un preview/staging
npx vercel --token=$VERCEL_TOKEN --confirm

echo "✅ Deploy a Staging completado."
