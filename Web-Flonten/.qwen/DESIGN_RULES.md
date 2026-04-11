# 📐 DESIGN RULES - Reglas de Consistencia de Diseño

> **REGLAS OBLIGATORIAS para mantener consistencia visual en todo el proyecto**
> 
> **Propósito:** Que NUNCA haya un "desparpajo" de estilos diferentes

---

## 🚨 REGLAS FUNDAMENTALES

### Regla #1: UN SOLO SISTEMA DE DISEÑO

✅ **CORRECTO:**
- Todos los componentes usan `src/components/design-system/`
- Mismos tokens de Tamagui en toda la app
- Mismos patrones de componentes

❌ **INCORRECTO:**
- Crear estilos inline en cada pantalla
- Usar `StyleSheet.create()` con colores hardcodeados
- Mezclar Tamagui con React Native StyleSheet

### Regla #2: IMPORTAR DESDE DESIGN SYSTEM

✅ **CORRECTO:**
```tsx
import { Text, Button, Card, ScreenLayout, Stack, HStack } 
  from '../../components/design-system';
```

❌ **INCORRECTO:**
```tsx
import { Text } from 'tamagui'; // Sin usar design-system
import { createStyleSheet } from 'react-native'; // No usar
```

### Regla #3: USAR TOKENS, NO HARDCODEAR

✅ **CORRECTO:**
```tsx
<Card bg="$primary" p="$4" br="$lg">
  <Text c="$color" variant="body">Hola</Text>
</Card>
```

❌ **INCORRECTO:**
```tsx
<Card backgroundColor="#007AFF" padding={16} borderRadius={16}>
  <Text color="#000000" fontSize={17}>Hola</Text>
</Card>
```

### Regla #4: COMPONENTES REUTILIZABLES PRIMERO

**Antes de crear un nuevo componente:**
1. Verificar si existe en `design-system/`
2. Si existe → usarlo
3. Si no existe → agregarlo a `design-system/` (no crear local)

### Regla #5: MIGRAR, NO DUPLICAR

Si encuentras código con estilos old/no-Tamagui:
1. NO dejar que coexistan
2. Migrar al sistema de diseño
3. Eliminar código viejo

---

## 🎨 REGLAS DE ESTILO

### Colores

✅ **USAR:**
- Tokens de Tamagui: `$primary`, `$secondary`, `$success`, etc.
- Theme colors: `$color`, `$color2`, `$background`, `$background2`

❌ **NUNCA USAR:**
- Hardcoded hex: `#007AFF`, `#FFFFFF`, `#f5f5f5`
- RGBA inline: `rgba(0, 0, 0, 0.5)`
- Named colors: `red`, `blue`, `white`

### Tipografía

✅ **USAR:**
- Variantes de Text: `variant="h1"`, `variant="body"`, `variant="caption"`
- Tokens de tamaño: `fontSize="$md"`, `fontSize="$lg"`

❌ **NUNCA USAR:**
- Números directos: `fontSize={17}`, `fontSize={24}`
- Font weight inline: `fontWeight="600"` (usar variante `label` o `h5`)

### Espaciado

✅ **USAR:**
- Tokens: `p="$4"`, `gap="$3"`, `m="$2"`
- Shorthands: `p`, `px`, `py`, `m`, `mx`, `my`

❌ **NUNCA USAR:**
- Números: `padding={16}`, `margin={8}`
- Pixel values: `paddingTop={20}`

### Border Radius

✅ **USAR:**
- Tokens: `br="$md"`, `br="$lg"`, `br="$full"`

❌ **NUNCA USAR:**
- Números: `borderRadius={12}`, `borderRadius={9999}`

### Sombras

✅ **USAR:**
- Tokens: `shadow="$sm"`, `shadow="$md"`, `shadow="$lg"`

❌ **NUNCA USAR:**
- Shadow object inline: `shadowColor: '#000', shadowOffset: {...}`

---

## 🏗️ REGLAS DE ARQUITECTURA DE COMPONENTES

### Estructura de Carpetas

```
src/components/
├── design-system/          # ✅ Sistema de diseño oficial
│   ├── Text.tsx            # Tipografía
│   ├── Button.tsx          # Botones + IconButton
│   ├── Card.tsx            # Cards + PressableCard
│   ├── Layout.tsx          # Stack, HStack, ScreenLayout, ScreenSection
│   ├── Header.tsx          # Headers de pantalla
│   ├── Input.tsx           # Inputs de formulario
│   ├── Badge.tsx           # Badges y chips
│   ├── Avatar.tsx          # Avatares de usuario
│   ├── Skeleton.tsx        # Loading placeholders
│   ├── Modal.tsx           # Modales y dialogs
│   ├── Toast.tsx           # Notificaciones
│   └── index.ts            # Export oficial
│
├── common/                 # Componentes comunes del proyecto
│   ├── ModuleCard.tsx      # Cards de módulos en Home
│   ├── PermissionChip.tsx  # Chips de permisos
│   └── EmptyState.tsx      # Estados vacíos
│
└── [module-specific]/     # Componentes específicos de módulo
    └── (solo si NO sirve en design-system)
```

### Reglas de Ubicación

