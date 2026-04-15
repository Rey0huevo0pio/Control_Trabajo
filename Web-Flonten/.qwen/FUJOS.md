# 🔄 FLUJOS DE NEGOCIO - STV Global

> **Documentación completa de cómo funciona cada caso de uso**
> 
> **Propósito:** Entender el flujo completo de cada funcionalidad, paso a paso

---

## 🔐 FLUJO 1: REGISTRO DE USUARIO

### ¿Qué pasa cuando un usuario se registra?

```
Frontend (C_Ticket_Apk_STV)
  │
  ├─ 1. Usuario llena formulario de registro
  │     - Control_Usuario (obligatorio, único)
  │     - password (mínimo 6 caracteres)
  │     - nombre, apellido
  │     - rol (opcional, default: VIGILANTE)
  │
  ├─ 2. Frontend valida datos con formulario
  │
  ├─ 3. POST /api/auth/register
  │     Body: CreateUsuarioDto
  │
  ▼
Backend (backen_cerebro)
  │
  ├─ 4. ValidationPipe valida CreateUsuarioDto
  │     - Si hay campos extra → los ignora (whitelist: true)
  │     - Si faltan campos requeridos → 400 Bad Request
  │
  ├─ 5. AuthService.register()
  │     │
  │     ├─ 5.1 Busca usuario con mismo Control_Usuario
  │     │      └─ Si existe → 409 Conflict
  │     │
  │     ├─ 5.2 Hashea password con bcrypt
  │     │      - Salt rounds: 10
  │     │      - bcrypt.hash(password, salt)
  │     │
  │     ├─ 5.3 Determina rol del usuario
  │     │      - Si viene en request → usa ese
  │     │      - Si no → RolUsuario.VIGILANTE
  │     │
  │     ├─ 5.4 Asigna permisos según rol
  │     │      - PERMISOS_POR_ROL[rol]
  │     │      - Vigilante: permisos básicos
  │     │      - Supervisor: + reportes, asignar tickets
  │     │      - RH: + gestión usuarios
  │     │      - IT: todos los permisos
  │     │      - Admin: Object.values(Permiso) - TODOS
  │     │
  │     ├─ 5.5 Crea instancia de Usuario
  │     │      - activo: true
  │     │      - primerLogin: true (por defecto en schema)
  │     │      - password: hasheada
  │     │      - permisos: array de strings
  │     │
  │     ├─ 5.6 Guarda en MongoDB
  │     │      Colección: usuarios
  │     │
  │     ├─ 5.7 Genera token JWT
  │     │      Payload: { sub: userId, Control_Usuario, rol }
  │     │      Secreto: JWT_SECRET de .env
  │     │      Expiración: 24h
  │     │
  │     └─ 5.8 Retorna response
  │            {
  │              success: true,
  │              message: "Usuario registrado",
  │              data: { user: sanitizado, token }
  │            }
  │
  ▼
Frontend (C_Ticket_Apk_STV)
  │
  ├─ 6. Recibe response
  │
  ├─ 7. useAuthStore.login(user, token)
  │     - Guarda user en Zustand store
  │     - Guarda token en Zustand store
  │     - Configura token en Axios interceptor
  │       → Todos los requests siguientes incluirán:
  │         Authorization: Bearer [token]
  │
  ├─ 8. Navega a HomeScreen
  │
  └─ 9. Usuario puede usar la app
```

---

## 🔑 FLUJO 2: LOGIN

### ¿Qué pasa cuando un usuario inicia sesión?

```
Frontend
  │
  ├─ 1. Usuario ingresa credenciales
  │     - Control_Usuario
  │     - password
  │
  ├─ 2. POST /api/auth/login
  │
  ▼
Backend
  │
  ├─ 3. ValidationPipe valida LoginDto
  │
  ├─ 4. AuthService.login()
  │     │
  │     ├─ 4.1 Busca usuario por Control_Usuario
  │     │      └─ Si no existe → 401 Unauthorized
  │     │
  │     ├─ 4.2 Verifica usuario.activo === true
  │     │      └─ Si está inactivo → 401 "Usuario inactivo"
  │     │
  │     ├─ 4.3 Compara password
  │     │      bcrypt.compare(inputPassword, user.password)
  │     │      └─ Si no coincide → 401 "Credenciales inválidas"
  │     │
  │     ├─ 4.4 Genera token JWT
  │     │      Mismo payload que registro
  │     │
  │     └─ 4.5 Retorna response
  │            { success: true, data: { user, token } }
  │
  ▼
Frontend
  │
  ├─ 5. useAuthStore.login(user, token)
  │     - Mismo proceso que registro
  │
  ├─ 6. AppNavigator detecta isAuthenticated = true
  │     - React Navigation cambia stack
  │     - Muestra HomeScreen en lugar de LoginScreen
  │
  └─ 7. Usuario ve HomeScreen
        - Desde aquí puede navegar a:
          - Instalaciones
          - Tickets
          - Chat
          - Archivero
          - UserManagement
```

