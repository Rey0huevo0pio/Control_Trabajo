# 📂 ÍNDICE DEL BACKEND - backen_cerebro/

> **Mapa detallado de archivos y rutas del backend NestJS**
> 
> **Propósito:** Referencia rápida para localizar archivos y entender la estructura

---

## 🗺️ MAPA DE ARCHIVOS

### Entry Points

```
backen_cerebro/
├── package.json                    # Dependencias y scripts
├── tsconfig.json                   # Configuración TypeScript
├── nest-cli.json                   # Configuración NestJS CLI
├── .env.example                    # Variables de entorno de ejemplo
├── .prettierrc                     # Configuración Prettier
├── eslint.config.mjs               # Configuración ESLint
└── src/
    ├── main.ts                     # 🚀 PUNTO DE ENTRADA - Bootstrap del servidor
    ├── app.module.ts               # 📦 MÓDULO RAÍZ - Importa todos los módulos
    ├── app.controller.ts           # Controlador principal (health check, info)
    └── app.service.ts              # Servicio principal
```

---

## 📦 MÓDULOS (src/Modules/)

### 🔐 Auth Module
**Ruta:** `src/Modules/Auth/`
**Propósito:** Autenticación y autorización JWT

| Archivo | Función |
|---------|---------|
| `auth.module.ts` | Configuración del módulo, imports de Passport/JWT |
| `auth.service.ts` | Lógica de login, register, validación de credenciales |
| `jwt.strategy.ts` | Estrategia Passport para JWT, extracción del token |

**Endpoints que genera:**
- `POST /api/auth/register`
- `POST /api/auth/login`

---

### 👤 Users Module
**Ruta:** `src/Modules/Users/`
**Propósito:** Gestión CRUD de usuarios

| Archivo | Función |
|---------|---------|
| `users.module.ts` | Configuración del módulo, inyección de Mongoose |
| `users.service.ts` | Lógica de CRUD de usuarios |

**Endpoints que genera:**
- `GET /api/users`
- `GET /api/users/:id`
- `PATCH /api/users/:id`
- `DELETE /api/users/:id`

---

### 👥 Usuarios Module
**Ruta:** `src/Modules/Usuarios/`
**Propósito:** [Placeholder/Módulo secundario de usuarios]

| Archivo | Función |
|---------|---------|
| `usuarios.module.ts` | Módulo básico (posiblemente para extensión futura) |

---

### 🏢 Instalaciones Module
**Ruta:** `src/Modules/Instalaciones/`
**Propósito:** Gestión de instalaciones y áreas de trabajo

| Archivo | Función |
|---------|---------|
| `instalaciones.module.ts` | Configuración del módulo |
| `instalaciones.controller.ts` | Controlador REST de instalaciones |
| `instalaciones.service.ts` | Lógica de negocio de instalaciones |
| `dto/` | DTOs para validación de requests |

**Endpoints que genera:**
- `GET /api/instalaciones`
- `POST /api/instalaciones`
- `PATCH /api/instalaciones/:id`
- `DELETE /api/instalaciones/:id`

---

### 🎫 TicketIT Module
**Ruta:** `src/Modules/TicketIT/`
**Propósito:** Sistema de tickets de soporte IT

| Archivo | Función |
|---------|---------|
| `ticket-it.module.ts` | Configuración del módulo |
| `ticket-it.controller.ts` | Controlador REST de tickets |
| `ticket-it.service.ts` | Lógica de negocio de tickets |
| `dto/` | DTOs para creación/edición de tickets |

**Endpoints que genera:**
- `GET /api/ticket-it`
- `POST /api/ticket-it`
- `PATCH /api/ticket-it/:id`
- `DELETE /api/ticket-it/:id`

---

### 💬 Chat Module
**Ruta:** `src/Modules/Chat/`
**Propósito:** Chat empresarial (grupal y privado)

| Archivo | Función |
|---------|---------|
| `chat.module.ts` | Configuración del módulo |
| `chat.controller.ts` | Controlador REST de chat |
| `chat.service.ts` | Lógica de negocio de mensajes |
| `dto/` | DTOs para mensajes |

**Endpoints que genera:**
- `GET /api/chat`
- `POST /api/chat`
- `PATCH /api/chat/:id`
- `DELETE /api/chat/:id`

---

### 📧 Email Module
**Ruta:** `src/Modules/Email/`
**Propósito:** Envío de correos electrónicos con nodemailer

| Archivo | Función |
|---------|---------|
| `email.module.ts` | Configuración del módulo |
| `email.service.ts` | Lógica de envío de emails |

**Endpoints que genera:**
- `POST /api/email/*` (endpoints específicos)

---

### 📁 Uploads Module
**Ruta:** `src/Modules/Uploads/`
**Propósito:** Subida y gestión de archivos

| Archivo | Función |
|---------|---------|
| `uploads.module.ts` | Configuración del módulo |
| `uploads.controller.ts` | Controlador de subida de archivos |
| `uploads.service.ts` | Lógica de almacenamiento de archivos |
| `dto/` | DTOs para validación de uploads |

**Endpoints que genera:**
- `POST /api/uploads`

**Archivos servidos estáticamente en:** `/uploads`

