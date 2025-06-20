# GitHub Actions Configuration

Este directorio contiene los workflows de GitHub Actions para automatizar el CI/CD del proyecto.

## Workflows Disponibles

### 1. `nextjs.yml` - CI/CD Básico
- **Trigger**: Push y Pull Requests en `main` y `develop`
- **Funciones**:
  - Instalación de dependencias
  - Linting con ESLint
  - Build de la aplicación
  - Subida de artifacts

### 2. `deploy-vercel.yml` - Deploy a Vercel
- **Trigger**: Push y Pull Requests en `main`
- **Funciones**:
  - Build y linting
  - Deploy automático a Vercel
  - Preview deployments para PRs
  - Production deployments para main

## Configuración de Secrets

Para usar el workflow de Vercel, necesitas configurar los siguientes secrets en tu repositorio:

1. Ve a tu repositorio en GitHub
2. Navega a **Settings** > **Secrets and variables** > **Actions**
3. Agrega los siguientes secrets:

### `VERCEL_TOKEN`
1. Ve a [Vercel Dashboard](https://vercel.com/account/tokens)
2. Crea un nuevo token
3. Copia el token y agrégalo como secret

### `ORG_ID`
1. Ve a [Vercel Dashboard](https://vercel.com/account)
2. En la sección "General", copia el "Team ID"
3. Agrégalo como secret

### `PROJECT_ID`
1. Ve a tu proyecto en Vercel
2. En la configuración del proyecto, copia el "Project ID"
3. Agrégalo como secret

## Uso

Los workflows se ejecutarán automáticamente cuando:
- Hagas push a las ramas `main` o `develop`
- Crees un Pull Request hacia `main` o `develop`

## Personalización

Puedes modificar los workflows según tus necesidades:
- Cambiar las ramas que activan los workflows
- Agregar más pasos de testing
- Configurar deploy a otros servicios
- Agregar notificaciones (Slack, Discord, etc.) 