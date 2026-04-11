# 🧠 CEREBRO DEL PROYECTO - STV Global

> **Documento maestro de contexto y arquitectura del proyecto Control_Trabajo**
> 
> **Fecha de creación:** 2026-04-06
> **Última actualización:** 2026-04-06

---

## 📋 RESUMEN EJECUTIVO

**Proyecto:** Sistema integral de gestión STV (Seguridad, Tickets, Chat, Instalaciones)
**Tipo:** Fullstack - Backend API + Aplicación Móvil React Native
**Propósito:** Sistema de control para vigilancia, tickets de soporte IT, chat empresarial, gestión de instalaciones y documentación.

---

## 🏗️ ARQUITECTURA GENERAL

```
Control_Trabajo/
├── backen_cerebro/          # Backend API (NestJS + MongoDB)
├── C_Ticket_Apk_STV/        # Frontend Mobile (React Native + Expo + Tamagui)
├── Chat_STV_Movil/          # [Módulo secundario - Chat]
├── Web-Flonten/             # [Módulo secundario - Web]
└── .qwen/                   # 🧠 CEREBRO - Documentación de contexto
    └── CEREBRO.md           # Este archivo
```

---

## 🗄️ BACKEND - backen_cerebro/

### Stack Tecnológico
- **Framework:** NestJS 11 (Node.js + TypeScript)
- **Base de Datos:** MongoDB 9 (Mongoose ODM)
- **Autenticación:** JWT + Passport (passport-jwt, passport-local)
- **Validación:** class-validator + class-transformer
- **Email:** nodemailer
- **Servidor:** Express 5
- **Puerto por defecto:** 3000

### Estructura de Carpetas

```
backen_cerebro/src/
├── main.ts                      # Entry point - Configuración del servidor
├── app.module.ts                # Módulo raíz - Importa todos los módulos
├── app.controller.ts            # Controlador raíz
├── app.service.ts               # Servicio raíz
│
├── Modules/                     # 📦 MÓDULOS DE LA APLICACIÓN
│   ├── Auth/                    # 🔐 Autenticación (login, register, JWT)
│   ├── Users/                   # 👤 Gestión de usuarios (servicio)
│   ├── Usuarios/                # 👥 Módulo de usuarios (vacío/placeholder)
│   ├── Instalaciones/           # 🏢 Gestión de instalaciones y áreas
│   ├── TicketIT/                # 🎫 Sistema de tickets de soporte IT
│   ├── Chat/                    # 💬 Chat empresarial (grupal y privado)
│   ├── Email/                   # 📧 Servicio de envío de correos
│   └── Uploads/                 # 📁 Subida de archivos
│
├── Controllers/                 # 🎮 Controladores adicionales
│   ├── Email/                   # Controladores de email
│   └── Usuarios/                # Controladores de usuarios
│
├── Models/                      # 📊 SCHEMAS DE MONGODB
│   ├── index.ts                 # Export central de modelos
│   ├── Usuarios/                # Schema de usuarios y configuración email
│   │   ├── usuario.schema.ts    # Schema principal de usuario
│   │   └── email-config.schema.ts
│   ├── T_Instalaciones/         # Schemas de instalaciones
│   │   ├── index.ts
│   │   ├── T_Instalaciones.schema.ts
│   │   └── Area_Instalacion.schema.ts
│   ├── T_ticket_IT_STV/         # Schemas de tickets IT
│   │   ├── index.ts
│   │   ├── T_ticket_IT_STV.schema.ts
│   │   └── T_Estado_Ticket.schema.ts
│   └── T_Chat_STV/              # Schemas de chat
│       ├── index.ts
│       ├── T_Chat_STV.schema.ts
│       ├── Chat_Grupo.schema.ts
│       └── Chat_Privado.schema.ts
│
├── DTOs/                        # 📝 Data Transfer Objects
├── Guards/                      # 🛡️ Guards y Decoradores
│   ├── jwt-auth.guard.ts        # Guard de autenticación JWT
│   ├── roles.guard.ts           # Guard de roles (RBAC)
│   ├── permissions.guard.ts     # Guard de permisos
│   └── decorators.ts            # Decoradores personalizados (@Roles, @Permissions)
│
└── uploads/                     # 📂 Archivos subidos (servidos estáticamente)
```

### Endpoints de la API

**Prefijo global:** `/api`

