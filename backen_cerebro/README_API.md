# 🏢 STV_Global - Backend API

Backend para el sistema de gestión de instalaciones, tickets de soporte IT y chat corporativo.

## 📋 Descripción del Proyecto

Este proyecto proporciona una API RESTful para gestionar:

- **Instalaciones y Áreas** - Registro y administración de instalaciones físicas y sus áreas
- **Usuarios** - Gestión de usuarios con roles (admin, usuario, soporte IT)
- **Tickets IT** - Sistema de tickets para incidentes y solicitudes de soporte técnico
- **Chat** - Sistema de mensajería (general, grupal y privado)
- **Archivos** - Upload y gestión de archivos organizados por usuario y fecha

## 🛠️ Tecnologías

- **NestJS** - Framework de Node.js
- **MongoDB** - Base de datos NoSQL
- **Mongoose** - ODM para MongoDB
- **TypeScript** - Lenguaje de programación
- **JWT** - Autenticación
- **Multer** - Upload de archivos

## 📁 Estructura del Proyecto

```
backen_cerebro/
├── src/
│   ├── Models/                 # Esquemas de Mongoose
│   │   ├── T_Instalaciones/    # Modelo de instalaciones y áreas
│   │   ├── Usuarios/           # Modelo de usuarios y email-config
│   │   │   ├── usuario.schema.ts
│   │   │   └── email-config.schema.ts
│   │   ├── T_ticket_IT_STV/    # Modelo de tickets y estado
│   │   └── T_Chat_STV/         # Modelo de chat (general, grupo, privado)
│   │
│   ├── Modules/                # Módulos de NestJS
│   │   ├── Auth/               # Autenticación
│   │   ├── Users/              # Módulo legacy de usuarios
│   │   ├── Instalaciones/      # CRUD de instalaciones y áreas
│   │   ├── Usuarios/           # CRUD de usuarios
│   │   ├── TicketIT/           # CRUD de tickets IT
│   │   ├── Chat/               # CRUD de chat
│   │   ├── Uploads/            # Upload de archivos
│   │   └── Email/              # Configuración y gestión de correo (IMAP/SMTP)
│   │
│   ├── Controllers/            # Controladores
│   │   ├── Usuarios/           # Auth y Users controllers
│   │   └── Email/              # Email controller
│   ├── DTOs/                   # Data Transfer Objects
│   │   ├── usuario.dto.ts
│   │   └── email.dto.ts
│   ├── Guards/                 # Guards de autenticación/autorización
│   │
│   ├── app.module.ts           # Módulo principal
│   ├── app.controller.ts
│   ├── app.service.ts
│   └── main.ts                 # Punto de entrada
│
├── uploads/                    # Archivos subidos (se genera automáticamente)
│   └── {numero_control}/
│       └── {fecha}/
│           ├── instalaciones/
│           ├── chat/
│           ├── usuario/
│           └── Tickets_IT/
│
├── .env                        # Variables de entorno
├── .env.example                # Ejemplo de variables de entorno
└── package.json
```

## 🚀 Instalación

### 1. Clonar el repositorio

```bash
cd backen_cerebro
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

```bash
# Copiar el archivo de ejemplo
copy .env.example .env

# Editar .env con tus configuraciones
```

### 4. Iniciar MongoDB

Asegúrate de tener MongoDB instalado y ejecutándose:

```bash
# Windows (si MongoDB está instalado como servicio)
net start MongoDB

# O ejecuta mongod manualmente
mongod --dbpath "C:\data\db"
```

### 5. Ejecutar el proyecto

```bash
# Desarrollo (con watch mode)
npm run start:dev

# Producción
npm run build
npm run start:prod
```

## 📡 Endpoints de la API

### 🔐 Autenticación

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/auth/register` | Registrar nuevo usuario |
| POST | `/auth/login` | Iniciar sesión |

### 👥 Usuarios

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/usuarios` | Listar todos los usuarios |
| GET | `/usuarios/:id` | Obtener usuario por ID |
| GET | `/usuarios/numero-control/:numeroControl` | Obtener usuario por número de control |
| POST | `/usuarios` | Crear usuario |
| PUT | `/usuarios/:id` | Actualizar usuario |
| DELETE | `/usuarios/:id` | Eliminar usuario |
| GET | `/usuarios/instalacion/:instalacionId` | Usuarios por instalación |
| GET | `/usuarios/area/:areaId` | Usuarios por área |
| GET | `/usuarios/soporte-it` | Listar personal de soporte IT |
| POST | `/usuarios/login` | Login de usuario |

### 🏢 Instalaciones

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/instalaciones` | Listar todas las instalaciones |
| GET | `/instalaciones/activas` | Listar instalaciones activas |
| GET | `/instalaciones/:id` | Obtener instalación por ID |
| POST | `/instalaciones` | Crear instalación |
| PUT | `/instalaciones/:id` | Actualizar instalación |
| DELETE | `/instalaciones/:id` | Eliminar instalación |

