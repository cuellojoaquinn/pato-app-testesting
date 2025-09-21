#!/bin/bash
set -e

echo "🚀 Iniciando deploy a Staging (Vercel)..."

# Deploy sin el flag --prod crea un preview/staging
npx vercel --token=4rPLHoxJNbt0f8gjII0Zkanc --confirm

echo "✅ Deploy a Staging completado."
