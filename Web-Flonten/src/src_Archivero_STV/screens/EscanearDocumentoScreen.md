# 📱 EscanearDocumentoScreen - Documentación

> **Última actualización:** 2026-04-11
> **Autor:** Sistema de Auto-Aprendizaje Qwen
> **Estado:** ✅ Activo
> **Módulo:** Archivero STV

---

## 📋 DESCRIPCIÓN GENERAL

### ¿Qué hace este componente?
Screen de selección de método de escaneo para documentos en el módulo Archivero. Permite al usuario elegir entre tomar una foto con la cámara o escanear un archivo existente.

### ¿Para qué sirve?
- Proporcionar interfaz de captura de documentos para el sistema de archivero digital
- Ofrecer dos métodos de entrada: cámara en vivo o archivo existente
- Preparar el flujo de escaneo con características avanzadas (OCR, auto-recorte, etc.)

### ¿Cómo funciona?
1. Usuario accede a la pantalla desde el detalle de un archivero
2. Selecciona método de captura (cámara o galería)
3. Visualiza características disponibles del escáner
4. Presiona "Continuar" para avanzar al siguiente paso del flujo

---

## 📋 RESUMEN DE ARCHIVOS

| Archivo | Propósito | Última modificación |
|---------|-----------|---------------------|
| `EscanearDocumentoScreen.jsx` | Componente principal del screen | 2026-04-11 |
| `index.js` | Barrel export del módulo | 2026-04-11 |

---

## 🔄 HISTORIAL DE CAMBIOS

### [2026-04-11] - Adaptación a Web y Documentación Completa
- **Qué se hizo:** 
  - Documentación completa del componente con sistema de auto-aprendizaje
  - Análisis de estructura y conexiones
  - Identificación de mejoras posibles (Design System, comentarios)
- **Por qué:** 
  - Implementación del sistema de documentación automática
  - Necesidad de ejemplo para otros componentes
- **Cómo funciona:** 
  - Componente funcional de React con useState para estado local
  - Usa React Router para navegación (useParams, useNavigate)
  - Renderiza opciones de escaneo con selección visual
- **Archivos modificados:**
  - `EscanearDocumentoScreen.md` - creado este archivo de documentación
- **Problemas encontrados:** 
  - No se usó Design System (estilos inline)
  - Faltan comentarios explicativos en el código
- **Soluciones aplicadas:** 
  - Documentado el uso actual con advertencias de estilo
  - Creado patrón de documentación para futuros componentes

---

## 🚨 PROBLEMAS Y SOLUCIONES

### Problema 1: Estilos inline en lugar de Design System
- **Síntoma:** Componente usa estilos inline directamente en JSX
- **Causa:** Adaptación inicial no siguió DESIGN_SYSTEM.md
- **Solución:** 
  ```jsx
  // ❌ Actual - Estilos inline
  <div style={{ backgroundColor: '#FF9500', padding: '24px' }}>
  
  // ✅ Recomendado - Usar Design System
  import { Card, Text } from '@/components/design-system';
  <Card variant="primary">
  ```
- **Lección:** SIEMPRE usar componentes del Design System para consistencia
- **Referencia:** `Web-Flonten/.qwen/DESIGN_SYSTEM.md`, `Web-Flonten/.qwen/DESIGN_RULES.md`

### Problema 2: Iconos como emojis en lugar de componentes
- **Síntoma:** Diccionario `E` con emojis como strings
- **Causa:** Adaptación rápida sin usar sistema de iconos proper
- **Solución:** 
  ```jsx
  // ❌ Actual - Emojis hardcoded
  const E = { 'camera': '📷', 'images': '🖼️' };
  <div>{E['camera']}</div>
  
  // ✅ Recomendado - Usar @expo/vector-icons
  import { Ionicons } from '@expo/vector-icons';
  <Ionicons name="camera" size={24} color="white" />
  ```
- **Lección:** Usar sistema de iconos oficial para mejor mantenibilidad
- **Referencia:** `Web-Flonten/package.json` → `@expo/vector-icons`

---

## 🔗 CONEXIONES

### API Endpoints
- **Por implementar:** `POST /api/archivero/:id/documentos/escanear` - Subir documento escaneado
- **Por implementar:** `GET /api/archivero/:id/documentos` - Listar documentos existentes

### Stores
- **Por conectar:** `useArchiveroStore` - Para datos del archivero actual
- **Por conectar:** `useAuthStore` - Para verificar permisos de usuario

### Componentes Hijos
- **Ninguno actualmente** - Componente es monolítico
- **Recomendación:** Extraer `OpcionEscaneo`, `CaracteristicaEscaneo` como componentes reutilizables

