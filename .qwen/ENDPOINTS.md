# 🔌 ENDPOINTS COMPLETOS - API STV Global

> **Documentación de TODOS los endpoints de la API**
> 
> **Propósito:** Saber exactamente qué hace cada endpoint, qué DTO usa y qué response da
> 
> **Prefijo global:** `/api`

---

## 🔐 AUTH - Autenticación

**Controller:** `src/Controllers/Usuarios/auth.controller.ts`
**Service:** `src/Modules/Auth/auth.service.ts`
**Base URL:** `/api/auth`

### POST /api/auth/register

**Qué hace:** Registra un nuevo usuario en el sistema
**Auth requerida:** ❌ No
**DTO:** `CreateUsuarioDto` (src/DTOs/usuario.dto.ts)

**Request Body:**
```typescript
{
  Control_Usuario: string;    // Obligatorio, único, uppercase
  password: string;           // Obligatorio, mínimo 6 chars
  nombre: string;             // Obligatorio
  apellido: string;           // Obligatorio
  rol?: RolUsuario;           // Opcional, default: VIGILANTE
  email?: string;
  telefono?: string;
  fechaIngreso?: Date;
  departamento?: string;
  puesto?: string;
}
```

**Response 201:**
```typescript
{
  success: true;
  message: "Usuario registrado correctamente";
  data: {
    user: {
      id: string;
      Control_Usuario: string;
      nombre: string;
      apellido: string;
      rol: RolUsuario;
      activo: boolean;
      telefono: string;
      fechaIngreso: Date;
      permisos: Permiso[];  // Asignados según rol
    };
    token: string;  // JWT token
  }
}
```

**Errores:**
- `409 Conflict` → Control_Usuario ya existe
- `400 Bad Request` → DTO inválido

**Flujo:**
1. Verifica que Control_Usuario no exista
2. Hashea password con bcrypt (salt 10)
3. Asigna rol por defecto (VIGILANTE) si no se proporciona
4. Asigna permisos según PERMISOS_POR_ROL[rol]
5. Guarda usuario
6. Genera token JWT
7. Retorna usuario sanitizado + token

---

### POST /api/auth/login

**Qué hace:** Autentica usuario y genera token JWT
**Auth requerida:** ❌ No
**DTO:** `LoginDto` (src/DTOs/usuario.dto.ts)

**Request Body:**
```typescript
{
  Control_Usuario: string;  // Obligatorio
  password: string;          // Obligatorio
}
```

**Response 200:**
```typescript
{
  success: true;
  message: "Login exitoso";
  data: {
    user: {
      id: string;
      Control_Usuario: string;
      nombre: string;
      apellido: string;
      rol: RolUsuario;
      activo: boolean;
      telefono: string;
      fechaIngreso: Date;
      permisos: Permiso[];
    };
    token: string;  // JWT token
  }
}
```

**Errores:**
- `401 Unauthorized` → Credenciales inválidas o usuario inactivo

**Flujo:**
1. Busca usuario por Control_Usuario
2. Verifica que exista
3. Verifica que esté activo
4. Compara password con bcrypt.compare
5. Genera token JWT
6. Retorna usuario sanitizado + token

---

## 👤 USERS - Gestión de Usuarios

**Controller:** `src/Controllers/Usuarios/users.controller.ts`
**Service:** `src/Modules/Users/users.service.ts`
**Base URL:** `/api/users`
**Guards:** JwtAuthGuard, RolesGuard (ADMIN, IT, RH)

### GET /api/users

**Qué hace:** Lista todos los usuarios (sin passwords)
**Auth requerida:** ✅ Sí
**Roles:** ADMIN, IT, RH

**Query Params:**
```typescript
{
  rol?: RolUsuario;          // Filtrar por rol
  activo?: boolean;          // Filtrar por estado
  search?: string;           // Buscar por nombre/apellido/control
  page?: number;             // Paginación
  limit?: number;            // Por página
}
```

**Response 200:**
```typescript
{
  success: true;
  data: Usuario[];  // Array de usuarios sanitizados
  total?: number;
  page?: number;
}
```

