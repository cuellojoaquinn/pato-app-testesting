# Pruebas Unitarias - Pato App

Este documento contiene las instrucciones para configurar y ejecutar las pruebas unitarias del componente `PatoDetailPage`.

## Instalación de Dependencias

Primero, necesitas instalar las dependencias de testing. Ejecuta el siguiente comando en tu terminal:

```bash
npm install --save-dev @testing-library/react @testing-library/jest-dom @testing-library/user-event jest jest-environment-jsdom @types/jest
```

## Configuración

### 1. Actualizar package.json

Agrega los siguientes scripts a tu `package.json`:

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}
```

### 2. Archivos de Configuración

Los archivos de configuración ya están creados:
- `jest.config.js` - Configuración principal de Jest
- `jest.setup.js` - Configuración de setup para Jest

## Estructura de Pruebas

Las pruebas están organizadas en el directorio `__tests__/` siguiendo la estructura del proyecto:

```
__tests__/
└── app/
    └── catalogo/
        └── [id]/
            └── PatoDetailPage.test.tsx
```

## Casos de Prueba Cubiertos

### 1. Renderizado Inicial
- ✅ Renderiza la información del pato correctamente
- ✅ Muestra todos los campos de información
- ✅ Muestra la imagen del pato
- ✅ Muestra el botón de volver al catálogo

### 2. Funcionalidad de Sonido
- ✅ Botón deshabilitado para usuarios gratuitos
- ✅ Botón habilitado para usuarios premium
- ✅ Mensaje de actualización para usuarios gratuitos
- ✅ Alerta cuando usuario gratuito intenta reproducir sonido
- ✅ Reproducción de sonido para usuarios premium

### 3. Navegación
- ✅ Redirección a login si no hay usuario autenticado
- ✅ Redirección al catálogo si el pato no existe
- ✅ Navegación al catálogo desde el botón "Volver"

### 4. Manejo de Errores
- ✅ Manejo de patos sin imagen
- ✅ Renderizado null cuando no hay usuario o pato

### 5. Interacciones del Usuario
- ✅ Clic en botón de sonido para usuarios premium
- ✅ Visualización de información completa del pato

### 6. Accesibilidad
- ✅ Texto alternativo en imágenes
- ✅ Botones con texto descriptivo

### 7. Estados del Componente
- ✅ Estado de carga inicial
- ✅ Manejo de cambios en el plan del usuario

## Ejecutar las Pruebas

### Ejecutar todas las pruebas
```bash
npm test
```

### Ejecutar pruebas en modo watch
```bash
npm run test:watch
```

### Ejecutar pruebas con cobertura
```bash
npm run test:coverage
```

## Cobertura de Código

Las pruebas están configuradas para alcanzar al menos un 80% de cobertura en:
- Branches (ramas)
- Functions (funciones)
- Lines (líneas)
- Statements (declaraciones)

## Mocks Utilizados

### 1. Next.js Navigation
```javascript
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useParams: jest.fn(),
}))
```

### 2. Contexto de Autenticación
```javascript
jest.mock('../../../../contexts/AuthContext', () => ({
  useAuth: jest.fn(),
}))
```

### 3. Servicio de Patos
```javascript
jest.mock('../../../../lib/patoService', () => ({
  PatoService: {
    getPatos: jest.fn(),
  },
}))
```

### 4. Next.js Link
```javascript
jest.mock('next/link', () => {
  return ({ children, href }) => {
    return <a href={href}>{children}</a>
  }
})
```

### 5. Global Objects
- `window.alert`
- `localStorage`
- `window.matchMedia`
- `ResizeObserver`
- `IntersectionObserver`

## Datos de Prueba

### Usuario Mock
```javascript
const mockUser = {
  id: '1',
  nombre: 'Juan',
  apellido: 'Pérez',
  email: 'juan@example.com',
  usuario: 'juanperez',
  contraseña: 'password123',
  rol: 'user',
  plan: 'gratuito',
  fechaRegistro: '2024-01-01',
}
```

### Pato Mock
```javascript
const mockPato = {
  id: 'pato-1',
  nombre: 'Pato Real',
  nombreCientifico: 'Anas platyrhynchos',
  descripcion: 'El pato real es una especie muy común en América del Norte.',
  comportamiento: 'Son aves sociales que viven en grupos.',
  habitat: 'Lagos, ríos y humedales',
  plumaje: 'Plumaje verde iridiscente en la cabeza',
  alimentacion: 'Omnívoro, se alimenta de plantas acuáticas e insectos',
  imagen: '/pato-real.jpg',
  sonido: 'cuac-cuac.mp3',
  especie: 'Anas',
}
```

## Troubleshooting

### Error: "Cannot find module '@testing-library/react'"
Asegúrate de haber instalado todas las dependencias:
```bash
npm install --save-dev @testing-library/react @testing-library/jest-dom @testing-library/user-event jest jest-environment-jsdom @types/jest
```

### Error: "Jest did not exit"
Esto puede ocurrir si hay timers o promesas pendientes. Asegúrate de limpiar todos los mocks en `beforeEach`:
```javascript
beforeEach(() => {
  jest.clearAllMocks()
})
```

### Error: "TypeError: Cannot read property 'getBoundingClientRect' of null"
Este error puede ocurrir con componentes que usan `ResizeObserver`. El mock ya está configurado en `jest.setup.js`.

## Próximos Pasos

1. **Instalar las dependencias** siguiendo las instrucciones arriba
2. **Ejecutar las pruebas** para verificar que todo funciona
3. **Revisar la cobertura** para identificar áreas que necesitan más pruebas
4. **Agregar más casos de prueba** según sea necesario

## Notas Importantes

- Las pruebas están escritas en español para mantener consistencia con el proyecto
- Se utilizan mocks extensivos para aislar el componente bajo prueba
- Se incluyen pruebas de accesibilidad básicas
- Se cubren tanto casos exitosos como casos de error 