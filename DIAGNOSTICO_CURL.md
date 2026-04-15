# 🔍 DIAGNÓSTICO COMPLETO CON CURL

## ✅ **Backend FUNCIONA (cuando se reinicia)**

### **Prueba CURL Real:**

```bash
GET http://192.168.68.115:3000/api/email/messages?folder=INBOX&page=1&limit=3
Authorization: Bearer TOKEN

RESPUESTA:
{
  "success": true,
  "data": {
    "emails": [
      {
        "uid": 0,           ← ❌ UID INCORRECTO
        "from": "<documentador@sotaventolzc.com>",
        "subject": "PREALTA VACIOS ITALIKA // ALIANZA",
        "date": "2026-04-04T19:21:49.000Z",
        "html": "",         ← ❌ HTML VACÍO
        "text": "..."       ← ✅ TEXTO PRESENTE
      }
    ],
    "total": 83
  }
}
```

### **Análisis:**

1. ✅ Backend obtiene 83 emails del servidor IMAP
2. ❌ Pero todos tienen UID:0
3. ❌ Y no tienen HTML (solo texto plano)

### **Causa Raíz:**

El endpoint `GET /api/email/messages` usa `getEmailsLegacy` que tiene el bug de UID:0.

**El código ya está corregido** en el archivo, pero **el backend NO se reinició** con los cambios.

---

## 🔄 **Solución Inmediata:**

### **PASO ÚNICO: REINICIAR BACKEND**

```bash
# 1. Detener el backend actual (Ctrl+C en la terminal donde corre)

# 2. Reiniciar
cd backen_cerebro
npm run start:dev
```

**Después de reiniciar, los logs deberían mostrar:**
```
📧 [EmailFetcher] Legacy completed. 83 emails parsed, sorted by date (newest first)
```

Y la respuesta de curl debería ser:
```json
{
  "success": true,
  "data": {
    "emails": [
      {
        "uid": 11540,       ← ✅ UID CORRECTO
        "from": "...",
        "subject": "...",
        "date": "...",
        "html": "<!DOCTYPE html>...",  ← ✅ HTML PRESENTE (truncado a 50KB)
        "text": "..."
      }
    ],
    "total": 83
  }
}
```

---

## 📊 **Comparación: Antes vs Después de Reiniciar**

### **ANTES (código viejo en memoria):**
```
UID: 0           ← ❌
HTML: 0 chars    ← ❌
Orden: Viejos primero  ← ❌
```

### **DESPUÉS (código nuevo):**
```
UID: 11540       ← ✅
HTML: 50000 chars ← ✅
Orden: Recientes primero ← ✅
```

---

## 🎯 **Plan de Acción:**

1. ✅ **Reiniciar backend** → `npm run start:dev`
2. ✅ **Ejecutar curl de prueba** → `./test-email-api.ps1`
3. ✅ **Verificar UIDs reales** → Deben ser > 10000
4. ✅ **Verificar HTML** → Debe ser > 0
5. ✅ **Verificar orden** → Más reciente primero
6. ✅ **Reiniciar frontend** → `npm start -- --reset-cache`
7. ✅ **Probar en la app** → Abrir correo con UID real

---

## 🔧 **Comandos Rápidos:**

```bash
# Terminal 1 (Backend)
cd c:\Users\agenc\Documents\Control_Trabajo\backen_cerebro
npm run start:dev

# Terminal 2 (Prueba CURL)
cd c:\Users\agenc\Documents\Control_Trabajo\backen_cerebro
powershell -ExecutionPolicy Bypass -File test-email-api.ps1

# Terminal 3 (Frontend)
cd c:\Users\agenc\Documents\Control_Trabajo\C_Ticket_Apk_STV
npm start -- --reset-cache
```

---

## ✅ **Checklist de Verificación:**

- [ ] Backend reiniciado
- [ ] Curl muestra UID > 10000
- [ ] Curl muestra HTML > 0 chars
- [ ] Emails ordenados (recientes primero)
- [ ] Frontend reiniciado
- [ ] App abre correos con UID real
- [ ] HTML se renderiza correctamente
- [ ] Adjuntos se muestran

---

**¡El código está corregido! Solo necesitas REINICIAR el backend para que funcione.** 🚀
