# 🎨 DESIGN SYSTEM - Registro Completo de Estilos STV Global

> **REGISTRO MAESTRO de TODOS los estilos y diseños Tamagui**
> 
> **⚠️ IMPORTANTE:** Este archivo protege los diseños. NUNCA cambiar estilos sin pedir confirmación explícita.
> 
> **Propósito:** Que cada componente, screen y módulo mantenga su diseño original y no se pierda al hacer modificaciones.

---

## 🚨 REGLA DE PROTECCIÓN DE DISEÑOS

### CUANDO MODIFICAR CÓDIGO:
1. ✅ **PODES** cambiar lógica, imports, funcionalidad
2. ❌ **NO CAMBIES** estilos Tamagui a menos que se pida EXPLÍCITAMENTE
3. ✅ **PODES** agregar nuevos estilos (no modificar existentes)
4. ❌ **NO ELIMINES** estilos existentes sin confirmar
5. ✅ **PODES** agregar variantes nuevas
6. ❌ **NO MODIFIQUES** tokens de color, spacing, size en tamagui.config.ts

### SI NECESITAS CAMBIAR DISEÑO:
1. Preguntar al usuario EXPLÍCITAMENTE qué quiere cambiar
2. Mostrar el diseño ANTES y el diseño DESPUÉS propuesto
3. Esperar confirmación antes de modificar
4. Si se confirma, actualizar este archivo con el nuevo diseño

---

## 📚 SISTEMA DE DISEÑO BASE

### Configuración Principal
**Archivo:** `src/lib/tamagui.config.ts`

### Colores Disponibles (30+ tokens)

| Token | Valor | Uso |
|-------|-------|-----|
| `$text` | `#000000` | Texto principal |
| `$textSecondary` | `#3C3C43` | Texto secundario |
| `$textTertiary` | `#8E8E93` | Texto terciario |
| `$textMuted` | `#C7C7CC` | Texto deshabilitado |
| `$background` | `#F2F2F7` | Fondo principal |
| `$backgroundSecondary` | `#FFFFFF` | Fondo cards/elevado |
| `$backgroundTertiary` | `#F9F9F9` | Fondo sutil |
| `$primary` | `#007AFF` | ✅ Botones, links, acciones principales |
| `$primaryLight` | `#409CFF` | Hover states |
| `$primaryDark` | `#0055D4` | Active states |
| `$primaryMuted` | `#E5F1FF` | Fondos suaves primarios |
| `$secondary` | `#5856D6` | 💜 Acciones secundarias |
| `$success` | `#34C759` | ✅ Éxito, completado |
| `$successMuted` | `#E3F9E8` | Fondo éxito suave |
| `$warning` | `#FF9500` | ⚠️ Advertencias |
| `$warningMuted` | `#FFF3E0` | Fondo advertencia |
| `$error` | `#FF3B30` | ❌ Errores, eliminar |
| `$errorMuted` | `#FFE5E3` | Fondo error suave |
| `$info` | `#5AC8FA` | ℹ️ Información |
| `$infoMuted` | `#E5F7FD` | Fondo info |
| `$border` | `#D1D1D6` | Bordes estándar |
| `$borderStrong` | `#AEAEB2` | Bordes fuertes |
| `$borderSubtle` | `#E5E5EA` | Bordes sutiles |

### Tokens de Espaciado

| Token | Valor | Uso típico |
|-------|-------|-----------|
| `$xs` | `4` | Espaciado mínimo |
| `$sm` | `8` | Espaciado pequeño |
| `$md` | `12` | Espaciado medio |
| `$lg` | `16` | Padding estándar |
| `$xl` | `20` | Secciones |
| `$2xl` | `24` | Gap entre cards |
| `$3xl` | `32` | Secciones grandes |
| `$4xl` | `40` | Headers |
| `$5xl` | `48` | Padding screens |
| `$6xl` | `64` | Márgenes grandes |

### Tokens de Tamaño

| Token | Valor | Uso |
|-------|-------|-----|
| `$1` | `4` | Iconos pequeños, dots |
| `$2` | `8` | Espaciado interno |
| `$3` | `12` | Padding interno |
| `$4` | `16` | Padding estándar |
| `$5` | `20` | Secciones |
| `$6` | `24` | Cards |