### 📍 Áreas

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/instalaciones/areas` | Listar todas las áreas |
| GET | `/instalaciones/areas/:id` | Obtener área por ID |
| POST | `/instalaciones/areas` | Crear área |
| PUT | `/instalaciones/areas/:id` | Actualizar área |
| DELETE | `/instalaciones/areas/:id` | Eliminar área |
| GET | `/instalaciones/instalacion/:instalacionId/areas` | Áreas por instalación |

### 🎫 Tickets IT

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/tickets` | Listar todos los tickets |
| GET | `/tickets/:id` | Obtener ticket por ID |
| GET | `/tickets/:id/historial` | Historial de estados del ticket |
| POST | `/tickets` | Crear ticket |
| PUT | `/tickets/:id` | Actualizar ticket |
| DELETE | `/tickets/:id` | Eliminar ticket |
| POST | `/tickets/:id/resolver` | Resolver ticket |
| POST | `/tickets/:id/cancelar` | Cancelar ticket |
| GET | `/tickets/usuario/:usuarioId` | Tickets por usuario |
| GET | `/tickets/asignado/:asignadoId` | Tickets asignados |
| GET | `/tickets/estado/:estado` | Tickets por estado |
| GET | `/tickets/instalacion/:instalacionId` | Tickets por instalación |
| GET | `/tickets/area/:areaId` | Tickets por área |
| POST | `/tickets/estado` | Crear registro de estado |

### 💬 Chat

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/chat` | Listar mensajes generales |
| POST | `/chat` | Crear mensaje general |
| GET | `/chat/usuario/:usuarioId` | Mensajes por usuario |
| GET | `/chat/grupo/:grupoId` | Mensajes por grupo |
| PUT | `/chat/:id` | Actualizar mensaje |
| DELETE | `/chat/:id` | Eliminar mensaje |

#### Chat Grupal

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/chat/grupo` | Listar todos los grupos |
| GET | `/chat/grupo/:id` | Obtener grupo por ID |
| POST | `/chat/grupo` | Crear grupo |
| PUT | `/chat/grupo/:id` | Actualizar grupo |
| DELETE | `/chat/grupo/:id` | Eliminar grupo |
| GET | `/chat/usuario/:usuarioId/grupos` | Grupos del usuario |
| POST | `/chat/grupo/:id/mensaje` | Enviar mensaje al grupo |

#### Chat Privado

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/chat/privado` | Listar chats privados |
| GET | `/chat/privado/usuarios/:usuarioAId/:usuarioBId` | Chat entre dos usuarios |
| GET | `/chat/privado/usuario/:usuarioId` | Chats privados del usuario |
| POST | `/chat/privado` | Crear chat privado |
| POST | `/chat/privado/:id/mensaje` | Enviar mensaje privado |
| POST | `/chat/privado/:id/leidos` | Marcar mensajes como leídos |
| DELETE | `/chat/privado/:id` | Eliminar chat privado |

### 📤 Uploads

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/uploads/single` | Subir un archivo |
| POST | `/uploads/multiple` | Subir múltiples archivos |
| POST | `/uploads/instalacion` | Subir imágenes de instalación |
| POST | `/uploads/area` | Subir imágenes de área |
| POST | `/uploads/perfil` | Subir imagen de perfil |
| POST | `/uploads/ticket/evidencia` | Subir evidencia de ticket |
| POST | `/uploads/ticket/problema` | Subir fotos del problema |
| POST | `/uploads/chat/grupo/:nombreGrupo` | Subir archivos a chat grupal |
| POST | `/uploads/chat/privado/:nombreUsuario` | Subir archivos a chat privado |
| DELETE | `/uploads/:rutaRelativa/:filename` | Eliminar archivo |
| GET | `/uploads/usuario/:numeroControl` | Listar archivos por usuario |
| GET | `/uploads/usuario/:numeroControl/fecha/:fecha` | Listar archivos por fecha |

### 📧 Correo Electrónico (Email)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/email/config` | Crear configuración de correo |
| GET | `/email/config` | Obtener configuración del usuario |
| PATCH | `/email/config` | Actualizar configuración |
| POST | `/email/config/test` | Probar conexión IMAP/SMTP |
| POST | `/email/config/activate` | Activar configuración |
| DELETE | `/email/config` | Eliminar configuración |
| GET | `/email/messages` | Obtener correos (IMAP) |
| POST | `/email/send` | Enviar correo (SMTP) |

#### Ejemplo: Configurar Correo

```json
POST /api/email/config
{
  "email": "usuario@tudominio.com",
  "displayName": "Nombre Completo",
  "passwordEmail": "contraseña_encriptada",
  "imapHost": "mail.tudominio.com",
  "imapPort": 993,
  "imapSecure": true,
  "smtpHost": "mail.tudominio.com",
  "smtpPort": 465,
  "smtpSecure": true
}
```

#### Ejemplo: Enviar Correo

