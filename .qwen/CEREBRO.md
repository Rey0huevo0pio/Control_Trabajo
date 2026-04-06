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

### Estructura de Carpetas

```
C_Ticket_Apk_STV/src/
├── components/          # Componentes reutilizables
├── screens/             # 🖼️ PANTALLAS
│   ├── P_Auth/          # Autenticación (Login, Register)
│   ├── P_Principal/     # Pantallas principales
│   ├── Components_Usuarios/  # Componentes de usuarios
│   └── index.ts         # Export central
├── navigation/          # Configuración de navegación
├── store/               # Zustand stores (auth, etc.)
├── services/            # Llamadas a API (axios)
├── modules/             # [Vacío - Para futuros módulos]
├── hooks/               # Custom hooks (usePermissions, etc.)
├── constants/           # Constantes (API_URL, roles, colores)
├── types/               # TypeScript interfaces/types
├── utils/               # Funciones utilitarias
└── lib/                 # Configuraciones (tamagui)
```

### Otros módulos frontend

| Carpeta | Descripción |
|---------|-------------|
| `src/` | App principal - C Ticket APK STV |
| `src_Archivero_STV/` | Módulo de gestión documental |
| `src_Chat_STV/` | Módulo de chat empresarial |
| `src_Instalaciones_STV/` | Módulo de instalaciones |
| `src_P_Ticket_IT/` | Módulo de tickets IT |

### Configuración de API

```typescript
// src/constants/index.ts
export const API_URL = 'http://192.168.1.100:3000' // Configurar IP del backend
```

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