| Módulo | Método | Endpoint | Descripción | Auth |
|--------|--------|----------|-------------|------|
| **Auth** | POST | `/auth/register` | Registrar nuevo usuario | ❌ |
| **Auth** | POST | `/auth/login` | Iniciar sesión | ❌ |
| **Users** | GET | `/users` | Listar usuarios | ✅ |
| **Users** | GET | `/users/:id` | Obtener usuario por ID | ✅ |
| **Users** | PATCH | `/users/:id` | Actualizar usuario | ✅ |
| **Users** | DELETE | `/users/:id` | Eliminar usuario | ✅ |
| **Instalaciones** | *CRUD* | `/instalaciones` | Gestión de instalaciones | ✅ |
| **TicketIT** | *CRUD* | `/ticket-it` | Sistema de tickets | ✅ |
| **Chat** | *CRUD* | `/chat` | Chat empresarial | ✅ |
| **Email** | POST | `/email/*` | Envío de correos | ✅ |
| **Uploads** | POST | `/uploads` | Subir archivos | ✅ |

### Sistema de Roles y Permisos (RBAC)

**Roles disponibles:**
- `vigilante` - Acceso básico: dashboard, chat, tickets (crear/ver), archivero (ver)
- `supervisor` - Vigilante + reportes, asignar tickets, crear grupos chat
- `rh` - Gestión usuarios, reportes, chat admin, tickets (editar), archivero (compartir)
- `it` - Acceso total: todos los permisos CRUD en todos los módulos
- `admin` - **Todos los permisos** sin restricciones

**Permisos por categoría:**
- `USUARIOS_*` - Gestión de usuarios
- `DASHBOARD_*` - Acceso al dashboard
- `REPORTES_*` - Reportes y exportación
- `INVENTARIO_*` - Gestión de inventario
- `RONDINES_*` - Rondines de vigilancia
- `CHAT_*` - Chat grupal y privado
- `TICKETS_*` - Sistema de tickets IT
- `ARCHIVERO_*` - Gestión documental
- `INSTALACIONES_*` - Gestión de instalaciones
- `NOTICIAS_*` - Gestión de noticias

### Conexión a Base de Datos

```
MongoDB URI: MONGODB_URI (desde .env) o mongodb://127.0.0.1:27017/STV_Global
Base de datos: STV_Global
```

### Configuración Clave

```typescript
// main.ts
app.setGlobalPrefix('api');           // Prefijo global
app.enableCors({ origin: true });     // CORS habilitado (desarrollo)
app.useGlobalPipes(new ValidationPipe({ whitelist: true })); // Validación
app.use('/uploads', express.static('uploads')); // Archivos estáticos
```

---

## 📱 FRONTEND - C_Ticket_Apk_STV/

### Stack Tecnológico
- **Framework:** React Native (Expo SDK)
- **UI Framework:** Tamagui
- **Navegación:** React Navigation
- **Estado Global:** Zustand
- **HTTP Client:** Axios
- **Lenguaje:** TypeScript

### 🏗️ ARQUITECTURA MULTI-MÓDULO

El frontend está organizado en **módulos independientes** que se conectan al `src` principal (padre).

