# GitHub Actions Configuration

Este directorio contiene los workflows de GitHub Actions para automatizar el CI/CD del proyecto.

## Workflow Disponible

### 1. `ci.yml` - CI/CD Completo para Next.js

- **Trigger**: Push y Pull Requests en cualquier rama (`'**'`)
- **Pasos ejecutados:**
  - Checkout del repositorio
  - Setup de Node.js 20
  - Instalación de dependencias (`npm install --legacy-peer-deps`)
  - Linting con ESLint (`npm run lint`)
  - Pruebas unitarias (`npm test`)
  - Pruebas unitarias con cobertura (`npm run test:coverage`)
  - Build de la aplicación (`npm run build`)

## Uso

El workflow se ejecutará automáticamente cuando:

- Hagas push a cualquier rama
- Crees un Pull Request hacia cualquier rama

## Personalización

Puedes modificar el workflow según tus necesidades:

- Cambiar las versiones de Node.js
- Agregar más pasos de testing o deploy
- Configurar deploy a servicios externos
- Agregar notificaciones (Slack, Discord, etc.)

## Notas

- Asegúrate de tener definidos los scripts `test` y `test:coverage` en tu `package.json` para que los pasos de pruebas funcionen correctamente.
- Si necesitas ayuda para configurar Jest o React Testing Library, házmelo saber.
