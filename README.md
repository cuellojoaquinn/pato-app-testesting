# Pato App - Catálogo de Especies de Patos

Una aplicación web moderna para explorar y gestionar un catálogo de especies de patos de Argentina, construida con Next.js, TypeScript y Tailwind CSS.

## Características

- 🦆 Catálogo completo de especies de patos argentinos
- 🔐 Sistema de autenticación y autorización
- 👨‍💼 Panel de administración para gestionar especies
- 📱 Diseño responsive y moderno
- 🎨 Interfaz de usuario intuitiva con Tailwind CSS
- 🔍 Búsqueda y filtrado de especies
- 📊 Información detallada de cada especie

## Tecnologías Utilizadas

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **Icons**: Lucide React
- **Testing**: Jest, React Testing Library

## Instalación

1. Clona el repositorio:
```bash
git clone <repository-url>
cd pato-app-testesting
```

2. Instala las dependencias:
```bash
npm install
```

3. Ejecuta el servidor de desarrollo:
```bash
npm run dev
```

4. Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## Scripts Disponibles

- `npm run dev` - Ejecuta el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm run start` - Ejecuta la aplicación en modo producción
- `npm run lint` - Ejecuta el linter
- `npm run test` - Ejecuta las pruebas unitarias
- `npm run test:watch` - Ejecuta las pruebas en modo watch
- `npm run test:coverage` - Ejecuta las pruebas con reporte de cobertura

## Estructura del Proyecto

```
pato-app-testesting/
├── app/                    # Páginas de Next.js (App Router)
│   ├── admin/             # Panel de administración
│   ├── catalogo/          # Catálogo de especies
│   ├── login/             # Página de login
│   └── register/          # Página de registro
├── components/            # Componentes reutilizables
│   ├── ui/               # Componentes de UI base
│   ├── Navbar.tsx        # Barra de navegación
│   └── ProtectedRoute.tsx # Componente de ruta protegida
├── contexts/             # Contextos de React
│   └── AuthContext.tsx   # Contexto de autenticación
├── data/                 # Datos mock
│   └── mockData.ts       # Datos de prueba
├── lib/                  # Utilidades y servicios
│   ├── patoService.ts    # Servicio para gestionar patos
│   └── utils.ts          # Utilidades generales
├── types/                # Definiciones de tipos TypeScript
│   └── index.ts          # Tipos principales
└── __tests__/            # Pruebas unitarias
    ├── AdminPage.test.tsx    # Pruebas del componente AdminPage
    ├── PatoService.test.ts   # Pruebas del servicio PatoService
    └── AuthContext.test.tsx  # Pruebas del contexto de autenticación
```

## Pruebas Unitarias

El proyecto incluye un conjunto completo de pruebas unitarias que cubren:

### Componentes
- **AdminPage**: Pruebas del panel de administración
  - Autenticación y autorización
  - Carga de datos
  - Operaciones CRUD (Crear, Leer, Actualizar, Eliminar)
  - Validación de formularios
  - Manejo de errores
  - Elementos de UI

### Servicios
- **PatoService**: Pruebas del servicio de gestión de patos
  - Operaciones de localStorage
  - Búsqueda y filtrado
  - Manejo de casos edge
  - Compatibilidad con SSR

### Contextos
- **AuthContext**: Pruebas del contexto de autenticación
  - Estado inicial
  - Login y logout
  - Registro de usuarios
  - Actualización de planes
  - Manejo de errores

### Ejecutar Pruebas

```bash
# Ejecutar todas las pruebas
npm test

# Ejecutar pruebas en modo watch
npm run test:watch

# Ejecutar pruebas con cobertura
npm run test:coverage
```

### Cobertura de Pruebas

Las pruebas están configuradas para mantener una cobertura mínima del 80% en:
- Branches (ramas de código)
- Functions (funciones)
- Lines (líneas de código)
- Statements (declaraciones)

## Usuarios de Prueba

### Administrador
- **Email**: juan@example.com
- **Contraseña**: 123456
- **Rol**: admin
- **Plan**: pago

### Usuario Regular
- **Email**: maria@example.com
- **Contraseña**: 123456
- **Rol**: user
- **Plan**: gratuito

## Funcionalidades

### Para Usuarios
- Explorar el catálogo de especies
- Buscar y filtrar especies
- Ver información detallada de cada pato
- Registrarse e iniciar sesión
- Actualizar plan de suscripción

### Para Administradores
- Todas las funcionalidades de usuario
- Panel de administración
- Agregar nuevas especies
- Editar información existente
- Eliminar especies
- Gestionar el catálogo completo

## Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.