### Tokens de Radio (Border Radius)

| Token | Valor | Uso |
|-------|-------|-----|
| `$xs` | `6` | Inputs pequeños |
| `$sm` | `8` | Chips, badges |
| `$md` | `12` | ✅ Inputs, cards pequeñas |
| `$lg` | `16` | ✅ Cards estándar |
| `$xl` | `20` | Cards grandes |
| `$2xl` | `24` | Modals |
| `$full` | `9999` | ✅ Avatares, badges circulares |

---

## 🎨 PATRONES DE DISEÑO REGISTRADOS

### 1. LOGIN SCREEN (P_Auth/LoginScreen.tsx)

**Diseño:**
- Fondo: `$background`
- Card central con sombra: `$background2` + shadow
- Input fields: `borderWidth={1}`, `borderColor="$borderColor"`, `borderRadius={12}`, `height={50}`
- Botón login: `bg="$primary"`, full width
- Layout: flex centrado vertical y horizontalmente
- Responsive: usa `useWindowDimensions()`

**Colores usados:** `$background`, `$background2`, `$primary`, `$color`, `$color2`, `$borderColor`, `$shadowColor`, `$error`

**⚠️ NO CAMBIAR:** Layout centrado, tamaño de inputs, border radius

---

### 2. HOME SCREEN (P_Principal/HomeScreen.tsx)

**Diseño:**
- Usa **Design System Components**: `Text`, `Button`, `IconButton`, `Card`, `ScreenLayout`, `Stack`, `HStack`
- Header con avatar y saludo
- Grid de módulos: `HStack justify="space-around"` con iconos circulares
- Permission chips: `XStack` con `$successMuted`/`$errorMuted`

**Colores usados:** `$primary`, `$color`, `$color2`, `$color4`, `$success`, `$secondary`, `$warning`, `$successMuted`, `$errorMuted`

**Pattern de módulo:**
```tsx
<Card p="$4" br="$full">
  <YStack ai="center" gap="$2">
    <YStack w="$5" h="$5" br="$full" bg="$primary" ai="center" jc="center">
      <Ionicons name="home" size={24} color="white" />
    </YStack>
    <Text variant="caption">Módulo</Text>
  </YStack>
</Card>
```

**⚠️ NO CAMBIAR:** Grid layout, tamaño de iconos, espaciado

---

### 3. USER MANAGEMENT (Components_Usuarios/)

**UserList.tsx:**
- Cards con `variant="outlined"`
- Role colors: `admin`→`$error`, `it`→`$primary`, `rh`→`$warning`, `supervisor`→`$success`, `vigilante`→`$info`
- Filter chips con `$successMuted`/`$errorMuted`
- Search input con `borderColor="$border"`, `borderRadius="$full"`

**UserForm.tsx:**
- Form fields: `gap="$3"`, inputs con `borderWidth={1}`, `borderColor="$border"`, `borderRadius={12}`
- Error messages con `$errorMuted` background
- Success indicator con `$successMuted`

**UserDetail.tsx:**
- Sections con `$backgroundTertiary` y `$backgroundSecondary`
- Info rows con `$borderSubtle` divider
- Action buttons con iconos

**RolePermissions.tsx:**
- Grid de permisos con checks
- Category headers con `$backgroundSecondary`

**⚠️ NO CAMBIAR:** Role color mapping, form field spacing, input styles

---

### 4. ARCHIVERO MODULE (src_Archivero_STV/)

**ArchiveroHomeScreen.tsx:**
- Header: `Card` con `bg="$secondary"`, título blanco
- Feature chips: `Card variant="outlined"` con `$success`/`$warning`/`$primary`
- Grid de carpetas: `Stack gap="$3"`
- `FeatureChip`: `XStack` con `br="$full"`, `bg="$successMuted"`

**ArchiveroDetalleScreen.tsx:**
- Tabs: `XStack` con `bg="$borderSubtle"`, tabs activos `bg="$secondary"`
- Lista de archivos: cards con `variant="outlined"`
- Action buttons: `IconButton` con `$primary`

**CarpetaDetalleScreen.tsx:**
- Similar a ArchiveroDetalle
- Action buttons con `$success`/`$error`/`$warning`

