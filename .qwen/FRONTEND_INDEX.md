# 📱 ÍNDICE DEL FRONTEND - C_Ticket_Apk_STV/

> **Mapa detallado de archivos y rutas del frontend React Native**
> 
> **Propósito:** Referencia rápida para localizar archivos y entender la estructura

---

## 🗺️ MAPA PRINCIPAL DE ARCHIVOS

### Entry Points

```
C_Ticket_Apk_STV/
├── package.json                    # Dependencias y scripts
├── tsconfig.json                   # Configuración TypeScript
├── app.json                        # Configuración de Expo
├── babel.config.js                 # Configuración Babel
├── App.tsx                         # 🚀 COMPONENTE RAÍZ
├── index.ts                        # Entry point de la app
├── .expo/                          # Configuración de Expo
├── assets/                         # Imágenes, iconos, recursos
└── src/                            # 📁 CÓDIGO FUENTE PRINCIPAL
```

---

## 📁 ESTRUCTURA DE src/

### 🖼️ Screens (Pantallas)
**Ruta:** `src/screens/`
**Convención:** Prefijo `P_` para módulos (P_Auth, P_Principal, etc.)

```
src/screens/
├── index.ts                        # Export central de screens
├── P_Auth/                         # 🔐 MÓDULO DE AUTENTICACIÓN
│   ├── index.ts
│   └── LoginScreen.tsx             # Pantalla de login
│
├── P_Principal/                    # 🏠 MÓDULO PRINCIPAL
│   ├── index.ts
│   └── HomeScreen.tsx              # Pantalla home después de login
│
└── Components_Usuarios/            # 👥 COMPONENTES DE USUARIOS
    └── (varios componentes)
```

**Agregar nueva pantalla:**
1. Crear carpeta `src/screens/P_NombreModulo/`
2. Crear `NombreScreen.tsx`
3. Crear `index.ts` para exportar
4. Agregar ruta en `src/navigation/AppNavigator.tsx`

---

### 🧭 Navigation (Navegación)
**Ruta:** `src/navigation/`

| Archivo | Función |
|---------|---------|
| `AppNavigator.tsx` | ⭐ **CRÍTICO** - Configuración de React Navigation |
| `index.ts` | Export del navigator |

**Stack principal:**
```
RootStack
├── Login (P_Auth)
├── Home (P_Principal)
└── ... (más pantallas)
```

---

### 🗄️ Store (Estado Global - Zustand)
**Ruta:** `src/store/`

| Archivo | Función |
|---------|---------|
| `authStore.ts` | ⭐ Estado de autenticación: user, login, logout, permisos |
| `index.ts` | Export del store |

**Estado que maneja:**
```typescript
// authStore.ts
{
  user: User | null,
  isAuthenticated: boolean,
  hasPermission(permission: string): boolean,
  hasRole(role: string | string[]): boolean,
  login(credentials): Promise<void>,
  logout(): void,
  // ... más acciones
}
```

**Uso típico:**
```typescript
import { useAuthStore } from './store';

const { user, login, logout, hasPermission } = useAuthStore();
```

---

### 📡 Services (Llamadas API)
**Ruta:** `src/services/`

| Archivo | Función |
|---------|---------|
| `api.ts` | Configuración de Axios (base URL, interceptores) |
| `auth.service.ts` | Llamadas API de autenticación (login, register, me) |
| `userService.ts` | Llamadas API de usuarios (CRUD) |
| `emailService.ts` | Llamadas API de email |
| `index.ts` | Export central de servicios |

**Endpoints configurados:**
```typescript
// auth.service.ts
authApi.login(credentials)
authApi.register(userData)
authApi.me()
authApi.logout()

// userService.ts
usersApi.getAll()
usersApi.getById(id)
usersApi.update(id, data)
usersApi.delete(id)
```

**Configuración de API:**
```typescript
// src/constants/index.ts
export const API_URL = 'http://192.168.1.100:3000' // ⭐ Cambiar aquí
```

---

### 🎨 Components (Componentes Reutilizables)
**Ruta:** `src/components/`

| Archivo | Función |
|---------|---------|
| `Button.tsx` | Componente de botón reutilizable |
| `index.ts` | Export de componentes |
| `useResponsive.ts` | Hook para diseño responsivo |
| `design-system/` | Sistema de diseño (componentes UI) |

---

### 🎭 Constants
**Ruta:** `src/constants/`

| Archivo | Función |
|---------|---------|
| `index.ts` | ⭐ Constantes globales: API_URL, roles, colores, endpoints |

**Contenido típico:**
```typescript
export const API_URL = 'http://192.168.1.100:3000';
export const ROLES = {
  ADMIN: 'admin',
  IT: 'it',
  RH: 'rh',
  SUPERVISOR: 'supervisor',
  VIGILANTE: 'vigilante',
};
// Colores, endpoints, etc.
```

---

### 🏗️ Hooks (Custom Hooks)
**Ruta:** `src/hooks/`

| Hook | Función |
|------|---------|
| `usePermissions` | Verificar permisos del usuario actual |

**Uso típico:**
```typescript
import { usePermissions } from './hooks';

const { can, is, user, isAuthenticated } = usePermissions();

if (can('create')) { /* ... */ }
if (is('admin')) { /* ... */ }
```

---

### 📝 Types (TypeScript Types)
**Ruta:** `src/types/`