### Hooks
- `useNavigate` (react-router-dom) - Navegación hacia atrás y adelante
- `useParams` (react-router-dom) - Obtener archiveroId de la URL
- `useState` (React) - Estado local para método seleccionado

### Navegación
- **Ruta actual:** `/archivero/:archiveroId/escanear`
- **Navega a:** Por definir - screen de procesamiento de imagen
- **Viene de:** `/archivero/:archiveroId` (ArchiveroDetalleScreen)

---

## 🎨 DISEÑO Y ESTILOS

### ⚠️ ADVERTENCIA: No usa Design System
**Este componente actualmente usa estilos inline en lugar del Design System oficial.**

Para modificar estilos:
1. Consultar `DESIGN_SYSTEM.md` PRIMERO
2. Consultar `DESIGN_RULES.md` PRIMERO
3. Refactorizar para usar componentes de `@/components/design-system/`

### Colores Hardcodeados (NO cambiar sin autorización)
| Color | Uso | Valor |
|-------|-----|-------|
| Naranja | Header principal | `#FF9500` |
| Azul | Botones y acentos | `#007AFF` |
| Púrpura | Opción galería | `#5856D6` |
| Gris fondo | Background | `#F2F2F7` |
| Gris claro | Bordes | `#D1D1D6` |

### Tokens de Tamagui (Debería usar)
- Colores: `$color`, `$background`, `$backgroundSecondary`
- Spacing: `$2`, `$4`, `$6`, `$8`
- Radius: `$radiusLg`, `$radiusXl`
- Typography: `$heading3`, `$body`, `$caption`

### Spacing Actual (Debería usar tokens)
- Padding screen: `24px 32px` → debería ser `$6 $8`
- Gap entre opciones: `12` → debería ser `$3`
- Border radius cards: `16`, `20` → debería ser `$radiusXl`, `$radius2Xl`

---

## 🧪 TESTING

### Tests existentes
- [ ] NO HAY TESTS - Necesita tests unitarios

### Cómo testear (cuando se creen tests)
```bash
# Comando para testear este componente
npm run test -- EscanearDocumentoScreen
```

### Casos de prueba necesarios
1. **Renderizado inicial** - verifica que se muestran ambas opciones
2. **Selección de método** - verifica que al hacer click se marca como seleccionado
3. **Botón continuar deshabilitado** - verifica que está disabled sin selección
4. **Botón continuar habilitado** - verifica que se habilita tras selección
5. **Navegación atrás** - verifica que el botón de back funciona
6. **Manejo de archiveroId** - verifica que se obtiene correctamente de useParams

---

## 💡 NOTAS IMPORTANTES

### Cosas a recordar
- ⚠️ Este componente usa estilos inline - NO seguir este patrón
- ✅ Usar este componente como ejemplo de DOCUMENTACIÓN, no de implementación
- ⚠️ Las características de escaneo (OCR, etc.) son placeholders visuales
- ✅ La navegación usa React Router v7 (useParams, useNavigate)

### Advertencias
- ⚠️ NO cambiar estilos sin permiso explícito del usuario
- ⚠️ NO agregar funcionalidad de escaneo real sin consultar al usuario
- ⚠️ Consultar DESIGN_SYSTEM.md antes de cualquier cambio visual

### Mejores prácticas específicas
- ✅ Mantener separación clara entre UI y lógica de negocio
- ✅ Extraer componentes reutilizables si se duplica código
- ✅ Usar Design System en futuras modificaciones

### Errores comunes
- **Mutación de estado directo** → SIEMPRE usar `setMetodoSeleccionado()` 
- **Olvidar extensión .jsx en imports** → SIEMPRE incluir extensión
- **Rutas relativas incorrectas** → SIEMPRE verificar desde archivo actual

---

## 📚 REFERENCIAS EXTERNAS

- [Documentación oficial de React](https://react.dev)
- [React Router DOM v7](https://reactrouter.com)
- [Documentación de Tamagui](https://tamagui.dev)
- [Expo Vector Icons](https://docs.expo.dev/guides/icons/)
- [MDN: useState Hook](https://developer.mozilla.org/en-US/docs/Web/API/Window/getComputedStyle)

---

## 🏷️ TAGS

`[#componente]` `[#screen]` `[#archivero]` `[#escaneo]` `[#camara]` `[#documentos]` `[#necesita-design-system]` `[#necesita-tests]`

---

> **Mantener este archivo actualizado después de cada cambio**
> **Última revisión:** 2026-04-11 por Sistema Auto-Aprendizaje Qwen
> 
> **PRÓXIMAS MEJORAS SUGERIDAS:**
> 1. Refactorizar para usar Design System
> 2. Agregar tests unitarios
> 3. Conectar con store de archivero
> 4. Implementar funcionalidad real de escaneo
> 5. Usar sistema de iconos en lugar de emojis
