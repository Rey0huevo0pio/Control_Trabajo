# 🔍 DIAGNÓSTICO COMPLETO - UID:0 y Contenido Vacío

## ✅ **BACKEND FUNCIONA PERFECTAMENTE**

### **Evidencia de los Logs:**

```
📧 [EmailFetcher] Fetching 83 messages with mailparser...
📧 [EmailParser] Email parsed UID:11458 - html: true, text: 0, attachments: 2  ✅
📧 [EmailParser] Email parsed UID:11459 - html: true, text: 0, attachments: 2  ✅
📧 [EmailFetcher] Completed. 83 emails parsed out of 83  ✅
💾 [EmailCache] Cached 83 messages for INBOX   ✅
⚠️ [EmailFetcher] Truncating HTML for UID:11458 from 260651 to 50000  ✅
```

**El backend:**
- ✅ Obtiene UIDs reales del servidor IMAP (11458-11540)
- ✅ Parsea 83 emails correctamente
- ✅ HTML está presente (pero truncado a 50KB)
- ✅ Caché del backend funciona correctamente

---

## ❌ **PROBLEMA EN FRONTEND**

### **Evidencia de los Logs del Frontend:**

```
📦 [EmailMessages] Usando caché local: 50 correos  ← ❌ CACHÉ VIEJA CON UID:0
📩 [EmailInboxView] Desde caché: true  ← ❌
📧 [EmailInboxView] Abriendo email UID: 0  ← ❌ UID VIEJO
📧 [EmailContentViewer] Received email: {"hasHtml": false, "hasText": true, "htmlLength": 0}
```

**El frontend:**
- ❌ Tiene emails viejos con UID:0 en AsyncStorage
- ❌ Abre emails con UID:0 (datos corruptos)
- ❌ Intenta descargar UID:0 del servidor → ERROR
- ❌ Recibe "Sin contenido" porque UID:0 no existe

---

## 🔍 **RAÍZ DEL PROBLEMA**

### **¿Por qué el Frontend Tiene UID:0?**

Antes de la corrección del backend, el email-fetcher.service.ts tenía un **race condition** que causaba que todos los emails se guardaran con UID:0.

**Código anterior (INCORRECTO):**
```typescript
// ❌ ANTES
msg.on('body', async (stream: any) => {
  parsedEmail = await parserService.parseEmailFromStream(stream, 0, folder);  // UID:0
});

msg.on('attributes', (attrs: any) => {
  parsedEmail.uid = attrs.uid;  // Demasiado tarde, ya se creó con UID:0
  emails.push(parsedEmail);
});
```

**Resultado:**
- 50 emails se guardaron en AsyncStorage con UID:0
- Esos emails CORRUPTOS siguen ahí
- El frontend los carga en lugar de los nuevos

---

## ✅ **SOLUCIÓN APLICADA**

### **Cambio 1: Limpieza Automática en emailCache.service.ts**

Agregué código que **elimina automáticamente** emails con UID:0:

```typescript
async getCachedEmails(folder: string = "INBOX"): Promise<CachedEmail[]> {
  const cache: EmailCacheState = JSON.parse(cacheJson);
  const emails = cache.emails.filter((e) => e.folder === folder);
  
  // ✅ ELIMINAR emails corruptos con UID:0
  const validEmails = emails.filter(e => e.uid > 0);
  if (validEmails.length !== emails.length) {
    const removedCount = emails.length - validEmails.length;
    console.log(`🗑️ [EmailCache] Eliminando ${removedCount} emails corruptos (UID:0)`);
    
    // Guardar solo emails válidos
    cache.emails = [...validEmails, ...cache.emails.filter(e => e.folder !== folder)];
    await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  }
  
  return validEmails;
}
```

### **Resultado Esperado:**

```
🗑️ [EmailCache] Eliminando 50 emails corruptos (UID:0)  ← ✅ LIMPIEZA AUTOMÁTICA
🌐 [EmailMessages] Primera descarga desde servidor...
📩 [EmailInboxView] Correos: 50
📩 [EmailInboxView] Desde caché: false  ← ✅ DESCARGA NUEVA
📧 [EmailInboxView] Abriendo email UID: 11478  ← ✅ UID REAL
```

---

## 🧪 **CURL PARA VERIFICAR BACKEND**

Crea un archivo `test-email-api.sh` en el directorio del backend:

```bash
#!/bin/bash
# ==========================================
# PRUEBA CURL - VERIFICAR BACKEND
# ==========================================

# Configuración
BASE_URL="http://192.168.68.115:3000/api"  # Cambia según tu puerto
TOKEN="TU_TOKEN_AQUI"  # Obtén del login

echo "=========================================="
echo "📬 PASO 1: OBTENER LISTA DE CORREOS"
echo "=========================================="

curl -s -X GET "${BASE_URL}/email/messages?folder=INBOX&page=1&limit=3" \
  -H "Authorization: Bearer $TOKEN" | python3 -m json.tool | head -100

echo ""
echo "=========================================="
echo "📄 PASO 2: OBTENER EMAIL COMPLETO (UID REAL)"
echo "=========================================="

# Usa un UID real de los logs (ej: 11478)
UID=11478

curl -s -X POST "${BASE_URL}/email/messages/by-uids" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{\"folder\":\"INBOX\",\"uids\":[${UID}]}" | python3 -m json.tool | head -200

echo ""
echo "=========================================="
echo "✅ VERIFICACIÓN"
echo "=========================================="

# Verificar que hay HTML
RESPONSE=$(curl -s -X POST "${BASE_URL}/email/messages/by-uids" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{\"folder\":\"INBOX\",\"uids\":[${UID}]}")

HTML_LENGTH=$(echo $RESPONSE | grep -o '"html":"[^"]*"' | wc -c)

echo "UID: $UID"
echo "HTML Length: $HTML_LENGTH"
echo "Has HTML: $([ $HTML_LENGTH -gt 20 ] && echo '✅ YES' || echo '❌ NO')"
```

**Ejecutar:**
```bash
cd backen_cerebro
chmod +x test-email-api.sh
./test-email-api.sh
```

---

## 📋 **COMO PROBAR LA SOLUCIÓN**

### **Opción 1: Recargar App (Automático)**

La limpieza automática debería activarse:

1. **Cierra completamente la app** (swipe away)
2. **Vuelve a abrirla**
3. **Ve a la sección de Correos**
4. **Revisa los logs** → Debería decir:

```
🗑️ [EmailCache] Eliminando 50 emails corruptos (UID:0)
🌐 [EmailMessages] Primera descarga desde servidor...
```

### **Opción 2: Limpiar Manualmente**

Si la limpieza automática no funciona:

```bash
# En tu terminal
cd C_Ticket_Apk_STV
npm start -- --reset-cache
```

Luego:
1. Desinstala la app del teléfono/emulador
2. Vuelve a instalarla
3. Inicia sesión
4. Abre Correos

### **Opción 3: Código Temporal de Emergencia**

Agrega esto en `EmailInboxView.tsx` al inicio del componente:

```typescript
useEffect(() => {
  // 🚨 FORZAR LIMPIEZA DE CACHÉ CORRUPTA
  const forceClearCorruptCache = async () => {
    try {
      const cacheJson = await AsyncStorage.getItem('@email_cache_v3');
      if (cacheJson) {
        const cache = JSON.parse(cacheJson);
        const corruptCount = cache.emails.filter(e => e.uid === 0).length;
        if (corruptCount > 0) {
          console.log(`🚨 [EmailInboxView] Encontrados ${corruptCount} emails corruptos (UID:0)`);
          cache.emails = cache.emails.filter(e => e.uid > 0);
          await AsyncStorage.setItem('@email_cache_v3', JSON.stringify(cache));
          console.log('✅ [EmailInboxView] Caché corrupta eliminada');
        }
      }
    } catch (error) {
      console.error('❌ [EmailInboxView] Error limpiando caché:', error);
    }
  };
  
  forceClearCorruptCache();
}, []);
```

---

## 🔍 **COMO VERIFICAR QUE FUNCIONA**

### **✅ LOGS CORRECTOS (DESPUÉS DE LA SOLUCIÓN):**

```
📧 [EmailInboxView] Cargando correos...
🗑️ [EmailCache] Eliminando 50 emails corruptos (UID:0)  ← ✅ LIMPIEZA
🌐 [EmailMessages] Primera descarga desde servidor...  ← ✅ DESCARGA NUEVA
📩 [EmailInboxView] Correos: 50
📩 [EmailInboxView] Desde caché: false  ← ✅ NO USANDO CACHÉ VIEJA

... (usuario toca un correo) ...

📧 [EmailInboxView] Abriendo email UID: 11478  ← ✅ UID REAL DEL SERVIDOR
🌐 [EmailMessages] Descargando contenido completo (UID: 11478)
📧 [EmailContentViewer] Received email: {
  "attachmentsCount": 2,  ← ✅ ADJUNTOS REALES
  "hasHtml": true,  ← ✅ HTML PRESENTE
  "htmlLength": 15420,  ← ✅ CONTENIDO REAL
  "hasText": false,
  "textLength": 0
}
📄 [HtmlEmailRenderer] Received props: {"hasHtml": true, "htmlLength": 15420}
```