**CrearArchiveroScreen.tsx:**
- Formulario: `YStack gap="$3"`
- Inputs: `borderWidth={1}`, `borderColor="$border"`, `br={12}`
- Botón crear: `bg="$success"`

**EscanearDocumentoScreen.tsx:**
- Área de escaneo: `Card` con `borderStyle="dashed"`, `borderColor="$warning"`
- Instrucciones: `Stack gap="$2"` con iconos

**GestionarMiembrosScreen.tsx:**
- Role colors: `dueno`→`$primary`, `editor`→`$success`, `visor`→`$warning`
- Lista de miembros: cards con avatar y rol badge

**⚠️ NO CAMBIAR:** Tab styles, role colors, form input styles

---

### 5. CHAT MODULE (src_Chat_STV/)

**ChatHomeScreen.tsx:**
- Header con `bg="$primary"`, texto blanco
- Feature chips: `Card` con `br="$full"`, colores por tipo
- Lista de chats: `Card variant="outlined"` con avatar y chevron
- Search bar: `Input` con `br="$full"`, `borderColor="$border"`

**PrivateChatsScreen.tsx:**
- Lista similar a ChatHome
- Avatar circles con `$success` indicator

**GroupChatsScreen.tsx:**
- Headers con `$secondary`
- Group avatar con `$secondaryMuted`

**EmployeeDirectoryScreen.tsx:**
- Search input prominente
- Employee cards con avatar, nombre, departamento
- Status indicator con `$success`

**NewsBoardScreen.tsx:**
- Priority colors: `urgente`→`$error`, `alta`→`$warning`, `media`→`$primary`
- News cards con `variant="outlined"`
- Priority badge con `$errorMuted`/`$warningMuted`

**ChatSearchScreen.tsx:**
- Search input grande
- Resultados agrupados por categoría

**EmailMainScreen.tsx:**
- Email UI con tabs inbox/sent/draft
- Email list con unread indicator `$primary`

**EmailInboxView.tsx:**
- Email rows con `$primaryMuted` para unread
- Swipe actions con `$error` para delete

**ComposeEmailView.tsx:**
- Form fields con `borderColor="$border"`, `br={12}`
- Attachments con `$border` background

**EmailSidebar.tsx:**
- Folder list con `$background`
- Unread badges con `$primary`

**⚠️ NO CAMBIAR:** Email list styles, priority colors, search bar styles

---

### 6. INSTALACIONES MODULE (src_Instalaciones_STV/)

**⚠️ MIXED STYLING:** Algunas screens usan Tamagui, otras usan StyleSheet

**InstalacionesHomeScreen.tsx:**
- Tamagui: `YStack`, `XStack`, `Text`, `Card`, `Button`
- Background: `$background`
- Cards: `InstalacionCard` component
- Colors: `$primary`, `$color2`, `$background2`, `$background3`

**InstalacionCard.tsx:**
- Usa Tamagui: `YStack`, `XStack`, `Text`, `Card`, `Button`
- Status colors: `$success` para activo, `$error` para inactivo
- Shadow y bordes: `$borderColor`, `$shadowColor`

**❌ NO TAMAGUI (usan StyleSheet con colores hardcodeados):**
- `DetalleInstalacionScreen.tsx` → StyleSheet, `#007AFF`, `#4CAF50`
- `RegistroInstalacionScreen.tsx` → StyleSheet, `#007AFF`
- `RegistroAreaScreen.tsx` → StyleSheet
- `RegistroInstalacionForm.tsx` → StyleSheet, `#007AFF`, `#666`, `#ddd`
- `RegistroAreaForm.tsx` → StyleSheet, `#007AFF`, `#666`, `#ddd`

**⚠️ IMPORTANTE:** Estos archivos NO deben mezclarse. Mantener consistencia.

**⚠️ NO CAMBIAR:** Card styles, status colors, form styles (aunque sean StyleSheet)

---

### 7. TICKET MODULE (src_P_Ticket_IT/)

**TicketHomeScreen.tsx:**
- Usa Design System: `Text`, `Button`, `Card`, `ScreenLayout`, `Stack`, `HStack`
- Header: `bg="$primary"` o `bg="$secondary"`
- Action buttons: `Button variant="primary"` o `"secondary"`
- Status badges: `$warning`, `$success`, `$error`
- Stats cards con `$color4` background

