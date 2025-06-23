# Guía de Testing - Pato App

## Resumen de Pruebas Unitarias Creadas

Se han creado pruebas unitarias completas para el componente AdminPage y los servicios relacionados. Las pruebas cubren:

### 1. Componente AdminPage (`__tests__/AdminPage.test.tsx`)
- **Autenticación y Autorización**: Verifica que solo usuarios admin puedan acceder
- **Carga de Datos**: Prueba la carga inicial de patos
- **Operaciones CRUD**: 
  - Crear nuevos patos
  - Editar patos existentes
  - Eliminar patos
  - Listar patos
- **Validación de Formularios**: Verifica campos requeridos
- **Manejo de Errores**: Prueba casos edge y errores
- **Elementos de UI**: Verifica renderizado correcto

### 2. Servicio PatoService (`__tests__/PatoService.test.ts`)
- **Operaciones de localStorage**: Prueba persistencia de datos
- **Búsqueda y Filtrado**: Verifica funcionalidad de búsqueda
- **Manejo de Casos Edge**: Prueba casos límite y errores
- **Compatibilidad SSR**: Verifica funcionamiento en servidor

### 3. Contexto de Autenticación (`__tests__/AuthContext.test.tsx`)
- **Estado Inicial**: Verifica carga desde localStorage
- **Login/Logout**: Prueba autenticación
- **Registro**: Verifica creación de usuarios
- **Actualización de Planes**: Prueba cambios de suscripción
- **Manejo de Errores**: Verifica robustez

## Configuración de Testing

### Dependencias Instaladas
```json
{
  "@testing-library/jest-dom": "^6.4.2",
  "@testing-library/react": "^15.0.0",
  "@testing-library/user-event": "^14.5.2",
  "@types/jest": "^29.5.12",
  "jest": "^29.7.0",
  "jest-environment-jsdom": "^29.7.0"
}
```

### Archivos de Configuración
- `jest.config.js`: Configuración principal de Jest
- `jest.setup.js`: Setup global para pruebas
- `package.json`: Scripts de testing

## Comandos de Testing

```bash
# Ejecutar todas las pruebas
npm test

# Ejecutar pruebas en modo watch
npm run test:watch

# Ejecutar pruebas con cobertura
npm run test:coverage

# Ejecutar pruebas específicas
npm test -- --testPathPattern="AdminPage"
npm test -- --testPathPattern="PatoService"
npm test -- --testPathPattern="AuthContext"
```

## Problemas Conocidos y Soluciones

### 1. Problemas de Timers
**Problema**: Errores relacionados con fake timers en React Testing Library
**Solución**: Se configuraron fake timers globalmente en `jest.config.js`

### 2. Conflictos de Dependencias
**Problema**: Conflictos entre React 19 y versiones anteriores de testing libraries
**Solución**: Se actualizaron las dependencias y se usó `--legacy-peer-deps`

### 3. Problemas de localStorage
**Problema**: localStorage no está disponible en entorno de testing
**Solución**: Se mockea localStorage en `jest.setup.js`

## Estructura de Pruebas

### Patrón de Pruebas Utilizado
```typescript
describe('ComponentName', () => {
  beforeEach(() => {
    // Setup
  })

  describe('Feature', () => {
    it('should do something', () => {
      // Arrange
      // Act
      // Assert
    })
  })
})
```

### Mocks Utilizados
- `localStorage`: Mock completo para persistencia
- `useRouter`: Mock de Next.js router
- `PatoService`: Mock del servicio de patos
- `AuthContext`: Mock del contexto de autenticación

## Cobertura de Pruebas

Las pruebas están configuradas para mantener una cobertura mínima del 80% en:
- **Branches**: 80%
- **Functions**: 80%
- **Lines**: 80%
- **Statements**: 80%

## Casos de Prueba Cubiertos

### AdminPage
- ✅ Renderizado con usuario admin
- ✅ Redirección para usuarios no autenticados
- ✅ Redirección para usuarios no admin
- ✅ Carga de datos de patos
- ✅ Agregar nuevo pato
- ✅ Editar pato existente
- ✅ Eliminar pato
- ✅ Validación de formularios
- ✅ Manejo de errores
- ✅ Estados vacíos

### PatoService
- ✅ Operaciones CRUD completas
- ✅ Búsqueda y filtrado
- ✅ Persistencia en localStorage
- ✅ Manejo de casos edge
- ✅ Compatibilidad SSR
- ✅ Validación de datos

### AuthContext
- ✅ Estado inicial
- ✅ Login/Logout
- ✅ Registro de usuarios
- ✅ Actualización de planes
- ✅ Persistencia en localStorage
- ✅ Manejo de errores

## Mejoras Futuras

1. **Pruebas de Integración**: Agregar pruebas que combinen múltiples componentes
2. **Pruebas E2E**: Implementar pruebas end-to-end con Playwright o Cypress
3. **Pruebas de Performance**: Agregar pruebas de rendimiento
4. **Pruebas de Accesibilidad**: Verificar accesibilidad con jest-axe
5. **Pruebas de Snapshot**: Agregar pruebas de snapshot para UI

## Troubleshooting

### Error: "Cannot find module"
```bash
# Limpiar cache de Jest
npx jest --clearCache
```

### Error: "localStorage is not defined"
```bash
# Verificar que jest.setup.js esté configurado correctamente
```

### Error: "React state updates not wrapped in act"
```bash
# Usar act() para envolver actualizaciones de estado
import { act } from '@testing-library/react'
```

## Recursos Adicionales

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Next.js Testing](https://nextjs.org/docs/testing)
- [TypeScript Testing](https://jestjs.io/docs/getting-started#using-typescript) 