```json
POST /api/email/send
{
  "to": "destinatario@email.com",
  "subject": "Asunto del correo",
  "html": "<p>Contenido HTML del correo</p>",
  "cc": "copia@email.com",
  "bcc": "copia_oculta@email.com"
}
```

## 📊 Modelos de Datos

### T_Instalaciones

```typescript
{
  nombre_instalacion: string,
  nombre_registrador: string,
  ubicacion: { direccion: string, coordenadas?: { lat, lng } },
  descripcion: string,
  foto: string,
  responsable: string,
  personal_asignado: ObjectId[],
  activa: boolean,
  creado_por: ObjectId
}
```

### Area_Instalacion

```typescript
{
  nombre_area: string,
  descripcion: string,
  id_instalacion: ObjectId,
  creado_por: ObjectId
}
```

### Usuarios

```typescript
{
  numero_control: string,
  nombre: string,
  apellido: string,
  email: string,
  telefono: string,
  password: string (encriptado),
  rol: 'admin' | 'usuario' | 'soporte_it',
  id_instalacion: ObjectId,
  id_area: ObjectId,
  foto_perfil: string,
  activo: boolean
}
```

### T_ticket_IT_STV

```typescript
{
  numero_ticket: string,
  usuario_solicitante: ObjectId,
  id_instalacion: ObjectId,
  id_area: ObjectId,
  contacto_usuario: { email, telefono },
  tipo: 'incidente' | 'solicitud',
  categoria: 'correo' | 'cámaras' | 'programas' | 'equipo' | 'red' | 'otro',
  descripcion: string,
  nivel_afectacion: number (1-10),
  prioridad: 'baja' | 'media' | 'alta' | 'crítica',
  estado: 'abierto' | 'en_proceso' | 'en_espera' | 'resuelto' | 'cancelado',
  asignado_a: ObjectId,
  creado_por: ObjectId,
  fecha_cierre: Date
}
```

### T_Estado_Ticket

```typescript
{
  id_ticket: ObjectId,
  estado: 'iniciado' | 'en_proceso' | 'resuelto' | 'cancelado' | 'en_espera',
  id_usuario: ObjectId,
  descripcion: string,
  evidencia: string[]
}
```

### T_Chat_STV

```typescript
{
  id_usuario: ObjectId,
  numero_control: string,
  mensaje: string,
  archivos: { fotos?, videos?, documentos? },
  id_grupo?: ObjectId,
  es_privado: boolean,
  editado: boolean,
  eliminado: boolean
}
```

### T_Chat_Grupo

```typescript
{
  nombre_grupo: string,
  descripcion: string,
  creador: ObjectId,
  miembros: ObjectId[],
  foto_grupo: string,
  mensajes: [{ id_usuario, mensaje, archivos, fecha_envio }],
  activo: boolean
}
```

### T_Chat_Privado

```typescript
{
  usuario_a: ObjectId,
  usuario_b: ObjectId,
  mensajes: [{ id_emisor, id_receptor, mensaje, archivos, fecha_envio, leido }],
  fecha_ultimo_mensaje: Date
}
```

## 📂 Estructura de Archivos (Uploads)

```
uploads/
└── EMP-001/                    # Número de control del usuario
    └── 2026/                   # Año
        └── 2026-02/            # Año-Mes
            └── 2026-02-04/     # Año-Mes-Día
                ├── instalaciones/
                │   ├── imagen_instalacion/
                │   └── imagen_areas/
                ├── chat/
                │   ├── imagen_grupos/
                │   │   └── nombre_grupo/
                │   ├── imagen_privados/
                │   │   └── nombre_usuario/
                │   └── archivos/
                ├── usuario/
                │   └── imagen_perfil/
                ├── Tickets_IT/
                │   ├── evidencias/
                │   ├── problemas/
                │   └── adjuntos/
                ├── archivero/
                │   └── nombre_archivero_o_carpeta/
                │       ├── documentos/
                │       ├── imagenes/
                │       ├── videos/
                │       └── archivos/
                └── noticias/
                    ├── imagenes/
                    └── adjuntos/
```

## 🔧 Comandos Disponibles

```bash
# Desarrollo
npm run start:dev

# Producción
npm run build
npm run start:prod

# Linting
npm run lint

# Testing
npm run test
npm run test:e2e
npm run test:cov
```

## 📝 Notas Importantes

1. **MongoDB**: Asegúrate de tener MongoDB instalado y ejecutándose
2. **Variables de entorno**: Configura correctamente el archivo `.env`
3. **Archivos estáticos**: Los archivos subidos se sirven desde `/uploads`
4. **Autenticación**: Los endpoints protegidos requieren token JWT
5. **Roles**: 
   - `admin`: Acceso completo
   - `soporte_it`: Gestión de tickets
   - `usuario`: Operaciones básicas

## 👨‍💻 Desarrollado por

STV_Global Team

## 📄 Licencia

UNLICENSED