---

### GET /api/users/:id

**Qué hace:** Obtiene un usuario por ID
**Auth requerida:** ✅ Sí
**Roles:** ADMIN, IT, RH

**Response 200:**
```typescript
{
  success: true;
  data: Usuario;  // Usuario sanitizado
}
```

**Errores:**
- `404 Not Found` → Usuario no existe

---

### PATCH /api/users/:id

**Qué hace:** Actualiza datos de un usuario
**Auth requerida:** ✅ Sí
**Roles:** ADMIN, IT, RH
**DTO:** `UpdateUsuarioDto` (src/DTOs/usuario.dto.ts)

**Request Body:**
```typescript
{
  nombre?: string;
  apellido?: string;
  rol?: RolUsuario;
  activo?: boolean;
  telefono?: string;
  email?: string;
  fechaIngreso?: Date;
  departamento?: string;
  puesto?: string;
}
```

**Response 200:**
```typescript
{
  success: true;
  message: "Usuario actualizado correctamente";
  data: Usuario;  // Usuario actualizado
}
```

**Errores:**
- `404 Not Found` → Usuario no existe

---

### DELETE /api/users/:id

**Qué hace:** Elimina (o desactiva) un usuario
**Auth requerida:** ✅ Sí
**Roles:** ADMIN, IT

**Response 200:**
```typescript
{
  success: true;
  message: "Usuario eliminado correctamente";
}
```

**Errores:**
- `404 Not Found` → Usuario no existe

---

## 🏢 INSTALACIONES

**Controller:** `src/Modules/Instalaciones/instalaciones.controller.ts`
**Service:** `src/Modules/Instalaciones/instalaciones.service.ts`
**Base URL:** `/api/instalaciones`
**Guards:** JwtAuthGuard

### GET /api/instalaciones

**Qué hace:** Lista todas las instalaciones
**Auth requerida:** ✅ Sí

**Response 200:**
```typescript
{
  success: true;
  data: Instalacion[];
}
```

---

### POST /api/instalaciones

**Qué hace:** Crea nueva instalación
**Auth requerida:** ✅ Sí
**DTO:** `CreateInstalacionDto` (src/Modules/Instalaciones/dto/instalacion.dto.ts)

**Request Body:**
```typescript
{
  nombre: string;
  direccion: string;
  coordenadas?: CoordenadasDto;  // { lat, lng }
  ubicacion?: UbicacionDto;      // { ciudad, estado, pais }
  descripcion?: string;
  activo?: boolean;
}
```

**Response 201:**
```typescript
{
  success: true;
  data: Instalacion;
}
```

---

### GET /api/instalaciones/:id

**Qué hace:** Obtiene instalación por ID
**Auth requerida:** ✅ Sí

**Response 200/404**

---

### PATCH /api/instalaciones/:id

**Qué hace:** Actualiza instalación
**Auth requerida:** ✅ Sí
**DTO:** `UpdateInstalacionDto`

**Response 200/404**

---

### DELETE /api/instalaciones/:id

**Qué hace:** Elimina instalación
**Auth requerida:** ✅ Sí

**Response 200/404**

---

### GET /api/instalaciones/:id/areas

**Qué hace:** Lista áreas de una instalación
**Auth requerida:** ✅ Sí

---

### POST /api/instalaciones/:id/areas

**Qué hace:** Crea área en instalación
**DTO:** `CreateAreaInstalacionDto`

---

### PATCH /api/instalaciones/:id/areas/:areaId

**Qué hace:** Actualiza área
**DTO:** `UpdateAreaInstalacionDto`

---

### DELETE /api/instalaciones/:id/areas/:areaId

**Qué hace:** Elimina área

---

## 🎫 TICKET IT

**Controller:** `src/Modules/TicketIT/ticket-it.controller.ts`
**Service:** `src/Modules/TicketIT/ticket-it.service.ts`
**Base URL:** `/api/tickets`
**Guards:** JwtAuthGuard

### GET /api/tickets

**Qué hace:** Lista todos los tickets
**Auth requerida:** ✅ Sí