```
C_Ticket_Apk_STV/
├── src/                           # 🎯 MÓDULO PRINCIPAL (PADRE)
│   ├── components/                # Componentes reutilizables globales
│   ├── screens/                   # Pantallas principales
│   │   ├── P_Auth/                # Autenticación (Login, Register)
│   │   ├── P_Principal/           # Pantallas principales (Home)
│   │   ├── Components_Usuarios/   # Gestión de usuarios
│   │   └── index.ts               # Export central
│   ├── navigation/                # Navegación principal
│   │   └── AppNavigator.tsx       # ⭐ Conecta TODOS los módulos
│   ├── store/                     # Zustand stores (auth, etc.)
│   ├── services/                  # Llamadas a API (axios)
│   ├── hooks/                     # Custom hooks
│   ├── constants/                 # Constantes globales
│   ├── types/                     # TypeScript types globales
│   ├── utils/                     # Funciones utilitarias
│   └── lib/                       # Configuraciones (tamagui)
│
├── src_Archivero_STV/             # 📁 MÓDULO ARCHIVERO (Gestión documental)
│   ├── index.ts                   # Export del módulo
│   ├── navigation/
│   │   └── ArchiveroNavigator.tsx # Navegación interna del módulo
│   ├── screens/                   # 7 screens del módulo
│   │   ├── ArchiveroHomeScreen.tsx
│   │   ├── ArchiveroDetalleScreen.tsx
│   │   ├── CarpetaDetalleScreen.tsx
│   │   ├── CrearArchiveroScreen.tsx
│   │   ├── GestionarMiembrosScreen.tsx
│   │   ├── EscanearDocumentoScreen.tsx
│   │   └── index.ts
│   └── types/                     # Types específicos del módulo
│
├── src_Chat_STV/                  # 💬 MÓDULO CHAT (Chat + Email + Noticias)
│   ├── index.ts                   # Export del módulo
│   ├── navigation/
│   │   └── ChatNavigator.tsx      # Navegación interna del módulo
│   ├── screens/                   # 8 screens del módulo
│   │   ├── ChatHomeScreen.tsx
│   │   ├── PrivateChatsScreen.tsx
│   │   ├── GroupChatsScreen.tsx
│   │   ├── EmployeeDirectoryScreen.tsx
│   │   ├── NewsBoardScreen.tsx
│   │   ├── ChatSearchScreen.tsx
│   │   ├── Componets_Correos/     # Componentes de email
│   │   └── index.ts
│   ├── services/                  # Servicios de email
│   │   ├── emailCache.service.ts
│   │   └── emailMessages.service.ts
│   └── types/                     # Types específicos del módulo
│
├── src_Instalaciones_STV/         # 🏢 MÓDULO INSTALACIONES
│   ├── navigation/
│   │   └── InstalacionNavigator.tsx # Navegación interna del módulo
│   ├── screens/                   # 4 screens del módulo
│   │   ├── InstalacionesHomeScreen.tsx
│   │   ├── RegistroInstalacionScreen.tsx
│   │   ├── DetalleInstalacionScreen.tsx
│   │   ├── RegistroAreaScreen.tsx
│   │   └── index.ts
│   ├── components/                # Componentes específicos
│   ├── module/                    # Configuración del módulo
│   │   └── index.ts
│   ├── lib/                       # Configuraciones específicas
│   └── types/                     # Types específicos del módulo
│
├── src_P_Ticket_IT/               # 🎫 MÓDULO TICKETS IT
│   ├── index.ts                   # Export del módulo
│   ├── navigation/
│   │   └── TicketNavigator.tsx    # Navegación interna del módulo
│   ├── screens/
│   │   ├── TicketHomeScreen.tsx
│   │   └── index.ts
│   ├── module/                    # Submódulos
│   │   ├── P_Chat_IT-Usuarios/    # Chat IT-Usuarios
│   │   ├── P_Registro_Solicitudo/ # Registro de solicitudes
│   │   ├── P_Registro_Usuario/    # Registro usuarios
│   │   └── P_Solicitudes_R_S/     # Solicitudes R/S
│   ├── lib/                       # Configuraciones
│   └── types/                     # Types específicos del módulo
│
└── src_Archivero_STV/             # (ver arriba)
```

### 🔗 CONEXIÓN ENTRE MÓDULOS

**Flujo de navegación:**
```
App.tsx
  └─ AppNavigator (src/navigation/)
      ├─ Login (src/screens/P_Auth/)
      └─ Home (src/screens/P_Principal/)
          ├─→ InstalacionesHome (src_Instalaciones_STV/)
          ├─→ TicketsHome (src_P_Ticket_IT/)
          ├─→ ChatHome (src_Chat_STV/)
          ├─→ ArchiveroHome (src_Archivero_STV/)
          └─→ UserManagement (src/screens/Components_Usuarios/)
```

**Cómo se conectan:**
1. `AppNavigator.tsx` importa los Navigators de cada módulo
2. Cada módulo tiene su propio Navigator interno
3. El `src` principal comparte: store, services, constants, types
4. Los módulos específicos tienen sus propios types y componentes

### Configuración de API

```typescript
// src/constants/index.ts
export const API_URL = 'http://192.168.1.100:3000' // Configurar IP del backend
```

### Otros módulos frontend