**⚠️ NO CAMBIAR:** Stats card layout, button styles, status colors

---

## 🧩 DESIGN SYSTEM COMPONENTS

### Text (src/components/design-system/Text.tsx)

**Variantes disponibles:**
| Variante | Tamaño | Peso | Uso |
|----------|--------|------|-----|
| `h1` | 34px | bold | Títulos principales |
| `h2` | 28px | semibold | Secciones grandes |
| `h3` | 22px | semibold | Subtítulos |
| `title1` | 28px | semibold | iOS style títulos |
| `title2` | 22px | semibold | iOS style secciones |
| `title3` | 20px | normal | iOS style subtítulos |
| `h4` | 20px | semibold | Headers de card |
| `h5` | 17px | semibold | Headers pequeños |
| `h6` | 15px | semibold | Labels |
| `body` | 17px | normal | ✅ Texto cuerpo |
| `bodySmall` | 15px | normal | Texto secundario |
| `caption` | 13px | normal | Texto pequeño, hints |
| `label` | 17px | semibold | Labels de form |
| `labelSmall` | 15px | semibold | Labels pequeños |

**Color por defecto:** `$color`
**Permite:** `maxFontSizeMultiplier={1.3}`, `allowFontScaling`

**⚠️ NO CAMBIAR:** Variant definitions, font sizes, weights

---

### Button (src/components/design-system/Button.tsx)

**Variantes:**
| Variante | Background | Texto | Uso |
|----------|-----------|-------|-----|
| `primary` | `$primary` | blanco | ✅ Acción principal |
| `secondary` | `$secondary` | blanco | Acciones secundarias |
| `success` | `$success` | blanco | Confirmar, guardar |
| `warning` | `$warning` | blanco | Advertencias |
| `error` | `$error` | blanco | Eliminar, cancelar |
| `outline` | transparente | `$primary` con borde | Acciones alternativas |
| `ghost` | transparente | `$primary` | Links, textos clicables |

**Tamaños:**
| Tamaño | Height | Padding | Uso |
|--------|--------|---------|-----|
| `xs` | 44 | `$2` | Botones pequeños |
| `sm` | 48 | `$3` | Botones compactos |
| `md` | 52 | `$4` | ✅ Botones estándar |
| `lg` | 56 | `$4` | Botones grandes |
| `xl` | 64 | `$5` | Botones principales |

**Border radius:** `$lg` (16px) por defecto

**IconButton:** 44x44 mínimo (touch target), `br="$full"`

**⚠️ NO CAMBIAR:** Variant colors, sizes, border radius

---

### Card (src/components/design-system/Card.tsx)

**Variantes:**
| Variante | Background | Border | Shadow | Uso |
|----------|-----------|--------|--------|-----|
| `default` | `$backgroundSecondary` | none | none | Cards básicas |
| `elevated` | `$backgroundSecondary` | none | yes | Cards con elevación |
| `outlined` | `$backgroundSecondary` | `$border` | none | ✅ Lista de items |
| `filled` | `$backgroundTertiary` | none | none | Secciones agrupadas |
| `grouped` | `$backgroundTertiary` | `$borderSubtle` | none | Items en grupo |

**PressableCard:** Agrega `pressStyle` con `opacity={0.7}`, `scale={0.98}`
**Border radius:** `$lg` (16px) por defecto

**⚠️ NO CAMBIAR:** Variant definitions, colors, radius

---

### Layout (src/components/design-system/Layout.tsx)

**Componentes:**
- `Stack` → YStack con `gap="$4"` por defecto
- `HStack` → XStack con configurable `align` y `justify`
- `ScreenLayout` → Full-screen con ScrollView opcional, `px="$4"` o `px="$8"`
- `ScreenSection` → Sección con `py="$4"`

**⚠️ NO CAMBIAR:** Default gap, padding values

---

### Header (src/components/design-system/Header.tsx)

**Variantes:**
| Variante | Background | Altura | Uso |
|----------|-----------|--------|-----|
| `default` | `$backgroundSecondary` | normal | Headers estándar |
| `primary` | `$primary` | normal | Headers con color |
| `large` | `$backgroundSecondary` | grande | Headers con descripción |

**Padding:** `isMobile ? '$5' : '$6'` (responsive)
**Border radius:** `$full` para botones de back