| Tipo de Componente | Dónde va |
|--------------------|----------|
| Botón genérico | `design-system/Button.tsx` |
| Card genérica | `design-system/Card.tsx` |
| Text con estilos | `design-system/Text.tsx` |
| Input de form | `design-system/Input.tsx` |
| Componente de módulo específico | `src_[Modulo]/components/` |
| Componente compartido entre módulos | `src/components/common/` |

### Patrón de Componente

```tsx
// src/components/design-system/NuevoComponente.tsx

import React from 'react';
import { YStack, XStack, Text as TamaguiText, type YStackProps } from 'tamagui';

// Interface con tipos
export interface NuevoComponenteProps {
  title: string;
  variant?: 'default' | 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  onPress?: () => void;
}

// Componente
export const NuevoComponente: React.FC<NuevoComponenteProps> = ({
  title,
  variant = 'default',
  size = 'md',
  onPress,
}) => {
  return (
    <YStack gap="$3">
      <TamaguiText
        variant={size === 'sm' ? 'caption' : 'body'}
        c={variant === 'primary' ? '$primary' : '$color'}
      >
        {title}
      </TamaguiText>
    </YStack>
  );
};
```

---

## 🔄 REGLAS DE MIGRACIÓN

### Cuándo Migrar

**Se DEBE migrar cuando:**
- Se encuentra código con `StyleSheet.create()`
- Hay colores hardcodeados (`#007AFF`)
- Se usan componentes de React Native en lugar de Tamagui
- Hay duplicación de estilos

### Proceso de Migración

1. **Identificar** componentes no-Tamagui
2. **Mapear** colores hardcodeados → tokens Tamagui
3. **Reemplazar** `View` → `YStack`/`XStack`
4. **Reemplazar** `Text` → `Text` de design-system
5. **Reemplazar** `TouchableOpacity` → `Pressable` de Tamagui
6. **Eliminar** `StyleSheet.create()`
7. **Testear** que se vea igual o mejor
8. **Documentar** en DESIGN_SYSTEM.md

### Mapeo de Colores Comunes

| Color Hardcodeado | Token Tamagui |
|-------------------|---------------|
| `#007AFF` | `$primary` |
| `#5856D6` | `$secondary` |
| `#34C759` | `$success` |
| `#FF9500` | `$warning` |
| `#FF3B30` | `$error` |
| `#FFFFFF` | `$backgroundSecondary` |
| `#F2F2F7` | `$background` |
| `#000000` | `$color` o `$text` |
| `#8E8E93` | `$color3` o `$textTertiary` |
| `#D1D1D6` | `$border` |
| `#E5E5EA` | `$borderSubtle` |

---

## 📋 CHECKLIST DE REVISIÓN DE DISEÑO

**Antes de hacer merge de cualquier cambio de diseño:**

- [ ] Todos los colores son tokens de Tamagui
- [ ] No hay colores hardcodeados
- [ ] Usa componentes de design-system
- [ ] No crea estilos duplicados
- [ ] Tipografía usa variantes de Text
- [ ] Espaciado usa tokens ($1, $2, $3, etc.)
- [ ] Border radius usa tokens
- [ ] Sombras usan tokens
- [ ] Responsive (funciona en móvil y tablet)
- [ ] Accesible (contraste WCAG AA)
- [ ] Dark mode funciona
- [ ] Actualizado en DESIGN_SYSTEM.md

---

## ⚠️ ARCHIVOS QUE REQUIEREN MIGRACIÓN

**Lista de archivos que NO usan Tamagui actualmente:**

| Archivo | Estado | Acción Requerida |
|---------|--------|-----------------|
| `src_Instalaciones_STV/screens/DetalleInstalacionScreen.tsx` | ❌ StyleSheet | Migrar a Tamagui |
| `src_Instalaciones_STV/screens/RegistroInstalacionScreen.tsx` | ❌ StyleSheet | Migrar a Tamagui |
| `src_Instalaciones_STV/screens/RegistroAreaScreen.tsx` | ❌ StyleSheet | Migrar a Tamagui |
| `src_Instalaciones_STV/components/RegistroInstalacionForm.tsx` | ❌ StyleSheet | Migrar a Tamagui |
| `src_Instalaciones_STV/components/RegistroAreaForm.tsx` | ❌ StyleSheet | Migrar a Tamagui |
| `src_Chat_STV/screens/Componets_Correos/views/.../EmailContentViewer.tsx` | ⚠️ Mezclado | Unificar a Tamagui |
| `src_Chat_STV/screens/Componets_Correos/views/.../AttachmentPreview.tsx` | ⚠️ Hardcoded colors | Usar tokens |

---

## 🎯 METAS DE CONSISTENCIA

**Meta a corto plazo (1 semana):**
- [ ] Migrar todos los archivos de Instalaciones a Tamagui
- [ ] Eliminar todos los colores hardcodeados
- [ ] Agregar componentes faltantes a design-system

**Meta a medio plazo (1 mes):**
- [ ] 100% de pantallas usan design-system
- [ ] Cero StyleSheet.create() en el proyecto
- [ ] Todos los módulos documentados en DESIGN_SYSTEM.md

**Meta a largo plazo:**
- [ ] Design system publicado como paquete independiente
- [ ] Storybook de componentes
- [ ] Tests visuales automatizados

---

> **REGLA DE ORO:** Si no está en el design system y no puedes agregarlo, NO lo inventes. Consulta con el equipo de diseño.
