# 📝 CHANGELOG - Historial de Cambios

> **Registro de todos los cambios significativos en el proyecto**
> 
> **Propósito:** Tener historial de qué se cambió, cuándo y por qué

---

## 2026-04-06 - CREACIÓN DEL CEREBRO

### 🧠 Documentación Creada

**Archivos de Cerebro (.qwen/):**
- ✅ `INDEX.md` - Índice maestro con sistema de autoactualización
- ✅ `CEREBRO.md` - Contexto completo del proyecto con arquitectura multi-módulo
- ✅ `BACKEND_INDEX.md` - Mapa detallado del backend (8 módulos)
- ✅ `FRONTEND_INDEX.md` - Mapa detallado del frontend (5 módulos)
- ✅ `IMPORTS_GUIDE.md` - Guía completa de imports backend/frontend
- ✅ `CONTEXT.md` - Contexto persistente para carga automática
- ✅ `ENDPOINTS.md` - Todos los 34 endpoints documentados
- ✅ `FLUJOS.md` - 8 flujos de negocio completos paso a paso
- ✅ `DECISIONES.md` - Decisiones técnicas y por qué se eligió cada cosa
- ✅ `skills/doc-auto-update.md` - Skill de autoactualización

**Archivos Comentados Backend:**
- ✅ `src/main.ts` - Entry point con explicación completa
- ✅ `src/app.module.ts` - Módulo raíz con lista de módulos
- ✅ `src/Modules/Auth/auth.module.ts` - Configuración JWT
- ✅ `src/Modules/Auth/auth.service.ts` - Lógica de autenticación
- ✅ `src/Controllers/Usuarios/auth.controller.ts` - Endpoints auth
- ✅ `src/Guards/jwt-auth.guard.ts` - Guard de JWT
- ✅ `src/Guards/roles.guard.ts` - Guard de roles RBAC

**Archivos Comentados Frontend:**
- ✅ `App.tsx` - Componente raíz con providers
- ✅ `src/store/authStore.ts` - Estado global de autenticación
- ✅ `src/navigation/AppNavigator.tsx` - Navegación principal

### 🏗️ Arquitectura Documentada

**Backend (8 módulos):**
- Auth - Autenticación JWT
- Users - CRUD de usuarios
- Usuarios - Módulo secundario
- Instalaciones - Gestión de instalaciones
- TicketIT - Tickets de soporte
- Chat - Chat empresarial
- Email - Envío de correos
- Uploads - Subida de archivos

**Frontend (5 módulos):**
- `src/` - Principal (Auth, Home, Users)
- `src_Archivero_STV/` - Gestión documental (7 screens)
- `src_Chat_STV/` - Chat + Email + Noticias (8 screens)
- `src_Instalaciones_STV/` - Instalaciones (4 screens)
- `src_P_Ticket_IT/` - Tickets IT (1+ screens)

### 📊 Documentación Técnica

- **34 endpoints** documentados con DTOs y responses
- **8 flujos de negocio** completos (registro, login, auth, tickets, etc.)
- **Decisiones técnicas** explicadas (por qué NestJS, MongoDB, JWT, etc.)
- **Sistema de autoactualización** para mantener docs sync con código

---

> **NOTA:** Agregar entradas nuevas cuando se hagan cambios significativos.

## TEMPLATE PARA NUEVAS ENTRADAS:

```markdown
## YYYY-MM-DD - TÍTULO DEL CAMBIO

### 📝 Qué se cambió
- Descripción del cambio

### 🔧 Archivos modificados
- `ruta/archivo.ts` - Qué se hizo

### 📚 Documentación actualizada
- `.qwen/ARCHIVO.md` - Qué se actualizó

### 💡 Por qué
- Razón del cambio
```
