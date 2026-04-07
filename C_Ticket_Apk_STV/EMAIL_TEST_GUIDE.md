# 📧 Módulo de Correo - Guía de Pruebas

## 📋 Endpoints Disponibles

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `POST` | `/api/email/config` | Crear configuración de correo |
| `GET` | `/api/email/config` | Obtener configuración del usuario actual |
| `GET` | `/api/email/config/user/:userId` | Obtener configuración de otro usuario |
| `POST` | `/api/email/config/user/:userId` | Crear config para otro usuario |
| `PATCH` | `/api/email/config` | Actualizar configuración |
| `POST` | `/api/email/config/test` | Probar conexión IMAP/SMTP |
| `POST` | `/api/email/config/activate` | Activar configuración |
| `DELETE` | `/api/email/config` | Eliminar configuración |
| `GET` | `/api/email/messages` | Obtener correos (IMAP) |
| `POST` | `/api/email/send` | Enviar correo (SMTP) |
| `GET` | `/api/email/configs` | Listar todas las configuraciones (Debug) |

## 🔧 Pruebas con curl

### 1. Login (obtener token)
```bash
curl -X POST http://192.168.190.1:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"Control_Usuario":"2026","password":"12345678"}'
```

### 2. Ver configuración de correo
```bash
TOKEN="tu_token_aqui"

curl -X GET http://192.168.190.1:3000/api/email/config \
  -H "Authorization: Bearer $TOKEN"
```

### 3. Obtener correos de la bandeja
```bash
curl -X GET "http://192.168.190.1:3000/api/email/messages?folder=INBOX&page=1&limit=10" \
  -H "Authorization: Bearer $TOKEN"
```

### 4. Enviar un correo
```bash
curl -X POST http://192.168.190.1:3000/api/email/send \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "to": "destinatario@email.com",
    "subject": "Prueba desde API",
    "html": "<h1>Hola</h1><p>Correo de prueba</p>",
    "text": "Correo de prueba"
  }'
```

### 5. Probar conexión IMAP/SMTP
```bash
curl -X POST http://192.168.190.1:3000/api/email/config/test \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "email": "tu-email@dominio.com",
    "passwordEmail": "tu-contraseña",
    "imapHost": "mail.dominio.com",
    "imapPort": 993,
    "imapSecure": true,
    "smtpHost": "mail.dominio.com",
    "smtpPort": 465,
    "smtpSecure": true
  }'
```

## 🚀 Script de Prueba Automática

```bash
cd C_Ticket_Apk_STV
chmod +x test-email.sh
./test-email.sh
```

## 📱 Estructura del Frontend

```
src_Chat_STV/
├── screens/Componets_Correos/
│   ├── views/
│   │   ├── EmailInboxView.tsx      # Bandeja de entrada (conectada al backend)
│   │   └── ComposeEmailView.tsx    # Redactar correo (nueva)
│   └── sidebar/
│       └── EmailSidebar.tsx        # Sidebar de navegación
└── services/
    └── emailMessages.service.ts    # Servicio completo de correo
```

## 🔍 Logs de Depuración

El frontend ahora incluye logs detallados:

**Frontend (React Native):**
```
📧 [EmailInboxView] Cargando correos...
📧 [EmailInboxView] URL: /api/email/messages
📩 [EmailInboxView] Respuesta: {...}
📩 [EmailInboxView] Emails encontrados: 5
```

**Backend (NestJS):**
```
📧 [EmailService] getEmails, userId: xxx
📩 [EmailService] Conectando a IMAP...
📩 [EmailService] Emails encontrados: 5
```

## ⚠️ Notas Importantes

1. **El usuario debe tener configuración de correo activa** para poder enviar/recibir
2. **Los puertos IMAP/SMTP deben ser accesibles** desde el servidor
3. **SSL/TLS recomendado** para conexiones seguras
4. **Timeout de 10 segundos** para conexiones IMAP/SMTP

## 🧪 Flujo de Prueba Completo

1. ✅ Login con usuario "2026"
2. ✅ Verificar que tiene configuración de correo (`GET /api/email/config`)
3. ✅ Si no tiene, crearla (`POST /api/email/config`)
4. ✅ Probar conexión (`POST /api/email/config/test`)
5. ✅ Activar configuración (`POST /api/email/config/activate`)
6. ✅ Obtener correos (`GET /api/email/messages`)
7. ✅ Enviar correo de prueba (`POST /api/email/send`)

## 📊 Respuestas Esperadas

**Obtener correos (éxito):**
```json
{
  "success": true,
  "data": {
    "emails": [
      {
        "id": "email_123",
        "from": "remitente@email.com",
        "subject": "Asunto",
        "date": "2026-04-06T...",
        "text": "Contenido del correo...",
        "seen": false
      }
    ],
    "total": 10,
    "page": 1,
    "limit": 50
  }
}
```

**Enviar correo (éxito):**
```json
{
  "success": true,
  "message": "Correo enviado correctamente",
  "data": {
    "messageId": "<xxx@mail.dominio.com>",
    "accepted": ["destinatario@email.com"]
  }
}
```

---

**Fecha:** Abril 6, 2026
**Versión:** 1.0.0