---

## 🛡️ FLUJO 3: AUTENTICACIÓN DE REQUEST

### ¿Qué pasa cuando un request requiere auth?

```
Frontend
  │
  ├─ 1. Componente hace llamada API
  │     Ejemplo: usersApi.getAll()
  │
  ├─ 2. Axios interceptor intercepta request
  │     - Obtiene token de useAuthStore
  │     - Agrega header: Authorization: Bearer [token]
  │
  ├─ 3. Request sale con header auth
  │
  ▼
Backend
  │
  ├─ 4. Request llega a NestJS
  │
  ├─ 5. JwtAuthGuard se ejecuta PRIMERO
  │     │
  │     ├─ 5.1 Extrae token del header Authorization
  │     │      "Bearer eyJhbGci..." → "eyJhbGci..."
  │     │
  │     ├─ 5.2 Verifica firma del token
  │     │      - Usa JWT_SECRET
  │     │      - Si firma inválida → 401 Unauthorized
  │     │
  │     ├─ 5.3 Verifica expiración
  │     │      - Si expirado → 401 "Token expired"
  │     │
  │     ├─ 5.4 Decodifica payload
  │     │      { sub: userId, Control_Usuario, rol }
  │     │
  │     ├─ 5.5 JwtStrategy.validateUser()
  │     │      - Busca usuario en BD por userId
  │     │      - Verifica usuario.activo === true
  │     │      - Si no válido → 401
  │     │
  │     └─ 5.6 Agrega user al request
  │            req.user = { id, Control_Usuario, rol, ... }
  │
  ├─ 6. Si hay RolesGuard, se ejecuta SEGUNDO
  │     │
  │     ├─ 6.1 Obtiene rol requerido del decorator @Roles()
  │     │      Ejemplo: @Roles(RolUsuario.ADMIN, RolUsuario.IT)
  │     │
  │     ├─ 6.2 Obtiene rol del usuario de req.user
  │     │
  │     ├─ 6.3 Compara
  │     │      - Si rol del usuario está en los permitidos → ✅
  │     │      - Si no → 403 Forbidden "Acceso denegado"
  │     │
  │     └─ 6.4 Permite pasar
  │
  ├─ 7. Si hay PermissionsGuard, se ejecuta TERCERO
  │     │
  │     ├─ 7.1 Obtiene permiso requerido de @Permissions()
  │     │
  │     ├─ 7.2 Obtiene permisos del usuario de req.user.permisos
  │     │
  │     ├─ 7.3 Compara
  │     │      - Si tiene el permiso → ✅
  │     │      - Si no → 403 Forbidden
  │     │
  │     └─ 7.4 Permite pasar
  │
  ├─ 8. Controller method se ejecuta
  │     - Tiene acceso a req.user
  │     - Puede usar para filtrar datos del usuario
  │
  └─ 9. Retorna response
        - Si todo OK → 200/201 con data
        - Si error → 4xx/5xx
```

---

## 🎫 FLUJO 4: CREACIÓN DE TICKET

### ¿Qué pasa cuando se crea un ticket?

```
Frontend (src_P_Ticket_IT o src_Chat_STV)
  │
  ├─ 1. Usuario llena formulario de ticket
  │     - título, descripción
  │     - tipo (incidencia, solicitud, etc.)
  │     - categoría (hardware, software, red, etc.)
  │     - prioridad (baja, media, alta, urgente)
  │     - asignadoA (opcional)
  │     - contacto (nombre, teléfono, email)
  │     - instalaciónId (opcional)
  │     - archivos adjuntos (opcional)
  │
  ├─ 2. Si hay archivos:
  │     └─ Primero POST /api/uploads
  │          └─ Obtiene URLs de archivos
  │
  ├─ 3. POST /api/tickets
  │     Body: CreateTicketITDto
  │     Headers: Authorization: Bearer [token]
  │
  ▼
Backend
  │
  ├─ 4. JwtAuthGuard verifica token
  │
  ├─ 5. ValidationPipe valida CreateTicketITDto
  │
  ├─ 6. TicketItService.create()
  │     │
  │     ├─ 6.1 Crea instancia de TicketIT
  │     │      - estado: "abierto" (default)
  │     │      - creadoPor: req.user.id
  │     │      - fechaCreacion: new Date()
  │     │      - historialEstados: [] (vacío inicialmente)
  │     │
  │     ├─ 6.2 Si hay asignación:
  │     │      - asignadoA: userId
  │     │      - fechaAsignacion: new Date()
  │     │
  │     ├─ 6.3 Guarda en MongoDB
  │     │      Colección: t_ticket_it_stv
  │     │
  │     └─ 6.4 Retorna ticket creado
  │
  └─ 7. Response 201
        { success: true, data: TicketIT }
```