---

## 📊 MODELOS / SCHEMAS (src/Models/)

### Index Central
**Ruta:** `src/Models/index.ts`
**Propósito:** Exporta todos los modelos para importación única

---

### Usuarios
**Ruta:** `src/Models/Usuarios/`

| Archivo | Función |
|---------|---------|
| `usuario.schema.ts` | ⭐ **CRÍTICO** - Schema de Usuario, Roles, Permisos |
| `email-config.schema.ts` | Configuración de email por usuario |

**Colección MongoDB:** `usuarios`

---

### Instalaciones
**Ruta:** `src/Models/T_Instalaciones/`

| Archivo | Función |
|---------|---------|
| `index.ts` | Export de modelos de instalaciones |
| `T_Instalaciones.schema.ts` | Schema de instalaciones |
| `Area_Instalacion.schema.ts` | Schema de áreas de instalación |

**Colección MongoDB:** `t_instalaciones`

---

### Tickets IT
**Ruta:** `src/Models/T_ticket_IT_STV/`

| Archivo | Función |
|---------|---------|
| `index.ts` | Export de modelos de tickets |
| `T_ticket_IT_STV.schema.ts` | Schema principal de tickets |
| `T_Estado_Ticket.schema.ts` | Schema de estados de tickets |

**Colección MongoDB:** `t_ticket_it_stv`

---

### Chat STV
**Ruta:** `src/Models/T_Chat_STV/`

| Archivo | Función |
|---------|---------|
| `index.ts` | Export de modelos de chat |
| `T_Chat_STV.schema.ts` | Schema general de chat |
| `Chat_Grupo.schema.ts` | Schema de chat grupal |
| `Chat_Privado.schema.ts` | Schema de chat privado |

**Colección MongoDB:** `t_chat_stv`

---

## 🛡️ GUARDS (src/Guards/)

| Archivo | Función |
|---------|---------|
| `jwt-auth.guard.ts` | Verifica token JWT en requests protegidos |
| `roles.guard.ts` | Verifica roles del usuario (RBAC) |
| `permissions.guard.ts` | Verifica permisos específicos del usuario |
| `decorators.ts` | Decoradores `@Roles()` y `@Permissions()` |

**Uso típico:**
```typescript
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(RolUsuario.ADMIN)
@Get('admin-only')
getAdminOnly() { ... }
```

---

## 🎮 CONTROLLERS ADICIONALES (src/Controllers/)

| Carpeta | Función |
|---------|---------|
| `Email/` | Controladores específicos de email |
| `Usuarios/` | Controladores específicos de usuarios |

---

## 📝 DTOs (src/DTOs/)

**Propósito:** Data Transfer Objects para validación de requests

| Carpeta | Contenido |
|---------|-----------|
| (varias) | Clases con decoradores `class-validator` |

---

## 📂 UPLOADS (backen_cerebro/uploads/)

**Propósito:** Almacenamiento de archivos subidos por usuarios
**Acceso público:** `http://192.168.68.115:3000/uploads/[archivo]`

---

## 🔗 RUTAS DE IMPORTACIÓN TÍPICAS

### Desde un Module
```typescript
// Importar módulo
import { AuthModule } from './Modules/Auth/auth.module';

// Importar servicio
import { UsersService } from './Modules/Users/users.service';

// Importar controlador
import { ChatController } from './Modules/Chat/chat.controller';
```

### Desde un Controller
```typescript
// Importar decoradores
import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';

// Importar guards
import { JwtAuthGuard } from '../../Guards/jwt-auth.guard';
import { RolesGuard } from '../../Guards/roles.guard';

// Importar DTOs
import { CreateTicketDto } from './dto/create-ticket.dto';

// Importar servicios
import { TicketItService } from './ticket-it.service';
```

### Desde un Service
```typescript
// Importar Mongoose
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

// Importar modelos
import { Usuario, UsuarioDocument } from '../../Models/Usuarios/usuario.schema';
import { TicketIT, TicketITDocument } from '../../Models/T_ticket_IT_STV';
```

### Desde un Model
```typescript
// Importar Mongoose decorators
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

// Tipo de documento
export type UsuarioDocument = Usuario & Document;
```

---

## 📊 RESUMEN DE COLECCIONES MONGODB

| Colección | Schema | Módulo que la usa |
|-----------|--------|-------------------|
| `usuarios` | `UsuarioSchema` | Auth, Users |
| `t_instalaciones` | `InstalacionSchema` | Instalaciones |
| `t_ticket_it_stv` | `TicketITSchema` | TicketIT |
| `t_chat_stv` | `ChatSTVSchema` | Chat |
| `area_instalaciones` | `AreaInstalacionSchema` | Instalaciones |
| `t_estado_ticket` | `EstadoTicketHistorialSchema` | TicketIT |

---

## ⚙️ VARIABLES DE ENTORNO (.env)

```env
# Base de datos
MONGODB_URI=mongodb://127.0.0.1:27017/STV_Global

# Servidor
PORT=3000

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=24h

# Email (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu-email@gmail.com
SMTP_PASS=tu-password
```

---

> **NOTA:** Este índice debe actualizarse cuando se agreguen nuevos módulos o archivos.
