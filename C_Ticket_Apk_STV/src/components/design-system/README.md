# Sistema de Diseño Global - C Ticket STV

## 📁 Estructura

```
src/components/design-system/
├── Text.tsx          # Componente de texto con variantes tipográficas
├── Button.tsx        # Botones y IconButton
├── Card.tsx          # Cards con variantes visuales
├── Layout.tsx        # Componentes de layout (Stack, HStack, ScreenLayout)
├── Header.tsx        # Header de pantalla reutilizable
└── index.ts          # Exportaciones
```

## 🎨 Tokens de Diseño

### Colores Principales
- `$primary` - Azul principal (#2563eb)
- `$secondary` - Violeta (#7c3aed)
- `$success` - Verde (#10b981)
- `$warning` - Amarillo (#f59e0b)
- `$error` - Rojo (#ef4444)

### Colores de Texto
- `$color` - Texto principal
- `$color2` - Texto secundario
- `$color3` - Texto terciario
- `$color4` - Texto muted

### Colores Muted (fondos suaves)
- `$successMuted` - Fondo verde claro
- `$errorMuted` - Fondo rojo claro
- `$warningMuted` - Fondo amarillo claro
- `$primaryMuted` - Fondo azul claro

### Espaciado
- `$xs` - 4px
- `$sm` - 8px
- `$md` - 12px
- `$lg` - 16px
- `$xl` - 20px
- `$2xl` - 24px
- `$3xl` - 32px

### Bordes Redondeados
- `$xs` - 4px
- `$sm` - 6px
- `$md` - 8px
- `$lg` - 12px
- `$xl` - 16px
- `$2xl` - 20px

## 📝 Componentes

### Text
Texto con variantes tipográficas predefinidas.

```tsx
import { Text } from '../../components/design-system'

// Variantes disponibles
<Text variant="h1">Título H1 (32px, bold)</Text>
<Text variant="h2">Título H2 (28px, bold)</Text>
<Text variant="h3">Título H3 (24px, bold)</Text>
<Text variant="h4">Título H4 (20px, semibold)</Text>
<Text variant="h5">Título H5 (18px, semibold)</Text>
<Text variant="h6">Título H6 (16px, semibold)</Text>
<Text variant="body">Texto normal (16px)</Text>
<Text variant="bodySmall">Texto pequeño (14px)</Text>
<Text variant="caption">Caption (12px)</Text>
<Text variant="label">Label (14px, semibold)</Text>
<Text variant="labelSmall">Label pequeño (12px, semibold)</Text>

// Props adicionales
<Text variant="body" color="$primary" align="center">
  Texto centrado azul
</Text>
```

### Button
Botón con variantes de tamaño y color.

```tsx
import { Button } from '../../components/design-system'

// Variantes
<Button title="Primario" onPress={() => {}} variant="primary" />
<Button title="Secundario" onPress={() => {}} variant="secondary" />
<Button title="Error" onPress={() => {}} variant="error" />
<Button title="Outline" onPress={() => {}} variant="outline" />
<Button title="Ghost" onPress={() => {}} variant="ghost" />

// Tamaños
<Button title="XS" size="xs" onPress={() => {}} />
<Button title="Small" size="sm" onPress={() => {}} />
<Button title="Medium" size="md" onPress={() => {}} />
<Button title="Large" size="lg" onPress={() => {}} />
<Button title="XL" size="xl" onPress={() => {}} />

// Con ícono
<Button title="Con ícono" icon="add" onPress={() => {}} />
<Button title="Ícono derecha" icon="arrow-forward" iconPosition="right" onPress={() => {}} />

// Loading y disabled
<Button title="Cargando" loading onPress={() => {}} />
<Button title="Deshabilitado" disabled onPress={() => {}} />

// Full width
<Button title="Ancho completo" fullWidth onPress={() => {}} />
```

### IconButton
Botón solo con ícono para acciones puntuales.

```tsx
import { IconButton } from '../../components/design-system'

<IconButton
  icon="exit"
  onPress={handleLogout}
  variant="error"
  size={22}
/>

<IconButton
  icon="arrow-back"
  onPress={() => navigation.goBack()}
  variant="ghost"
  size={24}
/>
```

### Card
Contenedor con variantes visuales.

```tsx
import { Card, PressableCard } from '../../components/design-system'

// Card normal
<Card variant="default" padding="$4">
  <Text variant="body">Contenido</Text>
</Card>

// Card con sombra elevada
<Card variant="elevated" padding="$5">
  <Text variant="body">Contenido</Text>
</Card>

// Card con borde
<Card variant="outlined" padding="$4">
  <Text variant="body">Contenido</Text>
</Card>

// Card con fondo relleno
<Card variant="filled" padding="$4">
  <Text variant="body">Contenido</Text>
</Card>

// Card clickeable
<PressableCard
  variant="outlined"
  onPress={() => navigation.navigate('Detail')}
  padding="$4"
>
  <Text variant="body">Tocar para navegar</Text>
</PressableCard>

// Props personalizadas
<Card
  backgroundColor="$primary"
  padding="$6"
  borderRadius={20}
  overflow="hidden"
>
  <Text variant="h4" color="white">Header</Text>
</Card>
```

### Layout

#### Stack (Vertical)
```tsx
import { Stack } from '../../components/design-system'

<Stack gap="$3">
  <Text>Item 1</Text>
  <Text>Item 2</Text>
  <Text>Item 3</Text>
</Stack>
```

#### HStack (Horizontal)
```tsx
import { HStack } from '../../components/design-system'

<HStack gap="$3" align="center" justify="space-between">
  <Text> Izquierda</Text>
  <Text>Derecha</Text>
</HStack>

// align: 'start' | 'center' | 'end' | 'stretch'
// justify: 'start' | 'center' | 'end' | 'space-between' | 'space-around'
```

#### ScreenLayout
Layout principal de pantalla con scroll automático.

```tsx
import { ScreenLayout } from '../../components/design-system'

<ScreenLayout scrollable={true} padding="$4">
  {/* Contenido de la pantalla */}
  <Text variant="h3">Mi Pantalla</Text>
  <Text variant="body">Contenido scrolleable</Text>
</ScreenLayout>
```

#### ScreenSection
Sección dentro de una pantalla.

```tsx
import { ScreenSection } from '../../components/design-system'

<ScreenSection title="Usuarios">
  <Card variant="outlined">
    <Text>Lista de usuarios</Text>
  </Card>
</ScreenSection>
```

### Header
Header reutilizable para pantallas.

```tsx
import { Header } from '../../components/design-system'

<Header
  title="Usuarios"
  subtitle="Gestión de usuarios del sistema"
  showBackButton={true}
  rightAction={{
    icon: 'add',
    onPress: handleAddUser
  }}
  avatar={{
    icon: 'people',
    size: 40
  }}
  variant="primary" // o 'default'
/>
```

## 🚀 Ejemplo Completo

```tsx
import React from 'react'
import {
  Text,
  Button,
  IconButton,
  Card,
  ScreenLayout,
  Stack,
  HStack,
} from '../../components/design-system'
import { useResponsive } from '../../components/useResponsive'

export default function MiPantalla() {
  const { isMobile } = useResponsive()

  return (
    <ScreenLayout>
      {/* Header */}
      <Card backgroundColor="$primary" padding="$5">
        <HStack justify="space-between">
          <Stack flex={1}>
            <Text variant="h4" color="white" fontWeight="800">
              Mi App
            </Text>
            <Text variant="bodySmall" color="rgba(255,255,255,0.8)">
              Descripción
            </Text>
          </Stack>
          <IconButton icon="settings" onPress={handleSettings} variant="ghost" size={24} />
        </HStack>
      </Card>

      {/* Contenido */}
      <Stack gap="$4">
        <Text variant="h5">Sección Principal</Text>
        
        <Card variant="outlined" padding="$4">
          <Text variant="body">Contenido de la card</Text>
        </Card>

        <Button title="Acción Principal" fullWidth onPress={handleAction} />
        <Button title="Secundaria" variant="outline" fullWidth onPress={handleSecondary} />
      </Stack>
    </ScreenLayout>
  )
}
```

## 📱 Responsive

```tsx
import { useResponsive } from '../../components/useResponsive'

const { isMobile, isTablet, isDesktop, width, height } = useResponsive()

// Uso en componentes
<Card padding={isMobile ? '$4' : '$6'}>
  <Text variant={isMobile ? 'h5' : 'h4'}>Título Responsive</Text>
</Card>
```

## 🎯 Buenas Prácticas

1. **Usa variantes de texto** en lugar de `fontSize` directo
2. **Usa tokens de espaciado** (`$sm`, `$md`, etc.) en lugar de números
3. **Usa componentes del design system** antes que componentes raw de Tamagui
4. **Mantén consistencia** en botones, cards y textos en toda la app
5. **Usa `useResponsive`** para adaptar tamaños según dispositivo

## ⚠️ Notas Importantes

- Los tokens `successMuted`, `errorMuted`, `warningMuted` están definidos en `tamagui.config.ts`
- El tamaño mínimo legible de texto es `bodySmall` (14px)
- Evita usar `fontSize` con valores numéricos directamente, usa las variantes de `Text`
- Todos los botones tienen altura mínima de 44px (tamaño `md`) para accesibilidad