---

## 🏢 FLUJO 5: GESTIÓN DE INSTALACIONES

### ¿Qué pasa cuando se registra una instalación?

```
Frontend (src_Instalaciones_STV)
  │
  ├─ 1. Usuario en RegistroInstalacionScreen
  │     - nombre, dirección
  │     - coordenadas (lat, lng) - opcional
  │     - ubicación (ciudad, estado, país) - opcional
  │     - descripción
  │
  ├─ 2. POST /api/instalaciones
  │
  ▼
Backend
  │
  ├─ 3. JwtAuthGuard verifica token
  │
  ├─ 4. InstalacionesService.create()
  │     │
  │     ├─ 4.1 Crea Instalacion
  │     │      - activo: true
  │     │      - areas: [] (vacío inicialmente)
  │     │
  │     ├─ 4.2 Guarda en MongoDB
  │     │      Colección: t_instalaciones
  │     │
  │     └─ 4.3 Retorna instalación
  │
  └─ 5. Response 201

### Agregar área a instalación:

  Frontend (src_Instalaciones_STV/RegistroAreaScreen)
  │
  ├─ 6. Usuario en RegistroAreaScreen
  │     - nombre del área
  │     - descripción
  │     - piso/nivel
  │     - coordenadas dentro de instalación
  │
  ├─ 7. POST /api/instalaciones/:id/areas
  │
  ▼
  Backend
  │
  ├─ 8. InstalacionesService.addArea()
  │     │
  │     ├─ 8.1 Busca instalación por ID
  │     │
  │     ├─ 8.2 Crea AreaInstalacion
  │     │
  │     ├─ 8.3 Agrega a array areas de la instalación
  │     │      O usa colección separada (depende del diseño)
  │     │
  │     └─ 8.4 Guarda
  │
  └─ 9. Response 201
```

---

## 💬 FLUJO 6: CHAT GRUPAL

### ¿Qué pasa cuando se crea un chat grupal?

```
Frontend (src_Chat_STV)
  │
  ├─ 1. Usuario en crear grupo
  │     - nombre del grupo
  │     - descripción
  │     - miembros: [userId1, userId2, ...]
  │     - imagen (opcional)
  │
  ├─ 2. POST /api/chat/grupos
  │     Body: CreateChatGrupoDto
  │
  ▼
Backend
  │
  ├─ 3. JwtAuthGuard verifica token
  │
  ├─ 4. ChatService.createGrupo()
  │     │
  │     ├─ 4.1 Crea ChatGrupo
  │     │      - admin: req.user.id (quien crea)
  │     │      - miembros: [...miembros, admin]
  │     │      - mensajes: []
  │     │      - fechaCreacion: new Date()
  │     │
  │     ├─ 4.2 Guarda en MongoDB
  │     │      Colección: t_chat_stv (con discriminador)
  │     │      O: chat_grupos (colección separada)
  │     │
  │     └─ 4.3 Retorna grupo creado
  │
  └─ 5. Response 201

### Enviar mensaje a grupo:

  Frontend
  │
  ├─ 6. Usuario escribe mensaje
  │     - texto
  │     - archivos adjuntos (opcional)
  │
  ├─ 7. POST /api/chat/:id/mensaje
  │     Body: MensajeGrupoDto
  │
  ▼
  Backend
  │
  ├─ 8. ChatService.sendMensajeGrupo()
  │     │
  │     ├─ 8.1 Busca grupo por ID
  │     │
  │     ├─ 8.2 Verifica que usuario sea miembro
  │     │      └─ Si no → 403
  │     │
  │     ├─ 8.3 Crea mensaje
  │     │      {
  │     │        remitente: req.user.id,
  │     │        texto: string,
  │     │        fecha: new Date(),
  │     │        archivos?: string[]
  │     │      }
  │     │
  │     ├─ 8.4 Agrega a array mensajes del grupo
  │     │
  │     └─ 8.5 Guarda
  │
  └─ 9. Response 201
```

---

## 📁 FLUJO 7: SUBIDA DE ARCHIVOS

### ¿Qué pasa cuando se sube un archivo?

