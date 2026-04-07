# 🔧 Cómo Limpiar Caché de Correos

## ⚠️ **Problema Actual**

Tu backend ahora funciona perfectamente:
- ✅ UIDs correctos (11458-11533)
- ✅ 76 emails parseados y cacheados
- ✅ Contenido HTML completo

Pero tu frontend tiene **emails viejos con UID:0** en caché local de AsyncStorage.

---

## ✅ **Solución 1: Limpiar caché desde la app (Recomendado)**

1. **Abre tu app en el teléfono/emulador**
2. **Ve a la sección de Correos**
3. **Busca un botón de "Actualizar" o "Sync"** (debería haber un ícono de refresh en el header)
4. **Mantén presionado el botón de refresh por 2-3 segundos**
5. **Debería limpiar la caché y recargar todo**

---

## ✅ **Solución 2: Limpiar caché programáticamente**

Agrega este código temporal a `EmailInboxView.tsx` para limpiar la caché al cargar:

```typescript
// En EmailInboxView.tsx, al inicio del componente
useEffect(() => {
  // TEMPORAL: Limpiar caché vieja con UID:0
  const clearOldCache = async () => {
    try {
      await emailCacheService.clearCache();
      console.log('✅ [EmailInboxView] Caché vieja limpiada');
    } catch (error) {
      console.error('❌ [EmailInboxView] Error limpiando caché:', error);
    }
  };
  
  clearOldCache();
}, []);
```

---

## ✅ **Solución 3: Limpiar caché de React Native**

```bash
# En tu terminal
cd C_Ticket_Apk_STV

# Limpiar caché de Metro
npm start -- --reset-cache

# O si usas expo
npx expo start -c
```

---

## ✅ **Solución 4: Desinstalar y reinstalar la app**

En tu teléfono/emulador:
1. **Mantén presionado el ícono de la app**
2. **Selecciona "Desinstalar"**
3. **Vuelve a instalarla**
4. **Inicia sesión de nuevo**

Esto limpiará TODO el AsyncStorage incluyendo emails viejos.

---

## 🔍 **Cómo Verificar que Funciona**

Después de limpiar caché, abre la sección de correos y revisa los logs:

**✅ LOGS CORRECTOS (después de limpiar caché):**
```
📧 [EmailInboxView] Cargando correos...
🌐 [EmailMessages] Primera descarga desde servidor...
📩 [EmailInboxView] Correos: 50
📩 [EmailInboxView] Desde caché: false  ← DEBE SER FALSE EN PRIMERA CARGA
```

**❌ LOGS INCORRECTOS (caché vieja aún presente):**
```
📦 [EmailMessages] Usando caché local: 50 correos  ← ESTO ES caché VIEJA
📩 [EmailInboxView] Correos: 50
📩 [EmailInboxView] Desde caché: true  ← NO DEBERÍA SER true EN PRIMERA VEZ
```

---

## 🎯 **Verificar UIDs Correctos**

Cuando abras un correo, los logs deberían mostrar:

**✅ ANTES (INCORRECTO):**
```
📧 [EmailInboxView] Abriendo email UID: 0  ← UID:0 ES WRONG
```

**✅ AHORA (CORRECTO):**
```
📧 [EmailInboxView] Abriendo email UID: 11478  ← UID REAL DEL SERVIDOR
🌐 [EmailMessages] Descargando contenido completo (UID: 11478)
📧 [EmailContentViewer] Received email: {"attachmentsCount": 2, "hasHtml": true, "htmlLength": 15420, ...}
```

---

## 🚨 **Solución al OutOfMemoryError**

El error `java.lang.OutOfMemoryError: Failed to allocate a 200575760 bytes` (200MB) es porque el backend está enviando **HTML MUY GRANDE** o **adjuntos enormes**.

### **Causas:**
1. HTML con imágenes en base64 inline
2. Adjuntos enormes sin truncar
3. Respuesta del backend sin límite de tamaño

### **Soluciones:**

#### **1. Backend: Limitar tamaño de respuesta**
```typescript
// En email-fetcher.service.ts o email.service.ts
// Truncar HTML muy grandes
if (email.html.length > 100000) {
  email.html = email.html.substring(0, 100000) + '...[contenido truncado]';
}

// Truncar contenido de adjuntos
if (email.attachments.length > 0) {
  email.attachments = email.attachments.map(att => ({
    ...att,
    content: undefined,  // NO enviar contenido completo
    thumbnail: att.thumbnail?.substring(0, 1000),  // Truncar thumbnails
  }));
}
```

#### **2. Frontend: No cargar todo el HTML inicialmente**
```typescript
// En EmailInboxView.tsx, al obtener la lista
// Solo obtener metadata, NO el HTML completo
const emails = result.emails.map(e => ({
  ...e,
  html: '',  // HTML vacío en la lista
  text: e.text.substring(0, 100),  // Preview corto
}));
```

#### **3. Frontend: Lazy load al abrir el email**
```typescript
// Solo cargar HTML completo cuando el usuario ABRE el email
const openEmail = async (email: EmailMessage) => {
  setSelectedEmail(email);
  setLoadingFullContent(true);
  
  // Aquí sí descargar HTML completo
  const fullContent = await emailMessagesService.getFullMessage(
    email.uid,  // ✅ UID correcto
    email.folder
  );
  
  setFullEmailContent(fullContent);
  setLoadingFullContent(false);
};
```

---

## 📋 **Checklist Final**

- [ ] Limpié la caché del frontend (una de las 4 soluciones)
- [ ] Reinicié el backend (`npm run start:dev`)
- [ ] Reinicié el frontend (`npm start -- --reset-cache`)
- [ ] En logs, "Desde caché" es `false` en primera carga
- [ ] Al abrir email, UID es número real (11458+) no 0
- [ ] Email se abre con contenido HTML
- [ ] No hay OutOfMemoryError
- [ ] Adjuntos se muestran correctamente

---

## 🎉 **Una vez Todo Funcione**

El flujo correcto será:

1. **Abrir sección de Correos** → Descarga metadata (UIDs, asuntos, remitentes)
2. **Tocar un correo** → Descarga HTML completo SOLO de ese correo
3. **Ver correo con formato** → HTML renderizado profesionalmente
4. **Ver adjuntos** → Thumbnails y lista de archivos
5. **Cerrar correo** → Volver a lista
6. **Segundo refresh** → Solo descarga correos NUEVOS (caché funciona)
