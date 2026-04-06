# 🗂️ ÍNDICE MAESTRO - Control_Trabajo

> **Punto de entrada a toda la documentación del proyecto**
> 
> **Cómo usar este índice:** Lee el archivo que necesites según tu tarea

---

## 📚 DOCUMENTOS DISPONIBLES

| Documento | Propósito | Cuándo usarlo |
|-----------|-----------|---------------|
| [🧠 CEREBRO.md](./CEREBRO.md) | **Contexto general del proyecto** | Cuando necesites entender la arquitectura completa, roles, flujos de datos |
| [📂 BACKEND_INDEX.md](./BACKEND_INDEX.md) | **Mapa detallado del backend** | Cuando busques un archivo específico del backend o necesites saber qué hace cada módulo |
| [📱 FRONTEND_INDEX.md](./FRONTEND_INDEX.md) | **Mapa detallado del frontend** | Cuando busques un componente, screen o servicio del frontend |
| [🔗 IMPORTS_GUIDE.md](./IMPORTS_GUIDE.md) | **Guía de imports y dependencias** | Cuando necesites saber cómo importar algo o crear un nuevo módulo |

---

## 🚀 GUÍA RÁPIDA POR TAREAS

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