```
Frontend
  │
  ├─ 1. Usuario selecciona archivo
  │     - Desde galería
  │     - Desde cámara
  │     - Desde archivos
  │
  ├─ 2. FormData con archivo
  │
  ├─ 3. POST /api/uploads
  │     Content-Type: multipart/form-data
  │     Body: { file, tipo, modulo?, descripcion? }
  │
  ▼
Backend
  │
  ├─ 4. JwtAuthGuard verifica token
  │
  ├─ 5. Express multer procesa archivo
  │     - Guarda en disco: uploads/[timestamp]-[nombre]
  │     - O guarda en memoria (depende de configuración)
  │
  ├─ 6. UploadsService.saveFile()
  │     │
  │     ├─ 6.1 Valida tipo de archivo
  │     │      - Imágenes: jpg, png, gif, webp
  │     │      - Documentos: pdf, doc, docx, xls, xlsx
  │     │      - Otros: según configuración
  │     │
  │     ├─ 6.2 Valida tamaño
  │     │      - Máximo: configurado en .env o hardcodeado
  │     │
  │     ├─ 6.3 Genera nombre único
  │     │      - timestamp + random string
  │     │
  │     ├─ 6.4 Guarda archivo
  │     │      Ruta: uploads/[nombre]
  │     │
  │     ├─ 6.5 Crea registro en BD (opcional)
  │     │      - nombre, ruta, tipo, tamaño
  │     │      - subidoPor: req.user.id
  │     │      - modulo: tickets, chat, etc.
  │     │
  │     └─ 6.6 Retorna información del archivo
  │
  └─ 7. Response 201
        {
          success: true,
          data: {
            filename: string,
            path: string,
            url: "http://192.168.68.115:3000uploads/[filename]",
            size: number,
            mimetype: string
          }
        }

### Acceso público al archivo:

  8. GET /uploads/[filename]
     - Express static sirve archivo
     - Sin auth requerida
     - Cualquier persona con URL puede ver
```

---

## 📧 FLUJO 8: ENVÍO DE EMAIL

### ¿Qué pasa cuando se envía un correo?

```
Frontend
  │
  ├─ 1. Usuario compone email
  │     - to: string
  │     - subject: string
  │     - body: string (HTML o texto)
  │     - cc, bcc (opcional)
  │     - attachments (opcional)
  │
  ├─ 2. POST /api/email/send
  │
  ▼
Backend
  │
  ├─ 3. JwtAuthGuard verifica token
  │
  ├─ 4. EmailService.sendEmail()
  │     │
  │     ├─ 4.1 Obtiene configuración SMTP
  │     │      - De .env o de configuración del usuario
  │     │      - SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS
  │     │
  │     ├─ 4.2 Crea transporter de nodemailer
  │     │      nodemailer.createTransport({
  │     │        host: SMTP_HOST,
  │     │        port: SMTP_PORT,
  │     │        auth: { user, pass }
  │     │      })
  │     │
  │     ├─ 4.3 Construye mensaje
  │     │      {
  │     │        from: SMTP_USER,
  │     │        to, cc, bcc,
  │     │        subject,
  │     │        html: body,
  │     │        attachments
  │     │      }
  │     │
  │     ├─ 4.4 Envía con transporter.sendMail()
  │     │
  │     ├─ 4.5 Verifica resultado
  │     │      - Si error → lanza excepción
  │     │      - Si OK → retorna messageId
  │     │
  │     └─ 4.6 Retorna response
  │
  └─ 5. Response 201
        { success: true, message: "Email enviado" }
```

---

## 📊 RESUMEN DE FLUJOS

| Flujo | Endpoint Principal | Guards | DTO | Colección BD |
|-------|-------------------|--------|-----|--------------|
| Registro | POST /auth/register | ❌ | CreateUsuarioDto | usuarios |
| Login | POST /auth/login | ❌ | LoginDto | usuarios |
| Auth Request | Cualquiera | JwtAuthGuard, RolesGuard, PermissionsGuard | - | - |
| Crear Ticket | POST /tickets | JwtAuthGuard | CreateTicketITDto | t_ticket_it_stv |
| Crear Instalación | POST /instalaciones | JwtAuthGuard | CreateInstalacionDto | t_instalaciones |
| Crear Chat Grupo | POST /chat/grupos | JwtAuthGuard | CreateChatGrupoDto | t_chat_stv |
| Subir Archivo | POST /uploads | JwtAuthGuard | UploadFileDto | (filesystem) |
| Enviar Email | POST /email/send | JwtAuthGuard | SendEmailDto | - |

---

> **NOTA:** Este archivo debe actualizarse cuando se agreguen nuevos flujos o se modifiquen existentes.
