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
- **Entry:** `src/main.ts`
- **Módulo raíz:** `src/app.module.ts`

### Frontend: `C_Ticket_Apk_STV/`
- **Framework:** React Native (Expo)
- **UI:** Tamagui
- **Estado:** Zustand
- **Navegación:** React Navigation
- **Entry:** `App.tsx`
- **Código:** `src/`

### Documentación completa en: `.qwen/`
- **INDEX.md** - Índice maestro
- **CEREBRO.md** - Contexto completo del proyecto
- **BACKEND_INDEX.md** - Mapa del backend
- **FRONTEND_INDEX.md** - Mapa del frontend
- **IMPORTS_GUIDE.md** - Guía de imports

### Reglas importantes:
1. NO eliminar campo `Control_Usuario` (identificador único de usuarios)
2. CORS abierto para desarrollo - cerrar en producción
3. MongoDB debe estar corriendo antes de iniciar backend
4. Backend y frontend deben estar en misma red WiFi
5. Usar Guards para proteger endpoints
6. Usar Tamagui para UI del frontend
7. Verificar permisos con RBAC antes de mostrar UI

### Para modificar:
- **Nuevo módulo backend:** Crear en `src/Modules/`, agregar schema en `src/Models/`, importar en `app.module.ts`
- **Nueva pantalla frontend:** Crear en `src/screens/P_Nombre/`, agregar ruta en `AppNavigator.tsx`
- **Cambiar URL backend:** Editar `C_Ticket_Apk_STV/src/constants/index.ts`

---

> **Última actualización:** 2026-04-06
> **Mantener este archivo actualizado con cambios importantes**
