# 🗂️ ÍNDICE MAESTRO - Control_Trabajo

> **Punto de entrada a toda la documentación del proyecto**
> 
> **Cómo usar este índice:** Lee el archivo que necesites según tu tarea
> 
> **⚡ IMPORTANTE:** Este cerebro se **autoactualiza** después de cada cambio en el código.
> Si detectas algo no documentado, el asistente lo documentará automáticamente.

---

## 📚 DOCUMENTOS DISPONIBLES

| Documento | Propósito | Cuándo usarlo |
|-----------|-----------|---------------|
| [🧠 CEREBRO.md](./CEREBRO.md) | **Contexto general del proyecto** | Cuando necesites entender la arquitectura completa, roles, flujos de datos |
| [📂 BACKEND_INDEX.md](./BACKEND_INDEX.md) | **Mapa detallado del backend** | Cuando busques un archivo específico del backend o necesites saber qué hace cada módulo |
| [📱 FRONTEND_INDEX.md](./FRONTEND_INDEX.md) | **Mapa detallado del frontend** | Cuando busques un componente, screen o servicio del frontend |
| [🔗 IMPORTS_GUIDE.md](./IMPORTS_GUIDE.md) | **Guía de imports y dependencias** | Cuando necesites saber cómo importar algo o crear un nuevo módulo |
| [⚙️ CONTEXT.md](./CONTEXT.md) | **Contexto persistente** | Se carga automáticamente en cada sesión |
| [🔌 ENDPOINTS.md](./ENDPOINTS.md) | **Todos los endpoints de la API** | Cuando necesites saber qué hace cada endpoint, qué DTO usa, qué response da |
| [🔄 FLUJOS.md](./FUJOS.md) | **Flujos de negocio completos** | Cuando necesites entender paso a paso cómo funciona cada caso de uso |
| [🎯 DECISIONES.md](./DECISIONES.md) | **Decisiones técnicas y por qué** | Cuando necesites entender por qué se eligió cada tecnología, patrón o enfoque |
| [🎨 DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) | **Sistema de diseños Tamagui** | ⭐ **CRÍTICO** - Para NO cambiar estilos accidentalmente |
| [📐 DESIGN_RULES.md](./DESIGN_RULES.md) | **Reglas de consistencia de diseño** | ⭐ **OBLIGATORIO** - Reglas para evitar "desparpajo" de estilos |
| [📝 CHANGELOG.md](./CHANGELOG.md) | **Historial de cambios** | Registro cronológico de todos los cambios |

---

## 🎨 SKILLS DE DISEÑO

| Skill | Propósito | Cuándo usar |
|-------|-----------|-------------|
| [🎨 UI Design Planning](./skills/ui-design-planning.md) | Planificación de diseño UI/UX profesional | Antes de implementar cualquier cambio visual |
| [🔄 Doc Auto-Update](./skills/doc-auto-update.md) | Actualización automática de docs | Después de cada cambio en código |
| [🛠️ Error Resolution](./skills/error-resolution.md) | Resolución y aprendizaje de errores | Al encontrar errores, debug, fix |

---

## 🧠 SISTEMA DE AUTO-APRENDIZAJE

### Documentos de Aprendizaje
| Documento | Propósito | Cuándo usar |
|-----------|-----------|-------------|
| [🧠 APRENDIZAJE.md](./APRENDIZAJE.md) | **Lecciones aprendidas de errores** | Consultar ANTES de implementar |
| [💡 SOLUCIONES_CONOCIDAS.md](./SOLUCIONES_CONOCIDAS.md) | Base de datos de soluciones técnicas | Buscar patrones de solución |
| [📝 CHANGELOG.md](./CHANGELOG.md) | Historial cronológico de cambios | Ver qué cambió y cuándo |