**⚠️ NO CAMBIAR:** Responsive padding, border radius

---

## 📋 FORMULARIOS - PATRÓN ESTÁNDAR

**Inputs:**
```tsx
<Input
  borderWidth={1}
  borderColor="$border"
  borderRadius={12}  // o "$md"
  height={50}
  paddingHorizontal="$4"
  fontSize="$md"
/>
```

**Form containers:**
```tsx
<YStack gap="$3">  // o "$4" para forms grandes
  {/* inputs */}
</YStack>
```

**Error messages:**
```tsx
<YStack bg="$errorMuted" p="$3" br="$sm">
  <Text c="$error">{error}</Text>
</YStack>
```

**Labels:**
```tsx
<Text variant="label">{label}</Text>
```

**⚠️ NO CAMBIAR:** Input heights, border radius, form gap

---

## 🎯 LISTAS - PATRÓN ESTÁNDAR

**List item:**
```tsx
<Card variant="outlined" p="$4" onPress={onPress}>
  <HStack gap="$3" ai="center">
    <YStack w="$4" h="$4" br="$full" bg="$primaryMuted" ai="center" jc="center">
      <Ionicons name="icon" size={20} color="$primary" />
    </YStack>
    <YStack f={1}>
      <Text variant="body">{title}</Text>
      <Text variant="caption" c="$color3">{subtitle}</Text>
    </YStack>
    <Ionicons name="chevron-forward" size={20} color="$color3" />
  </HStack>
</Card>
```

**⚠️ NO CAMBIAR:** Avatar size, spacing, chevron

---

## 🏷️ BADGES/CHIPS - PATRÓN ESTÁNDAR

```tsx
<XStack
  bg="$successMuted"  // o "$errorMuted", "$warningMuted", "$primaryMuted"
  px="$2"
  py="$1"
  br="$full"
  ai="center"
  gap="$1"
>
  <Text c="$success" fontSize="$xs" fontWeight="600">
    {label}
  </Text>
</XStack>
```

**⚠️ NO CAMBIAR:** Border radius, padding

---

## 📊 RESUMEN DE COLORES POR MÓDULO

| Módulo | Color Principal | Color Secundario | Estados |
|--------|----------------|-----------------|---------|
| **Auth** | `$primary` | - | `$error` |
| **Home** | `$primary` | `$secondary` | `$success`, `$warning` |
| **Users** | `$primary` | `$secondary` | `$error`, `$warning`, `$success`, `$info` |
| **Archivero** | `$secondary` | `$primary` | `$success`, `$warning`, `$error` |
| **Chat** | `$primary` | `$secondary` | `$success`, `$warning`, `$error`, `$info` |
| **Email** | `$primary` | - | `$error` |
| **Instalaciones** | `$primary` | - | `$success`, `$error` |
| **Tickets** | `$primary` | `$secondary` | `$warning`, `$success`, `$error` |

---

## ⚠️ ARCHIVOS CON ESTILOS NO-TAMAGUI (NO TOCAR)

Estos archivos usan `StyleSheet.create()` con colores hardcodeados. **NO mezclar con Tamagui** a menos que se pida explícitamente:

- `src_Instalaciones_STV/screens/DetalleInstalacionScreen.tsx` → `#007AFF`, `#4CAF50`, `#f5f5f5`
- `src_Instalaciones_STV/screens/RegistroInstalacionScreen.tsx` → `#007AFF`
- `src_Instalaciones_STV/screens/RegistroAreaScreen.tsx` → `#007AFF`
- `src_Instalaciones_STV/components/RegistroInstalacionForm.tsx` → `#007AFF`, `#666`, `#ddd`, `#f9f9f9`
- `src_Instalaciones_STV/components/RegistroAreaForm.tsx` → `#007AFF`, `#666`, `#ddd`

---

## 🔄 HISTORIAL DE CAMBIOS DE DISEÑO

> **Agregar aquí cada cambio de diseño confirmado**

### 2026-04-06 - REGISTRO INICIAL
- ✅ Diseño base documentado completamente
- ✅ Todos los patrones registrados
- ✅ Colores y tokens inventariados

---

> **⚠️ IMPORTANTE:** Antes de modificar cualquier estilo mencionado aquí, consultar con el usuario y actualizar este archivo.
