# 🚀 Quick Start Guide - C Ticket STV v2.0

## ⚠️ Importante: Instala la dependencia faltante

Para que funcione la navegación con tabs inferiores, necesitas instalar el paquete:

```bash
npm install @react-navigation/bottom-tabs
```

O si usas yarn:

```bash
yarn add @react-navigation/bottom-tabs
```

## 📦 Instalación Completa

### Paso 1: Instalar dependencias

```bash
# Navega al directorio del proyecto
cd C_Ticket_Apk_STV

# Instala todas las dependencias
npm install

# O específicamente el bottom tabs
npm install @react-navigation/bottom-tabs
```

### Paso 2: Verificar instalación

```bash
# Verifica que esté en package.json
npm list @react-navigation/bottom-tabs
```

### Paso 3: Iniciar la app

```bash
# Iniciar Expo
npm start

# O directamente en un dispositivo
npm run android
# o
npm run ios
```

## 🎯 Cómo Probar el Nuevo Diseño

### Opción 1: Desde el Dashboard Principal

1. Inicia la aplicación
2. Inicia sesión con cualquier usuario
3. Verás el **nuevo dashboard** con:
   - Header con gradiente azul-púrpura
   - Tu tarjeta de usuario con avatar gradiente
   - Cards de módulos con colores por módulo
   - Animaciones suaves al presionar

### Opción 2: Desde los Tabs Inferiores

1. Después de ver el dashboard, toca "Ir a Main Tabs"
2. Verás la **tab bar inferior** con 5 tabs:
   - 🏠 Inicio
   - 🏢 Instalaciones
   - 💬 Chat
   - 📁 Archivero
   - 🎫 Tickets
3. Toca cualquier tab para navegar
4. ¡La navegación es instantánea y suave!

## 🎨 Componentes Disponibles

### Usar en tus pantallas:

```typescript
import {
  Text,
  Button,
  Card,
  ScreenLayout,
  Stack,
  HStack,
  Loading,
  EmptyState,
  ErrorState,
} from '../../components/design-system'

// Ejemplo rápido
export default function MiPantalla() {
  return (
    <ScreenLayout>
      <Text variant="h3" fontWeight="700">Mi Pantalla</Text>
      
      <Button 
        title="Guardar" 
        variant="primary" 
        size="lg"
        onPress={() => console.log('Guardado')}
      />
      
      <Card variant="elevated" padding={20}>
        <Text>Contenido del Card</Text>
      </Card>
    </ScreenLayout>
  )
}
```

## 🔧 Estructura de Archivos

```
C_Ticket_Apk_STV/
├── src/
│   ├── navigation/
│   │   ├── AppNavigator.tsx ← Stack principal
│   │   ├── MainTabs.tsx ← Bottom tabs (NUEVO)
│   │   └── index.ts
│   ├── screens/
│   │   └── P_Principal/
│   │       └── HomeScreen.tsx ← Rediseñado
│   ├── components/
│   │   └── design-system/
│   │       ├── Button.tsx ← Profesional
│   │       ├── Card.tsx ← Moderno
│   │       ├── Layout.tsx ← Completo
│   │       └── index.ts
│   └── types/
│       └── index.ts ← Tipos actualizados
│
├── src_P_Ticket_IT/
│   └── screens/
│       └── TicketHomeScreen.tsx ← Rediseñado
│
└── Documentación/
    ├── DESIGN_SYSTEM.md ← Guía completa
    └── REDESIGN_COMPLETE.md ← Resumen del cambio
```

## 🎯 Qué se ha Cambiado

### ✅ Completado:
- Bottom Tab Navigation (estilo Google/Microsoft)
- HomeScreen con gradientes y animaciones
- Button system profesional
- Card system moderno
- Layout system completo
- Loading, Empty, Error states
- TicketHomeScreen rediseñado
- Documentación completa

### 🔄 Listo para actualizar:
- src_Instalaciones_STV
- src_Chat_STV
- src_Archivero_STV

## 📱 Flujo de Navegación Actual

```
Login
  ↓
HomeScreen (Dashboard principal)
  ↓
MainTabs (Bottom tabs)
  ├─ 🏠 Inicio → HomeScreen
  ├─ 🏢 Instalaciones → InstalacionNavigator
  ├─ 💬 Chat → ChatNavigator
  ├─ 📁 Archivero → ArchiveroNavigator
  └─ 🎫 Tickets → TicketNavigator
```

## 🐛 Solución de Problemas

### Error: "Cannot find module @react-navigation/bottom-tabs"

```bash
npm install @react-navigation/bottom-tabs
```

### Error de TypeScript en MainTabs.tsx

Asegúrate de que los tipos estén correctos en `src/types/index.ts`:

```typescript
export type MainTabParamList = {
  HomeTab: undefined
  InstalacionesTab: undefined
  ChatTab: undefined
  ArchiveroTab: undefined
  TicketsTab: undefined
}
```

### Las animaciones no funcionan

Verifica que `useNativeDriver: true` esté en todas las animaciones.

## 📚 Documentación Completa

- **DESIGN_SYSTEM.md** - Guía completa del sistema de diseño
- **REDESIGN_COMPLETE.md** - Resumen del rediseño
- **src/components/design-system/** - Componentes con ejemplos

## 🎨 Paleta de Colores

```
Primary:   #007AFF (Azul)
Secondary: #5856D6 (Púrpura)
Success:   #34C759 (Verde)
Warning:   #FF9500 (Naranja)
Error:     #FF3B30 (Rojo)
```

## 🚀 Próximos Pasos

1. **Instalar dependencia**: `npm install @react-navigation/bottom-tabs`
2. **Probar la app**: `npm start`
3. **Actualizar módulos restantes** con el nuevo design system
4. **Conectar a API** para datos reales
5. **Agregar más pantallas** a cada módulo

---

**¡Listo!** Tu app ahora tiene un diseño profesional nivel Google/Microsoft 🎉
