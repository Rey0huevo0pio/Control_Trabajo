# CONTEXTO DEL PROYECTO - CARGA AUTOMÁTICA

> **Este archivo se carga automáticamente en cada sesión de Qwen Code**
> **Propósito:** Que el asistente siempre sepa qué es este proyecto

---

## 🧠 RESUMEN RÁPIDO (para cargar en contexto)

**Proyecto:** Sistema integral STV Global (Seguridad, Tickets, Chat, Instalaciones)
**Tipo:** Fullstack - Backend API (NestJS) + App Móvil (React Native/Expo)

### Backend: `backen_cerebro/`
- **Framework:** NestJS 11 (TypeScript)
- **Base de datos:** MongoDB (Mongoose)
- **Puerto:** 3000
- **Auth:** JWT + Passport
- **Módulos:** Auth, Users, Usuarios, Instalaciones, TicketIT, Chat, Email, Uploads
- **Entry:** `src/main.ts` (comentado)
- **Módulo raíz:** `src/app.module.ts` (comentado)

### Frontend: `C_Ticket_Apk_STV/` - ARQUITECTURA MULTI-MÓDULO
- **Framework:** React Native (Expo)
- **UI:** Tamagui
- **Estado:** Zustand
- **Navegación:** React Navigation
- **Entry:** `App.tsx` (comentado)

#### Módulos del Frontend:
| Módulo | Ruta | Screens | Navegación | Propósito |
|--------|------|---------|------------|-----------|
| **Principal** | `src/` | 2+ | AppNavigator | Auth, Home, Users, Store, Services |
| **Archivero** | `src_Archivero_STV/` | 7 | ArchiveroNavigator | Gestión documental |
| **Chat** | `src_Chat_STV/` | 8 | ChatNavigator | Chat + Email + Noticias |
| **Instalaciones** | `src_Instalaciones_STV/` | 4 | InstalacionNavigator | Gestión instalaciones |
| **Tickets IT** | `src_P_Ticket_IT/` | 1+ | TicketNavigator | Tickets + Solicitudes |

#### Conexión de módulos:
- **Conector central:** `src/navigation/AppNavigator.tsx`
- **Recursos compartidos:** `src/store/`, `src/services/`, `src/constants/`, `src/types/`
- **Cada módulo:** Tiene su propia navegación, screens y types específicos

**Archivos comentados:**
- ✅ `C_Ticket_Apk_STV/App.tsx`
- ✅ `C_Ticket_Apk_STV/src/store/authStore.ts`
- ✅ `C_Ticket_Apk_STV/src/navigation/AppNavigator.tsx`

### 🔄 SISTEMA DE AUTOACTUALIZACIÓN
- **Skill:** `.qwen/skills/doc-auto-update.md`
- **Función:** Detecta cambios y actualiza documentación automáticamente
- **Ejecución:** Después de cada cambio en código, antes de commit, o cuando se pide
- **Qué hace:** Actualiza índices, documenta código nuevo, mantiene sync

### 📚 Documentación completa en: `.qwen/`
- **INDEX.md** - Índice maestro + info de autoactualización
- **CEREBRO.md** - Contexto completo del proyecto
- **BACKEND_INDEX.md** - Mapa del backend
- **FRONTEND_INDEX.md** - Mapa del frontend
- **IMPORTS_GUIDE.md** - Guía de imports
- **ENDPOINTS.md** - 🔌 Todos los 34 endpoints con DTOs y responses
- **FLUJOS.md** - 🔄 8 flujos de negocio paso a paso
- **DECISIONES.md** - 🎯 Por qué se eligió cada tecnología/patrón
- **DESIGN_SYSTEM.md** - 🎨 **TODOS los estilos Tamagui** - ⭐ NO cambiar sin confirmar
- **CHANGELOG.md** - 📝 Historial de cambios
- **CONTEXT.md** - Este archivo (resumen rápido)

### 🎨 PROTECCIÓN DE DISEÑOS
**ANTES d e modificar cualquier estiloTamagui:**
1. Leer `DESIGN_SYSTEM.md`
2. Preguntar al usuario qué quiere cambiar
3. Mostrar diseño antes/después
4. Esperar confirmación
5. Si confirma → modificar Y actualizar DESIGN_SYSTEM.md

**NO CAMBIAR sin permiso:**
- Colores de componentes
- Spacing, padding, margin
- Border radius
- Font sizes
- Tamaños de botones/cards/inputs
- Variantes de design-system

### 💬 COMENTARIOS EN CÓDIGO
Todos los archivos clave tienen comentarios explicativos con:
- Qué hace el archivo
- Conexiones con otros archivos (rutas relativas)
- Endpoints que genera (backend)
- Cómo modificarlo

**Archivos comentados Backend:**
- ✅ `src/main.ts` - Entry point
- ✅ `src/app.module.ts` - Módulo raíz
- ✅ `src/Modules/Auth/auth.module.ts` - Auth JWT
- ✅ `src/Modules/Auth/auth.service.ts` - Lógica auth
- ✅ `src/Controllers/Usuarios/auth.controller.ts` - Endpoints auth
- ✅ `src/Guards/jwt-auth.guard.ts` - Guard JWT
- ✅ `src/Guards/roles.guard.ts` - Guard Roles RBAC

**Archivos comentados Frontend:**
- ✅ `App.tsx` - Componente raíz
- ✅ `src/store/authStore.ts` - Estado global
- ✅ `src/navigation/AppNavigator.tsx` - Navegación principal

### Reglas importantes:
1. NO eliminar campo `Control_Usuario` (identificador único de usuarios)
2. CORS abierto para desarrollo - cerrar en producción
3. MongoDB debe estar corriendo antes de iniciar backend
4. Backend y frontend deben estar en misma red WiFi
5. Usar Guards para proteger endpoints
6. Usar Tamagui para UI del frontend
7. Verificar permisos con RBAC antes de mostrar UI
8. **La documentación se actualiza automáticamente** - no mantener manualmente

### Para modificar:
- **Nuevo módulo backend:** Crear en `src/Modules/`, agregar schema en `src/Models/`, importar en `app.module.ts`
- **Nueva pantalla frontend:** Crear en `src/screens/P_Nombre/`, agregar ruta en `AppNavigator.tsx`
- **Cambiar URL backend:** Editar `C_Ticket_Apk_STV/src/constants/index.ts`

### Flujo de trabajo con autoactualización:
1. Haces el cambio en el código
2. El asistente detecta cambios (git diff)
3. Actualiza la documentación automáticamente
4. Tú solo pasas `@.qwen/INDEX.md` en nuevo chat y todo está actualizado

---

> **Última actualización:** 2026-04-06
> **Sistema de autoactualización:** ACTIVO
> **Mantener este archivo actualizado con cambios importantes**
