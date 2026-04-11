# 🐛 ERRORES COMUNES - Base de Conocimiento

> **Errores frecuentes y sus soluciones en el proyecto Control_Trabajo**
> 
> **Cómo usar este archivo:** Buscar el error por mensaje o síntoma

---

## ERROR #1: Unexpected text node in Tamagui View

### 🔍 Síntoma
```
Unexpected text node: ¡Hola, . A text node cannot be a child of a <View>.
Unexpected text node: pio. A text node cannot be a child of a <View>.
Unexpected text node: !. A text node cannot be a child of a <View>.
```

### 📊 Descripción
**Qué pasa:** Tamagui (y React Native en general) **NO permite nodos de texto sueltos** directamente dentro de componentes contenedores como `<View>`, `<YStack>`, `<XStack>`, `<Stack>`.

**Por qué ocurre:** En React Native, todo texto DEBE estar envuelto en un componente `<Text>`. Si pones texto directamente como hijo de un `<View>`, React Native lanza este error.

### ❌ Código que causa el error
```tsx
// MALO - Texto suelto dentro de YStack
<YStack>
  ¡Hola, {user?.nombre}!  // ❌ Esto causa el error
</YStack>

// MALO - Texto sin wrapper en Stack
<Stack>
  Rol: {user?.rol}  // ❌ Esto causa el error
</Stack>
```

### ✅ Solución
```tsx
// BUENO - Todo texto envuelto en <Text>
<YStack>
  <Text variant="h3">¡Hola, {user?.nombre}!</Text>  // ✅ Correcto
</YStack>

// BUENO - Cada pieza de texto en su Text
<Stack>
  <Text variant="bodySmall">Rol: {user?.rol}</Text>  // ✅ Correcto
</Stack>
```

### 📝 Reglas de oro

1. **NUNCA pongas texto directamente** dentro de:
   - `<View>`, `<YStack>`, `<XStack>`, `<Stack>`, `<HStack>`
   - Cualquier componente que renderice como `<div>` o `<View>`

2. **SIEMPRE envuelve texto** en `<Text>`:
   ```tsx
   <Stack>
     <Text>Mi texto aquí</Text>  // ✅
   </Stack>
   ```

3. **Cuidado con concatenación de texto**:
   ```tsx
   // MALO - Múltiples nodos de texto sueltos
   <YStack>
     {user?.nombre} {user?.apellido}  // ❌ Dos nodos de texto
   </YStack>
   
   // BUENO - Todo en un solo Text
   <YStack>
     <Text>{user?.nombre} {user?.apellido}</Text>  // ✅ Un solo nodo
   </YStack>
   ```

### 🔧 Dónde buscar este error
- **Archivos con problemas:** `HomeScreen.tsx`, cualquier screen nuevo
- **Componentes sospechosos:** Cualquier `<Stack>`, `<YStack>`, `<XStack>` con texto directo
- **Patrón común:** Mensajes de saludo, información de usuario, labels

### 🛠️ Cómo fixearlo
1. Busca el componente que causa el error (revisa el stack trace)
2. Identifica las líneas con texto suelto
3. Envuelve TODO texto en `<Text>` del design system
4. Prueba que el error desaparezca

### 💡 Solución aplicada en Web-Flonten
**Problema:** El componente `Text` usaba `styled('span')` de Tamagui, que en web estaba creando nodos de texto sueltos dentro de `<div>` elementos.

**Solución:** Se reemplazó `styled('span')` por un `<span>` nativo con estilos inline, eliminando la dependencia de Tamagui para el componente de texto en la versión web.

**Archivo modificado:** `Web-Flonten/src/components/design-system/Text.jsx`

### 📚 Referencias
- **Design System:** `src/components/design-system/Text.jsx`
- **Ejemplo correcto:** Ver cualquier card de módulo en `HomeScreen.tsx`

---

## ERROR #2: React does not recognize the `lineHeight` prop

### 🔍 Síntoma
```
React does not recognize the `lineHeight` prop on a DOM element. 
If you intentionally want it to appear in the DOM as a custom attribute, 
spell it as lowercase `lineheight` instead.
```

### 📊 Descripción
**Qué pasa:** Estás pasando una prop `lineHeight` (camelCase) a un elemento DOM nativo, pero React espera `lineheight` (minúsculas) para atributos HTML.

**Por qué ocurre:** Tamagui usa camelCase para estilos, pero en HTML los atributos personalizados deben ser lowercase.

### ❌ Código que causa el error
```tsx
// MALO - lineHeight en elemento DOM
<Text lineHeight={1.5}>Texto</Text>  // ❌ Pasa lineHeight al DOM
```

### ✅ Solución
```tsx
// BUENO - Usar style object
<Text style={{ lineHeight: 1.5 }}>Texto</Text>  // ✅ Correcto

// BUENO - Usar variant de Tamagui
<Text variant="body">Texto</Text>  // ✅ Ya incluye lineHeight
```

### 🛠️ Cómo fixearlo
1. Busca componentes `<Text>` con `lineHeight` como prop directa
2. Cambia a `style={{ lineHeight: valor }}`
3. O mejor, usa las variantes predefinidas que ya incluyen lineHeight

---

## 🔍 Índice de Errores por Síntoma

| Síntoma | Error | Solución |
|---------|-------|----------|
| "Unexpected text node" | Texto suelto en View/Stack | Envolver en `<Text>` |
| "lineHeight prop" | Prop camelCase en DOM | Usar `style={{ lineHeight }}` |
| "Cannot read property of undefined" | Datos no cargados | Agregar loading state |
| "Navigation.navigate is not a function" | Navigation no pasado | Usar `useNavigation()` hook |

---

## 📝 Contribuir

Cuando encuentres un error nuevo:
1. Documenta el mensaje completo del error
2. Explica por qué ocurre
3. Proporciona código malo vs bueno
4. Agrega referencias a archivos relevantes

**Última actualización:** 2026-04-11
**Creado por:** Fix de error "Unexpected text node" en HomeScreen
