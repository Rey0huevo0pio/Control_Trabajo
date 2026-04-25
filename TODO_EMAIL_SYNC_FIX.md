# Plan de Corrección - Sincronización de Correos

## Problemas Identificados

1. **Backend `email.service.ts`**: `getMessageUIDs` retorna `{uids: []}` silenciosamente cuando la config no está ACTIVE
2. **Backend `email-fetcher.service.ts`**: Conexión IMAP sin timeout - puede colgarse indefinidamente
3. **Frontend `emailMessages.service.ts`**: `syncIncremental` es `void`, no retorna nuevos correos ni notifica a la UI
4. **Frontend `EmailInboxView.jsx`**: El refresh no fuerza sincronización real, solo re-renderiza

## Archivos a Modificar

### Backend
- `backen_cerebro/src/Modules/Email/email.service.ts` - Agregar logging y manejo de errores
- `backen_cerebro/src/Modules/Email/Components_Service/email-fetcher.service.ts` - Agregar timeout IMAP

### Frontend
- `stv-web/src/services/emailMessages.service.ts` - Hacer `syncIncremental` retornar resultados
- `stv-web/src/src_Chat_STV/screens/Componets_Correos/views/EmailInboxView.jsx` - Actualizar UI post-sync

## Cambios Específicos

### 1. Backend - email.service.ts
- Agregar logs en `getMessageUIDs` para mostrar estado de config
- Agregar log cuando config no está ACTIVE

### 2. Backend - email-fetcher.service.ts  
- Agregar timeout de 30 segundos a conexiones IMAP
- Mejorar logs de errores

### 3. Frontend - emailMessages.service.ts
- `syncIncremental` debe retornar `{ newCount: number, emails: EmailMessage[] }`
- `getMessages` debe aceptar opción `force` para bypass de caché
- Agregar método `syncAndGetNew` que sincroniza y retorna correos nuevos

### 4. Frontend - EmailInboxView.jsx
- Mostrar estado de sincronización ("Sincronizando...")
- Después de `syncIncremental`, re-leer correos de IndexedDB
- Botón de refresh debe llamar `forceSync` o esperar sincronización