| Carpeta | Descripción | Screens | Navegación |
|---------|-------------|---------|------------|
| `src/` | App principal - Auth, Home, Users | 2+ | AppNavigator |
| `src_Archivero_STV/` | Gestión documental | 7 | ArchiveroNavigator |
| `src_Chat_STV/` | Chat + Email + Noticias | 8 | ChatNavigator |
| `src_Instalaciones_STV/` | Gestión de instalaciones | 4 | InstalacionNavigator |
| `src_P_Ticket_IT/` | Tickets IT + Solicitudes | 1+ | TicketNavigator |

---

## 🔄 FLUJO DE DATOS

```
┌─────────────┐     HTTP/Axios      ┌──────────────────┐
│  FRONTEND   │ ──────────────────> │     BACKEND      │
│ React Native │ <────────────────── │    NestJS API    │
│  (Expo)     │   JSON Response     │  (MongoDB)       │
└─────────────┘                     └──────────────────┘
       │                                    │
       ▼                                    ▼
  Tamagui UI                           Mongoose Models
  Zustand Store                        Controllers
  React Navigation                     Services
                                       Guards (Auth)
```

---

## 📌 PUNTOS CLAVE PARA MODIFICACIONES

### ➕ Agregar nuevo módulo al Backend

1. Crear carpeta en `src/Modules/NuevoModulo/`
2. Crear: `nuevo-modulo.module.ts`, `nuevo-modulo.controller.ts`, `nuevo-modulo.service.ts`
3. Crear schema en `src/Models/NuevoModulo/`
4. Exportar modelo desde `src/Models/index.ts`
5. Importar módulo en `src/app.module.ts`
6. Crear DTOs en `src/DTOs/NuevoModulo/` (si aplica)

### ➕ Agregar nueva pantalla al Frontend

1. Crear carpeta en `src/screens/P_NombreModulo/`
2. Crear componente `NombreScreen.tsx`
3. Agregar ruta en `src/navigation/AppNavigator.tsx`
4. Si necesita estado, agregar a `src/store/`
5. Si necesita API, agregar servicio en `src/services/`

### 🔑 Archivos Críticos

| Archivo | Importancia |
|---------|-------------|
| `backen_cerebro/src/app.module.ts` | Módulo raíz - TODOS los imports |
| `backen_cerebro/src/main.ts` | Entry point - CORS, validación, puerto |
| `backen_cerebro/src/Models/Usuarios/usuario.schema.ts` | Schema de usuario + ROLES + PERMISOS |
| `backen_cerebro/src/Guards/` | Guards de autenticación y autorización |
| `C_Ticket_Apk_STV/src/constants/index.ts` | URL del backend |
| `C_Ticket_Apk_STV/src/store/` | Estado global (auth, permisos) |

---

## 🚨 REGLAS IMPORTANTES

1. **NO eliminar** el campo `Control_Usuario` del schema de usuario (es identificador único)
2. **Mantener sincronizados** los roles entre backend y frontend
3. **Siempre usar** los Guards para proteger endpoints
4. **CORS está abierto** para desarrollo - cerrar en producción
5. **Los archivos subidos** van a `backen_cerebro/uploads/`
6. **MongoDB debe estar corriendo** antes de iniciar el backend
7. **Validación automática** con class-validator - no remover

---

## 📚 DOCUMENTACIÓN ADICIONAL

- `backen_cerebro/README.md` - Documentación del backend
- `backen_cerebro/README_API.md` - Documentación de la API
- `C_Ticket_Apk_STV/ARQUITECTURA.md` - Documentación del frontend
- `C_Ticket_Apk_STV/NETWORK_SETUP.md` - Configuración de red

---

## 🧭 GUÍA RÁPIDA DE NAVEGACIÓN

| Necesito... | Ve a... |
|-------------|---------|
| Agregar endpoint | `src/Modules/[Modulo]/[modulo].controller.ts` |
| Cambiar lógica de negocio | `src/Modules/[Modulo]/[modulo].service.ts` |
| Modificar schema de BD | `src/Models/[Coleccion]/[schema].schema.ts` |
| Agregar rol/permiso | `src/Models/Usuarios/usuario.schema.ts` |
| Cambiar autenticación | `src/Modules/Auth/` |
| Agregar pantalla móvil | `src/screens/P_NombreModulo/` |
| Cambiar URL del backend | `src/constants/index.ts` (frontend) |
| Modificar estado global | `src/store/` (frontend) |

---

> **NOTA:** Este archivo es el punto de referencia principal. Cualquier cambio en la arquitectura debe reflejarse aquí.
