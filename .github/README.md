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
