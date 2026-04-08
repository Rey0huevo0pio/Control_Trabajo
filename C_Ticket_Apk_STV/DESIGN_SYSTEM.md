# 🎨 Sistema de Diseño Profesional - C Ticket STV v2.0

## 📋 Tabla de Contenidos
- [Visión General](#visión-general)
- [Arquitectura de Navegación](#arquitectura-de-navegación)
- [Componentes del Design System](#componentes-del-design-system)
- [Patrones de Diseño](#patrones-de-diseño)
- [Guía de Implementación](#guía-de-implementación)

---

## 🎯 Visión General

El sistema de diseño de **C Ticket STV v2.0** ha sido completamente rediseñado para alcanzar un nivel profesional comparable con aplicaciones de Google, Microsoft y Apple. 

### Principios de Diseño

1. **Claridad Visual**: Interfaces limpios con jerarquía clara
2. **Micro-interacciones**: Animaciones suaves que mejoran la UX
3. **Consistencia**: Patrones uniformes en todos los módulos
4. **Accesibilidad**: Contraste adecuado y targets de touch ≥44pt
5. **Rendimiento**: Animaciones optimizadas con native driver

### Paleta de Colores Profesional

```typescript
// Colores de Marca (iOS System Colors)
Primary:   #007AFF (Azul)
Secondary: #5856D6 (Púrpura)
Success:   #34C759 (Verde)
Warning:   #FF9500 (Naranja)
Error:     #FF3B30 (Rojo)
Info:      #5AC8FA (Cyan)

// Fondos
Background:      #F2F2F7
Card Background: #FFFFFF
Text Primary:    #000000
Text Secondary:  #8E8E93
Text Tertiary:   #C7C7CC
```

---

## 🧭 Arquitectura de Navegación

### Estructura de Navegación Moderna

La aplicación ahora implementa una **arquitectura híbrida** que combina:

1. **Stack Navigator** (nivel raíz)
   - Login → Autenticación
   - Home → Dashboard principal
   - MainTabs → Navegación con tabs inferiores
   - Screens individuales (acceso directo)

2. **Bottom Tab Navigator** (módulos principales)
   ```
   ┌─────────────────────────────────────┐
   │  [🏠 Inicio] [🏢 Instala] [💬 Chat] │
   │  [📁 Archivo] [🎫 Tickets]         │
   ├─────────────────────────────────────┤
   │                                     │
   │        Content Area                 │
   │                                     │
   └─────────────────────────────────────┘
   ```

3. **Nested Stack Navigators** (dentro de cada módulo)
   - Cada módulo tiene su propio stack para sub-pantallas
   - Transiciones suaves con animaciones compartidas

### Implementación de Navegación

```typescript
// AppNavigator.tsx - Estructura principal
<Stack.Navigator>
  <Stack.Screen name="Login" component={LoginScreen} />
  <Stack.Screen name="Home" component={HomeScreen} />
  <Stack.Screen name="MainTabs" component={MainTabs} />
  <Stack.Screen name="InstalacionesHome" component={InstalacionNavigator} />
  <Stack.Screen name="ChatHome" component={ChatNavigator} />
  <Stack.Screen name="ArchiveroHome" component={ArchiveroNavigator} />
  <Stack.Screen name="TicketsHome" component={TicketNavigator} />
</Stack.Navigator>

// MainTabs.tsx - Bottom tabs
<Tab.Navigator>
  <Tab.Screen name="HomeTab" component={HomeScreen} />
  <Tab.Screen name="InstalacionesTab" component={InstalacionNavigator} />
  <Tab.Screen name="ChatTab" component={ChatNavigator} />
  <Tab.Screen name="ArchiveroTab" component={ArchiveroNavigator} />
  <Tab.Screen name="TicketsTab" component={TicketNavigator} />
</Tab.Navigator>
```

### Características de la Tab Bar

- **Estilo iOS**: Fondo translúcido con blur effect
- **Iconos animados**: Cambian de color suavemente
- **Badges**: Notificaciones en tiempo real
- **Safe Area**: Respeta el notch y home indicator

---

## 🎨 Componentes del Design System

### 1. Text System

Sistema tipográfico completo con variantes semánticas:

```typescript
// Variantes disponibles
h1, h2, h3, h4, h5, h6  // Encabezados
body, bodySmall           // Cuerpo de texto
caption                   // Texto auxiliar
label, labelSmall         // Etiquetas
title1, title2, title3    // Títulos especiales

// Uso
<Text variant="h1" fontWeight="800" color="$color">
  Título Principal
</Text>
```

### 2. Button System

Botones profesionales con 7 variantes y 5 tamaños:

```typescript
// Variantes
'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'outline' | 'ghost'

// Tamaños
'xs' | 'sm' | 'md' | 'lg' | 'xl'

// Uso básico
<Button 
  title="Aceptar"
  onPress={handlePress}
  variant="primary"
  size="md"
  icon="checkmark-circle"
/>

// Con icono
<Button
  title="Continuar"
  icon="arrow-forward"
  iconPosition="right"
  onPress={handleContinue}
/>
```

**Características:**
- Animación de escala al presionar (spring animation)
- Sombras dinámicas según variante
- Estados: disabled, loading
- Touch target mínimo: 44x44pt

### 3. Card System

Cards modernos con 6 variantes:

```typescript
// Variantes
'default' | 'elevated' | 'outlined' | 'filled' | 'grouped' | 'gradient'

// Card básica
<Card variant="elevated" padding={20} borderRadius={16}>
  <Text>Contenido del Card</Text>
</Card>

// Card presionable con animación
<Card 
  variant="outlined" 
  onPress={() => navigateToScreen()}
  padding={20}
>
  <HStack gap={16}>
    <Icon />
    <Text>Tarjeta Interactiva</Text>
  </HStack>
</Card>

// Card con gradiente
<GradientCard
  gradientColors={['#007AFF', '#5856D6']}
  padding={24}
>
  <Text color="white">Card Destacado</Text>
</GradientCard>
```

**Características:**
- Sombras adaptativas (iOS/Android)
- Animación de feedback al presionar
- Bordes redondeados (12-20px)
- Soporte para gradientes

### 4. Layout System

Componentes estructurales profesionales:

```typescript
// Stack (Vertical)
<Stack gap={16}>
  <View />
  <View />
</Stack>

// HStack (Horizontal)
<HStack gap={16} align="center" justify="space-between">
  <View />
  <View />
</HStack>

// ScreenLayout (Contenedor principal)
<ScreenLayout
  scrollable={true}
  backgroundColor="#F2F2F7"
  useSafeArea={true}
  avoidKeyboard={true}
>
  {children}
</ScreenLayout>

// ScreenSection (Secciones)
<ScreenSection title="Información Personal">
  {formFields}
</ScreenSection>
```

### 5. State Components

Componentes para estados de UI:

#### Loading
```typescript
<Loading 
  message="Cargando datos..."
  subMessage="Por favor espera un momento"
  fullScreen={true}
/>
```

#### Empty State
```typescript
<EmptyState
  icon="folder-open"
  title="No hay archivos"
  message="Comienza subiendo tu primer archivo"
  actionButton={
    <Button title="Subir Archivo" onPress={handleUpload} />
  }
/>
```

#### Error State
```typescript
<ErrorState
  title="Error de Conexión"
  message="No se pudo conectar al servidor"
  onRetry={() => refetchData()}
/>
```

---

## 🎭 Patrones de Diseño

### 1. Module Card Pattern

Patrón para tarjetas de módulos principales:

```typescript
interface ModuleCard {
  id: string
  title: string
  description: string
  icon: IoniconName
  gradient: [string, string]  // [start, end]
  screen: string
  requiredRole?: string
  badge?: number
}

// Implementación
<ModuleCardComponent
  module={module}
  onPress={() => navigate(module.screen)}
/>
```

**Características visuales:**
- Icono con fondo de gradiente
- Título en fontWeight 700
- Descripción en color secundario
- Icono de navegación (chevron-forward-circle)
- Sombra con color del gradiente
- Animación de escala al presionar

### 2. Statistics Card Pattern

Para mostrar métricas y estadísticas:

```typescript
<StatCard
  icon="time-outline"
  value={23}
  label="Pendientes"
  color="#FF9500"
  gradient={['#FF9500', '#FF6B00']}
/>
```

**Diseño:**
- Icono circular con gradiente
- Valor grande y destacado (fontSize: 24)
- Label en color secundario
- Fondo blanco con sombra elevada

### 3. Header Pattern

Headers profesionales con gradientes:

```typescript
<YStack
  style={{
    background: 'linear-gradient(135deg, #007AFF 0%, #5856D6 100%)',
    padding: 24,
    paddingTop: 60,  // Status bar space
  }}
>
  {/* Decorative elements */}
  <Ionicons name="grid" size={200} color="rgba(255,255,255,0.1)" />
  
  {/* Content */}
  <HStack justify="space-between">
    <Stack>
      <Text variant="h1" color="white">Título</Text>
      <Text variant="body" color="white" opacity={0.9}>Subtítulo</Text>
    </Stack>
    <IconCircle />
  </HStack>
</YStack>
```

### 4. Permission Chip Pattern

Chips para mostrar permisos:

```typescript
<PermissionChip 
  label="Crear" 
  active={permissions.create} 
/>
```

**Estados:**
- Activo: Verde (#34C759) con checkmark
- Inactivo: Rojo (#FF3B30) con X

---

## 🚀 Guía de Implementación

### 1. Agregar un Nuevo Módulo

**Paso 1:** Definir el módulo en HomeScreen

```typescript
const modules: ModuleCard[] = [
  {
    id: 'nuevo-modulo',
    title: 'Nuevo Módulo',
    description: 'Descripción del módulo',
    icon: 'star-outline',
    gradient: ['#007AFF', '#5AC8FA'],
    screen: 'NuevoModuloHome',
  }
]
```

**Paso 2:** Agregar a MainTabs

```typescript
<Tab.Screen
  name="NuevoModuloTab"
  component={NuevoModuloNavigator}
  options={{
    title: 'Módulo',
    tabBarIcon: ({ color, size }) => (
      <Ionicons name="star" size={size} color={color} />
    ),
  }}
/>
```

**Paso 3:** Crear estructura del módulo

```
src_NuevoModulo_STV/
├── navigation/
│   └── NuevoModuloNavigator.tsx
├── screens/
│   └── NuevoModuloHomeScreen.tsx
├── components/
├── types/
└── module/
```

### 2. Usar Componentes del Design System

```typescript
import {
  Text,
  Button,
  IconButton,
  Card,
  ScreenLayout,
  Stack,
  HStack,
  Loading,
  EmptyState,
  ErrorState,
} from '../../components/design-system'

// Ejemplo completo
export default function MiPantalla() {
  return (
    <ScreenLayout>
      <Card variant="elevated" padding={20}>
        <HStack gap={16} align="center">
          <IconButton icon="add" onPress={handleAdd} />
          <Text variant="h5" fontWeight="700">Mi Pantalla</Text>
        </HStack>
      </Card>
      
      <Button 
        title="Guardar" 
        variant="primary" 
        size="lg"
        onPress={handleSave}
      />
    </ScreenLayout>
  )
}
```

### 3. Implementar Navegación entre Pantallas

```typescript
import { useNavigation } from '@react-navigation/native'

export default function MiPantalla() {
  const navigation = useNavigation<any>()
  
  const handleNavigate = () => {
    navigation.navigate('DestinoScreen', { param: 'value' })
  }
  
  const handleGoBack = () => {
    navigation.goBack()
  }
  
  return (
    <Button title="Ir" onPress={handleNavigate} />
  )
}
```

### 4. Manejar Estados de Carga y Error

```typescript
export default function MiPantalla() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [data, setData] = useState(null)
  
  if (loading) {
    return <Loading message="Cargando..." fullScreen />
  }
  
  if (error) {
    return (
      <ErrorState
        title="Error"
        message={error}
        onRetry={fetchData}
      />
    )
  }
  
  if (!data || data.length === 0) {
    return (
      <EmptyState
        icon="folder-open"
        title="No hay datos"
        message="Comienza agregando tu primer registro"
      />
    )
  }
  
  return <DataList data={data} />
}
```

---

## 📱 Optimizaciones de Rendimiento

### Animaciones con Native Driver

```typescript
// ✅ CORRECTO - Usa nativeDriver
Animated.spring(scaleAnim, {
  toValue: 0.98,
  useNativeDriver: true,  // Siempre incluir
  tension: 300,
  friction: 10,
}).start()

// ❌ INCORRECTO - Sin nativeDriver
Animated.spring(scaleAnim, {
  toValue: 0.98,
  // Sin useNativeDriver - CAUSA LAG!
}).start()
```

### Memoización de Componentes

```typescript
// Usar React.memo para componentes puros
const ModuleCard = React.memo(({ module, onPress }) => {
  return <Card onPress={onPress}>{/* ... */}</Card>
})

// useMemo para cálculos costosos
const filteredModules = useMemo(() => {
  return modules.filter(m => hasPermission(m))
}, [modules, user])
```

### FlatList Optimizations

```typescript
<FlatList
  data={items}
  keyExtractor={item => item.id}
  renderItem={({ item }) => <ItemCard item={item} />}
  removeClippedSubviews={true}  // Android
  maxToRenderPerBatch={10}
  windowSize={5}
  initialNumToRender={10}
/>
```

---

## 🎯 Checklist de Implementación

### Para cada pantalla nueva:

- [ ] Usa `ScreenLayout` como contenedor principal
- [ ] Implementa header con gradiente
- [ ] Usa componentes del design system (Card, Button, Text)
- [ ] Agrega estados de Loading, Empty, Error
- [ ] Anima transiciones con `useNativeDriver: true`
- [ ] Touch targets ≥ 44x44pt
- [ ] Contraste de colores adecuado
- [ ] Prueba en iOS y Android
- [ ] Safe area handling
- [ ] Keyboard avoidance

### Para cada componente:

- [ ] Props tipadas con TypeScript
- [ ] Variantes documentadas
- [ ] Animaciones optimizadas
- [ ] Estados disabled/loading
- [ ] Accesibilidad (labels, hints)

---

## 📚 Recursos Adicionales

### Documentación de Referencia
- [React Navigation Docs](https://reactnavigation.org/)
- [React Native Animated](https://reactnative.dev/docs/animated)
- [iOS Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)
- [Material Design 3](https://m3.material.io/)

### Iconos Disponibles
Todos los iconos de [Ionicons](https://ionic.io/ionicons) están disponibles:
```typescript
import { Ionicons } from '@expo/vector-icons'
<Ionicons name="home" size={24} color="#007AFF" />
```

---

## 🤝 Contribuciones

Para agregar nuevos componentes al design system:

1. Crear componente en `src/components/design-system/`
2. Exportar en `index.ts`
3. Documentar en este archivo
4. Agregar ejemplo de uso
5. Testear en ambos platforms

---

**Última actualización:** Abril 2026  
**Versión:** 2.0.0  
**Mantenido por:** Equipo de Desarrollo C Ticket STV
