#!/bin/bash
set -e

echo ":rocket: Iniciando deploy a Producción (Vercel)..."

# Si tu proyecto tiene .vercel/project.json con org y project id
# se toma automáticamente. Si no, se puede pasar con --scope
# o variables de entorno.

npx vercel --prod --token= 4rPLHoxJNbt0f8gjII0Zkanc --confirm

echo ":white_check_mark: Deploy a Producción completado."
