# C Ticket APK STV - React Native App

Aplicación React Native para C Ticket STV con arquitectura **RBAC + CRUD por rol**, usando **Tamagui** para estilos y diseño.

## 📐 Arquitectura

```
src/
├── components/          # Componentes reutilizables
├── screens/             # Pantallas organizadas por prefijo P_*
│   ├── P_Auth/          # Autenticación
│   │   └── LoginScreen.tsx
│   └── P_Principal/     # Pantallas principales
│       └── HomeScreen.tsx
├── navigation/          # React Navigation
├── store/               # Zustand (estado global)
├── services/            # API calls (axios)
├── lib/                 # Configuraciones (tamagui)
├── constants/           # Constantes (roles, colores, endpoints)
├── hooks/               # Custom hooks
├── types/               # TypeScript types
└── utils/               # Funciones utilitarias
```

## 🔐 RBAC + CRUD por Rol

### Roles Disponibles

| Rol | Crear | Leer | Actualizar | Eliminar |
|-----|-------|------|------------|----------|
| `admin` | ✅ | ✅ | ✅ | ✅ |
| `agente` | ✅ | ✅ | ✅ | ❌ |
| `supervisor` | ✅ | ✅ | ✅ | ✅ |
| `cliente` | ✅ | ✅ | ❌ | ❌ |

### Uso del Store

```typescript
import { useAuthStore } from './store'

const { user, isAuthenticated, hasPermission, hasRole, login, logout } = useAuthStore()

// Verificar permisos
if (hasPermission('create')) { /* ... */ }
if (hasPermission('delete')) { /* ... */ }

// Verificar roles
if (hasRole('admin')) { /* ... */ }
if (hasRole(['admin', 'supervisor'])) { /* ... */ }
```

### Custom Hook usePermissions

```typescript
import { usePermissions } from './hooks'

const { can, is, user, isAuthenticated } = usePermissions()

if (can('create')) { /* ... */ }
if (is('admin')) { /* ... */ }
```

## 🎨 Tamagui - Estilos

### Componentes Disponibles

```typescript
import { YStack, XStack, Text, Button, Input, Card, Spinner } from 'tamagui'
```

### Shorthands

```typescript
f: 'flex'
ai: 'alignItems'
jc: 'justifyContent'
fd: 'flexDirection'
p: 'padding'
px: 'paddingHorizontal'
py: 'paddingVertical'
m: 'margin'
mx: 'marginHorizontal'
my: 'marginVertical'
w: 'width'
h: 'height'
bg: 'backgroundColor'
c: 'color'
br: 'borderRadius'
```

### Temas

Los colores del tema se acceden con `$`:
- `$background`, `$background2`, `$background3`
- `$color`, `$color2`, `$color3`
- `$primary`, `$secondary`
- `$success`, `$warning`, `$error`
- `$borderColor`

## 📡 Servicios API

### Configuración

Editar `src/constants/index.ts` con la URL de tu backend:

```typescript
export const API_URL = 'http://192.168.1.100:3000'
```

### Uso

```typescript
import { authApi } from './services'

// Login
const response = await authApi.login({ email, password })

// Logout
await authApi.logout()

// Obtener usuario actual
const me = await authApi.me()
```

## 🚀 Comandos

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm start

# Android
npm run android

# iOS
npm run ios

# Web
npm run web
```

## 📝 Convenciones de Nomenclatura

### Pantallas
- Prefijo `P_` seguido del nombre del módulo
- Ejemplos: `P_Auth`, `P_Principal`, `P_Usuarios`, `P_Tickets`

### Componentes
- PascalCase: `ActionButton.tsx`, `PermissionBadge.tsx`
- Exportar desde `index.ts`

### Tipos
- Interfaces: `User`, `LoginRequest`
- Types: `UserRole`, `RootStackParamList`

## 🔧 Próximos Pasos

1. **Configurar la URL del backend** en `src/constants/index.ts`
2. **Crear nuevas pantallas** siguiendo el patrón `P_NombreCarpeta/`
3. **Agregar componentes reutilizables** en `src/components/`
4. **Implementar navegación entre pantallas** en `AppNavigator.tsx`
5. **Agregar más servicios API** en `src/services/`

## 📦 Dependencias Principales

- `tamagui` - UI Framework
- `@react-navigation/native` - Navegación
- `axios` - HTTP Client
- `zustand` - Estado global
- `expo` - SDK de Expo