### 📋 Reglas de Auto-Aprendizaje
1. ✅ **Cada error** → documentado en APRENDIZAJE.md
2. ✅ **Cada solución** → documentada en SOLUCIONES_CONOCIDAS.md
3. ✅ **Cada cambio** → documentado en CHANGELOG.md
4. ✅ **Cada módulo** → tiene su propio .md explicativo
5. ✅ **NUNCA repetir errores** documentados
6. ✅ **SIEMPRE consultar** antes de implementar

### 📁 Plantillas de Documentación
| Plantilla | Ubicación | Uso |
|-----------|-----------|-----|
| [📝 Componente.md](./templates/Componente.md) | `templates/` | Documentar cada componente/screen |

---

## 🔄 SISTEMA DE AUTOACTUALIZACIÓN

### ¿Qué es?
El cerebro del proyecto **se actualiza automáticamente** después de cada cambio en el código. No necesitas pedirlo - el asistente detectará cambios y actualizará la documentación.

### ¿Qué se actualiza automáticamente?
- ✅ Nuevos módulos, endpoints, schemas (backend)
- ✅ Nuevas pantallas, componentes, servicios (frontend)
- ✅ Cambios en roles y permisos
- ✅ Nuevas rutas de navegación
- ✅ Cambios en la arquitectura
- ✅ Código no documentado

### Skill de Autoactualización
**Ubicación:** `.qwen/skills/doc-auto-update.md`

Este skill define el proceso de:
1. Detectar cambios con `git diff`
2. Analizar qué cambió (nuevos archivos, modificaciones, eliminaciones)
3. Actualizar la documentación correspondiente
4. Documentar código no documentado
5. Verificar que todo esté actualizado

### Cuándo se ejecuta
- ✅ Después de implementar cualquier cambio en código
- ✅ Antes de hacer commit
- ✅ Cuando dices "actualizar docs" o "sync docs"
- ✅ Cuando se detecta código no documentado

### Comentarios en el Código
Todos los archivos clave tienen **comentarios explicativos** que incluyen:
- 📝 Qué hace el archivo
- 🔗 Conexiones con otros archivos (rutas relativas)
- 📍 Endpoints que genera (backend)
- 🔄 Flujos de datos
- 🛠️ Cómo modificarlo

**Formato de comentarios:**
```typescript
/**
 * ============================================================================
 * 🚀 NOMBRE_ARCHIVO - Descripción corta
 * ============================================================================
 * 
 * QUÉ HACE ESTE ARCHIVO:
 * - Función principal
 * - Responsabilidades
 * 
 * CONEXIONES:
 * - Archivo relacionado: ruta/relativa (qué hace)
 * 
 * PARA MODIFICAR:
 * - Instrucciones específicas
 * 
 * ============================================================================
 */
```

---

## 🚀 GUÍA RÁPIDA POR TAREAS

### Quiero agregar un nuevo módulo al frontend

1. Lee: [FRONTEND_INDEX.md](./FRONTEND_INDEX.md) → Sección "ARQUITECTURA MULTI-MÓDULO"
2. Crea carpeta: `src_NuevoModulo/`
3. Estructura: `index.ts`, `navigation/`, `screens/`, `types/`
4. Importa en `src/navigation/AppNavigator.tsx`

### Quiero agregar pantalla a módulo existente

1. Lee: [FRONTEND_INDEX.md](./FRONTEND_INDEX.md) → Módulo correspondiente
2. Ve a: `src_[NombreModulo]/screens/`
3. Crea `NuevaScreen.tsx`
4. Agrega ruta en `src_[NombreModulo]/navigation/[Modulo]Navigator.tsx`

### Quiero agregar un nuevo módulo al backend

1. Lee: [BACKEND_INDEX.md](./BACKEND_INDEX.md) → Sección "MÓDULOS"
2. Lee: [IMPORTS_GUIDE.md](./IMPORTS_GUIDE.md) → "Imports Base de un Módulo"
3. Sigue los pasos de creación de módulo, controller, service y schema

### Quiero agregar una nueva pantalla al frontend