**Query Params:**
```typescript
{
  estado?: string;
  prioridad?: string;
  asignadoA?: string;
  tipo?: string;
  page?: number;
  limit?: number;
}
```

**Response 200:**
```typescript
{
  success: true;
  data: TicketIT[];
}
```

---

### POST /api/tickets

**Qué hace:** Crea nuevo ticket de soporte IT
**Auth requerida:** ✅ Sí
**DTO:** `CreateTicketITDto` (src/Modules/TicketIT/dto/ticket-it.dto.ts)

**Request Body:**
```typescript
{
  titulo: string;
  descripcion: string;
  tipo?: TipoTicket;
  categoria?: CategoriaTicket;
  prioridad?: PrioridadTicket;
  asignadoA?: string;        // ID del usuario asignado
  contacto?: ContactoUsuarioDto;
  instalacionId?: string;
  archivos?: string[];
}
```

**Response 201:**
```typescript
{
  success: true;
  data: TicketIT;
}
```

---

### GET /api/tickets/:id

**Qué hace:** Obtiene ticket por ID
**Auth requerida:** ✅ Sí

---

### PATCH /api/tickets/:id

**Qué hace:** Actualiza ticket
**Auth requerida:** ✅ Sí
**DTO:** `UpdateTicketITDto`

---

### DELETE /api/tickets/:id

**Qué hace:** Elimina ticket
**Auth requerida:** ✅ Sí

---

### POST /api/tickets/:id/estado

**Qué hace:** Cambia estado del ticket
**DTO:** `CreateEstadoTicketDto`

**Request Body:**
```typescript
{
  estado: string;
  comentario?: string;
}
```

---

## 💬 CHAT

**Controller:** `src/Modules/Chat/chat.controller.ts`
**Service:** `src/Modules/Chat/chat.service.ts`
**Base URL:** `/api/chat`
**Guards:** JwtAuthGuard

### GET /api/chat

**Qué hace:** Lista chats del usuario
**Auth requerida:** ✅ Sí

---

### POST /api/chat

**Qué hace:** Crea nuevo chat (grupal o privado)
**Auth requerida:** ✅ Sí
**DTO:** `CreateChatSTVDto`

---

### GET /api/chat/grupos

**Qué hace:** Lista chats grupales

---

### POST /api/chat/grupos

**Qué hace:** Crea chat grupal
**DTO:** `CreateChatGrupoDto`

---

### GET /api/chat/privados

**Qué hace:** Lista chats privados

---

### POST /api/chat/privados

**Qué hace:** Crea chat privado
**DTO:** `CreateChatPrivadoDto`

---

### POST /api/chat/:id/mensaje

**Qué hace:** Envía mensaje a chat
**DTO:** `MensajeGrupoDto` o `MensajePrivadoDto`

---

## 📧 EMAIL

**Controller:** `src/Controllers/Email/email.controller.ts`
**Service:** `src/Modules/Email/email.service.ts`
**Base URL:** `/api/email`
**Guards:** JwtAuthGuard

### POST /api/email/send

**Qué hace:** Envía correo electrónico
**Auth requerida:** ✅ Sí
**DTO:** `SendEmailDto`

**Request Body:**
```typescript
{
  to: string;
  subject: string;
  body: string;
  cc?: string;
  bcc?: string;
  attachments?: any[];
}
```

**Response 201:**
```typescript
{
  success: true;
  message: "Email enviado correctamente";
}
```

---

### GET /api/email/config

**Qué hace:** Obtiene configuración de email del usuario

---

### POST /api/email/config

**Qué hace:** Guarda configuración de email
**DTO:** `CreateEmailConfigDto`

---

### PATCH /api/email/config

**Qué hace:** Actualiza configuración de email
**DTO:** `UpdateEmailConfigDto`

---

### POST /api/email/config/test

**Qué hace:** Prueba conexión de email
**DTO:** `TestEmailConnectionDto`

---

### GET /api/email/inbox

**Qué hace:** Obtiene emails recibidos
**DTO:** `GetEmailsDto`

