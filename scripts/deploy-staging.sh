#!/bin/bash
set -e

echo "🚀 Iniciando deploy a Staging (Vercel)..."

# Deploy sin el flag --prod crea un preview/staging
npx vercel --token=$VERCEL_TOKEN --confirm

echo "✅ Deploy a Staging completado."