1. Lee: [FRONTEND_INDEX.md](./FRONTEND_INDEX.md) → Sección "Screens"
2. Lee: [IMPORTS_GUIDE.md](./IMPORTS_GUIDE.md) → "Imports de un Screen"
3. Crea la pantalla y agrega la ruta en AppNavigator

### Quiero entender cómo funciona la autenticación

1. Lee: [CEREBRO.md](./CEREBRO.md) → Sección "Sistema de Roles y Permisos"
2. Lee: [BACKEND_INDEX.md](./BACKEND_INDEX.md) → Sección "Auth Module"
3. Lee: [FRONTEND_INDEX.md](./FRONTEND_INDEX.md) → "Flujo de Autenticación"

### Quiero saber qué permisos tiene cada rol

1. Lee: [CEREBRO.md](./CEREBRO.md) → Sección "Sistema de Roles y Permisos (RBAC)"
2. El archivo definitivo es: `backen_cerebro/src/Models/Usuarios/usuario.schema.ts`

### Quiero cambiar la URL del backend

1. Lee: [FRONTEND_INDEX.md](./FRONTEND_INDEX.md) → Sección "Constants"
2. Edita: `C_Ticket_Apk_STV/src/constants/index.ts`

### Quiero agregar un nuevo campo al schema de usuario

1. Lee: [BACKEND_INDEX.md](./BACKEND_INDEX.md) → Sección "Usuarios"
2. Edita: `backen_cerebro/src/Models/Usuarios/usuario.schema.ts`

---

## 📁 ESTRUCTURA DE DOCUMENTACIÓN

```
.qwen/
├── INDEX.md                     # Este archivo (punto de entrada)
├── CEREBRO.md                   # Contexto general del proyecto
├── BACKEND_INDEX.md             # Mapa del backend
├── FRONTEND_INDEX.md            # Mapa del frontend
└── IMPORTS_GUIDE.md             # Guía de imports
```

---

## 🎯 CONTEXTOS DEL PROYECTO

### Backend (NestJS)
- **Ruta:** `backen_cerebro/`
- **Documentación:** [BACKEND_INDEX.md](./BACKEND_INDEX.md)
- **Entry point:** `src/main.ts`
- **Módulo raíz:** `src/app.module.ts`

### Frontend (React Native)
- **Ruta:** `C_Ticket_Apk_STV/`
- **Documentación:** [FRONTEND_INDEX.md](./FRONTEND_INDEX.md)
- **Entry point:** `App.tsx`
- **Código fuente:** `src/`

---

## 🔍 BÚSQUEDA RÁPIDA

| Busco... | Está en... |
|----------|------------|
| Endpoints de la API | [BACKEND_INDEX.md](./BACKEND_INDEX.md) → "Endpoints de la API" |
| Roles y permisos | [CEREBRO.md](./CEREBRO.md) → "Sistema de Roles y Permisos" |
| Cómo importar algo | [IMPORTS_GUIDE.md](./IMPORTS_GUIDE.md) |
| Estructura de carpetas | [BACKEND_INDEX.md](./BACKEND_INDEX.md) o [FRONTEND_INDEX.md](./FRONTEND_INDEX.md) |
| Colecciones de MongoDB | [BACKEND_INDEX.md](./BACKEND_INDEX.md) → "RESUMEN DE COLECCIONES" |
| Componentes UI | [FRONTEND_INDEX.md](./FRONTEND_INDEX.md) → "Components" |
| Configuración de Tamagui | [FRONTEND_INDEX.md](./FRONTEND_INDEX.md) → "TAMAGUI - UI FRAMEWORK" |

---

## 📌 NOTAS IMPORTANTES

1. **Esta documentación debe actualizarse** con cada cambio significativo en la arquitectura
2. **El archivo CEREBRO.md es la fuente de verdad** para contexto general
3. **Los índices son guías de navegación**, no reemplazan leer el código fuente
4. **MongoDB debe estar corriendo** para probar el backend
5. **Backend y frontend deben estar en la misma red** para comunicarse

---

> **Última actualización:** 2026-04-06
> **Creado por:** Qwen Code - Asistente de desarrollo