---

## 📁 UPLOADS

**Controller:** `src/Modules/Uploads/uploads.controller.ts`
**Service:** `src/Modules/Uploads/uploads.service.ts`
**Base URL:** `/api/uploads`
**Guards:** JwtAuthGuard

### POST /api/uploads

**Qué hace:** Sube archivo al servidor
**Auth requerida:** ✅ Sí
**Content-Type:** `multipart/form-data`
**DTO:** `UploadFileDto`

**Request:**
```typescript
{
  file: File;              // Archivo (obligatorio)
  tipo: TipoArchivo;       // 'documento', 'imagen', 'ticket', etc.
  modulo?: string;         // Módulo que sube (tickets, chat, etc.)
  descripcion?: string;
}
```

**Response 201:**
```typescript
{
  success: true;
  data: {
    filename: string;
    path: string;          // Ruta relativa
    url: string;           // URL pública
    size: number;
    mimetype: string;
  }
}
```

**Archivos servidos en:** `http://localhost:3000uploads/[filename]`

---

## 📊 RESUMEN DE ENDPOINTS

| Módulo | Endpoints | Auth | DTOs |
|--------|-----------|------|------|
| **Auth** | 2 (register, login) | ❌ | CreateUsuarioDto, LoginDto |
| **Users** | 4 (CRUD) | ✅ | UpdateUsuarioDto |
| **Instalaciones** | 8 (CRUD + Areas) | ✅ | CreateInstalacionDto, UpdateInstalacionDto, CreateAreaDto, UpdateAreaDto |
| **Tickets** | 6 (CRUD + Estado) | ✅ | CreateTicketITDto, UpdateTicketITDto, CreateEstadoTicketDto |
| **Chat** | 7 (CRUD + Mensajes) | ✅ | CreateChatSTVDto, CreateChatGrupoDto, CreateChatPrivadoDto, MensajeDto |
| **Email** | 6 (Send + Config) | ✅ | SendEmailDto, CreateEmailConfigDto, TestEmailConfigDto |
| **Uploads** | 1 (Upload) | ✅ | UploadFileDto |

**Total:** ~34 endpoints

---

## 🔑 GUARDS UTILIZADOS

| Guard | Función | Dónde se usa |
|-------|---------|--------------|
| `JwtAuthGuard` | Verifica token JWT | Todos los endpoints excepto /auth/* |
| `RolesGuard` | Verifica rol del usuario | Users, Instalaciones, Tickets admin |
| `PermissionsGuard` | Verifica permiso específico | Endpoints granulares |

---

## 📝 DTOs UTILIZADOS

### DTOs Centrales (src/DTOs/)
- `CreateUsuarioDto` → Registro de usuario
- `UpdateUsuarioDto` → Actualización de usuario
- `LoginDto` → Login
- `ChangePasswordDto` → Cambiar contraseña
- `UpdateProfileDto` → Actualizar perfil
- `SearchUsuariosDto` → Búsqueda de usuarios
- `CreateEmailConfigDto` → Config email
- `UpdateEmailConfigDto` → Update config email
- `TestEmailConnectionDto` → Probar conexión
- `SendEmailDto` → Enviar email
- `GetEmailsDto` → Obtener emails

### DTOs por Módulo
- **Instalaciones:** CreateInstalacionDto, UpdateInstalacionDto, CreateAreaInstalacionDto, UpdateAreaInstalacionDto, CoordenadasDto, UbicacionDto
- **Tickets:** CreateTicketITDto, UpdateTicketITDto, CreateEstadoTicketDto, ContactoUsuarioDto
- **Chat:** CreateChatSTVDto, UpdateChatSTVDto, CreateChatGrupoDto, UpdateChatGrupoDto, CreateChatPrivadoDto, UpdateChatPrivadoDto, MensajeGrupoDto, MensajePrivadoDto, ArchivosDto
- **Uploads:** UploadFileDto, TipoArchivo (enum)

---

> **NOTA:** Este archivo debe actualizarse cuando se agreguen o modifiquen endpoints.