**Contiene:**
- Interfaces de TypeScript
- Types para API responses
- Types para navegación (ParamLists)
- Types para entidades (User, Ticket, etc.)

---

### 🛠️ Utils (Funciones Utilitarias)
**Ruta:** `src/utils/`

**Contiene:**
- Funciones helper
- Formateadores
- Validadores
- Constantes calculadas

---

### 📚 Lib (Configuraciones)
**Ruta:** `src/lib/`

**Contiene:**
- Configuración de Tamagui
- Configuración de temas
- Providers

---

### 📦 Modules (Módulos - Vacío)
**Ruta:** `src/modules/`

**Estado:** Vacío (disponible para futuros módulos)

---

## 🎨 TAMAGUI - UI FRAMEWORK

### Componentes Disponibles
```typescript
import { YStack, XStack, Text, Button, Input, Card, Spinner } from 'tamagui';
```

### Shortharms (Atajos)
| Shorthand | Equivalente |
|-----------|-------------|
| `f` | `flex` |
| `ai` | `alignItems` |
| `jc` | `justifyContent` |
| `fd` | `flexDirection` |
| `p` | `padding` |
| `px` | `paddingHorizontal` |
| `py` | `paddingVertical` |
| `m` | `margin` |
| `mx` | `marginHorizontal` |
| `my` | `marginVertical` |
| `w` | `width` |
| `h` | `height` |
| `bg` | `backgroundColor` |
| `c` | `color` |
| `br` | `borderRadius` |

### Variables de Tema
```typescript
// Colores disponibles con $
$background, $background2, $background3
$color, $color2, $color3
$primary, $secondary
$success, $warning, $error
$borderColor
```

**Ejemplo de uso:**
```tsx
<YStack f={1} bg="$background" p="$4">
  <Text c="$color">Hola Mundo</Text>
</YStack>
```

---

## 🔗 RUTAS DE IMPORTACIÓN TÍPICAS

### Componentes
```typescript
// Importar componentes UI
import { Button } from '../../components/Button';
import { YStack, XStack, Text, Card } from 'tamagui';

// Importar screens
import { LoginScreen } from '../screens/P_Auth';
```

### Store y Estado
```typescript
// Importar store
import { useAuthStore } from '../../store';
import { useAuthStore } from '../../store/authStore';

// Importar tipos
import type { User, LoginRequest } from '../../types';
```

### Servicios API
```typescript
// Importar servicios
import { authApi, usersApi } from '../../services';
import { api } from '../../services/api';

// Importar constantes
import { API_URL } from '../../constants';
```

### Navegación
```typescript
// Importar navegación
import { useNavigation } from '@react-navigation/native';
import { AppNavigator } from '../../navigation';

// Types de navegación
import type { RootStackParamList } from '../../types';
```

### Hooks
```typescript
// Importar hooks personalizados
import { usePermissions } from '../../hooks';
import { useResponsive } from '../../components/useResponsive';
```

---

## 📱 OTROS MÓDULOS FRONTEND

### Archivero STV
**Ruta:** `src_Archivero_STV/`
**Propósito:** Gestión documental y archivos

### Chat STV
**Ruta:** `src_Chat_STV/`
**Propósito:** Módulo de chat empresarial

### Instalaciones STV
**Ruta:** `src_Instalaciones_STV/`
**Propósito:** Gestión de instalaciones

### P_Ticket_IT
**Ruta:** `src_P_Ticket_IT/`
**Propósito:** Módulo de tickets IT

---

## 📊 FLUJO DE AUTENTICACIÓN

```
1. App.tsx
   └── Provider (Tamagui, Navigation)
       └── AppNavigator
           └── Verifica autenticación (useAuthStore)
               ├── NO autenticado → LoginScreen (P_Auth)
               └── SI autenticado → HomeScreen (P_Principal)

2. LoginScreen
   └── authApi.login(credentials)
       └── useAuthStore.login(userData)
           └── Navega a HomeScreen

3. HomeScreen
   └── Verifica permisos con usePermissions
       └── Muestra UI según rol
```

---

## 🚨 REGLAS IMPORTANTES

1. **Siempre usar** el store (`useAuthStore`) para estado de autenticación
2. **No hardcodear** URLs de API - usar `API_URL` de constants
3. **Usar Tamagui** para estilos - no usar StyleSheet.create de React Native
4. **Prefijo `P_`** para carpetas de screens (P_Auth, P_Usuarios, etc.)
5. **Exportar desde** `index.ts` en cada carpeta
6. **Verificar permisos** con `hasPermission()` o `usePermissions()` antes de mostrar UI
7. **Configurar red** - backend y frontend deben estar en la misma red WiFi

---

## 📌 PUNTOS CLAVE PARA MODIFICACIONES

| Necesito... | Ve a... |
|-------------|---------|
| Agregar pantalla | `src/screens/P_NombreModulo/NombreScreen.tsx` |
| Cambiar navegación | `src/navigation/AppNavigator.tsx` |
| Modificar auth | `src/store/authStore.ts` |
| Agregar servicio API | `src/services/nuevo.service.ts` |
| Cambiar URL backend | `src/constants/index.ts` |
| Agregar componente UI | `src/components/NombreComponent.tsx` |
| Modificar tema Tamagui | `src/lib/` |
| Agregar tipos | `src/types/` |

---

> **NOTA:** Este índice debe actualizarse cuando se agreguen nuevos módulos o pantallas.