### **❌ LOGS INCORRECTOS (SI SIGUE EL PROBLEMA):**

```
📦 [EmailMessages] Usando caché local: 50 correos  ← ❌ CACHÉ VIEJA
📩 [EmailInboxView] Desde caché: true  ← ❌
📧 [EmailInboxView] Abriendo email UID: 0  ← ❌ UID CORRUPTO
```

---

## 📊 **ESTRUCTURA DE DATOS DEL BACKEND**

### **Lo que Envía el Backend (CORRECTO):**

```json
{
  "success": true,
  "message": "Correos cargados desde servidor",
  "data": {
    "emails": [
      {
        "id": "msg_11478",
        "uid": 11478,
        "from": "Remitente <email@ejemplo.com>",
        "to": "destino@ejemplo.com",
        "subject": "Asunto del correo",
        "date": "2026-04-07T10:30:00.000Z",
        "text": "Preview corto del contenido...",
        "html": "<!DOCTYPE html><html>...[50KB máximo]...</html>",
        "attachments": [
          {
            "fileName": "documento.pdf",
            "contentType": "application/pdf",
            "size": 1024000,
            "isImage": false,
            "isPDF": true,
            "thumbnail": undefined
          }
        ],
        "seen": false,
        "flagged": false,
        "folder": "INBOX"
      }
    ],
    "total": 83,
    "page": 1,
    "limit": 50
  }
}
```

**Verificaciones:**
- ✅ `uid` es número real (> 10000)
- ✅ `html` tiene contenido (puede estar truncado a 50KB)
- ✅ `attachments` tiene metadata pero NO el contenido completo
- ✅ `text` tiene preview corto (500 chars máximo)

---

## 🎯 **RESUMEN DE CAMBIOS**

### **Backend:**
- ✅ UID correcto del servidor IMAP (11458-11540)
- ✅ HTML truncado a 50KB para evitar OutOfMemory
- ✅ Adjuntos sin contenido base64 (solo metadata)
- ✅ Texto truncado a 500 caracteres
- ✅ Caché funcionando (83 mensajes guardados)

### **Frontend:**
- ✅ **Limpieza automática** de emails con UID:0
- ✅ Al cargar correos, elimina corruptos automáticamente
- ✅ Fuerza descarga nueva si detecta corrupción

---

## 🚀 **PRÓXIMOS PASOS**

1. ✅ **Recargar app** → Debería activar limpieza automática
2. ✅ **Verificar logs** → Debe decir "Eliminando X emails corruptos (UID:0)"
3. ✅ **Abrir correo** → Debe mostrar UID real (11458+)
4. ✅ **Ver HTML** → Debe renderizar profesionalmente

---

## 📝 **NOTAS TÉCNICAS**

### **¿Por qué Pasa Esto?**

AsyncStorage es **persistente** - los datos se quedan aunque cierres la app.

```
Timeline:
─────────────────────────────────────────────
Día 1: Backend con bug → Guarda 50 emails con UID:0
Día 2: Frontend guarda en AsyncStorage → UID:0
Día 3: Backend corregido → Envía UIDs reales (11458+)
Día 4: Frontend carga caché vieja → UID:0 ❌
Día 5: ✅ Limpieza automática elimina UID:0
Día 5: ✅ Descarga nueva con UIDs reales
```

### **¿Por qué la Solución Funciona?**

```typescript
// Antes:
return cache.emails.filter(e => e.folder === folder);
// ❌ Retorna TODO, incluyendo UID:0

// Ahora:
const validEmails = emails.filter(e => e.uid > 0);
// ✅ Filtra UID:0 antes de retornar
if (validEmails.length !== emails.length) {
  // ✅ Guarda solo emails válidos
  await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(cache));
}
```

---

## ✅ **CHECKLIST FINAL**

- [x] Backend envía UIDs correctos (11458-11540)
- [x] Backend trunca HTML a 50KB
- [x] Backend no envía contenido de adjuntos en lista
- [x] Frontend elimina automáticamente emails con UID:0
- [ ] **PENDIENTE:** Recargar app para activar limpieza
- [ ] **PENDIENTE:** Verificar que abre email con UID real
- [ ] **PENDIENTE:** Verificar que HTML se renderiza

---

**¡La solución está aplicada! Solo necesitas recargar la app para que la limpieza automática funcione.** 🎉
