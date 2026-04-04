# Configuración de Red - Frontend y Backend

## ✅ Configuración Realizada

### Backend (NestJS)
- **Ya está configurado** para escuchar en `0.0.0.0:3000`
- Archivo: `src/main.ts` (línea 31: `await app.listen(port, '0.0.0.0')`)
- CORS habilitado para todas las origins

### Frontend (Expo/React Native)
- **API_URL configurado**: `http://192.168.68.111:3000/api`
- **app.json actualizado** para soporte de red

## 🚀 Cómo Iniciar

### 1. Iniciar Backend
```bash
cd backen_cerebro
npm run start:dev
```
El backend escuchará en:
- `http://localhost:3000`
- `http://192.168.68.111:3000` (accesible desde la red)

### 2. Iniciar Frontend
```bash
cd C_Ticket_Apk_STV
npm start
```

## 📱 Conectar Dispositivos Móviles

### Opción A: Usando Expo Go (WiFi)
1. Asegúrate que tu dispositivo y PC estén en la **misma red WiFi**
2. Escanea el QR code que muestra Expo
3. La app se conectará al backend usando `192.168.68.111:3000`

### Opción B: USB + WiFi (Backend)
1. Conecta el dispositivo por USB para debugging
2. El backend sigue siendo accesible vía `192.168.68.111:3000`

## 🔧 Cambiar IP del Backend

Si tu IP cambia, actualiza `src/constants/index.ts`:

```typescript
export const API_URL = 'http://<TU-IP-ACTUAL>:3000/api'
```

### Encontrar tu IP (Windows):
```cmd
ipconfig
```
Busca "Dirección IPv4" en tu adaptador WiFi

## 🔍 Verificar Conexión

### Desde tu dispositivo móvil:
1. Abre el navegador
2. Ve a: `http://192.168.68.111:3000/api`
3. Deberías ver una respuesta del backend

### Desde tu PC:
```bash
curl http://192.168.68.111:3000/api
```

## ⚠️ Solución de Problemas

### Firewall de Windows
Si no puedes conectar desde otros dispositivos:

1. **Abrir Puerto 3000 en Firewall**:
   - Panel de Control → Firewall de Windows → Configuración avanzada
   - Regla de entrada → Nueva regla → Puerto
   - TCP → Puerto específico: `3000`
   - Permitir la conexión → Aplicar a todas las redes
   - Nombre: "Backend STV Port 3000"

2. **O desactivar temporalmente el firewall** (solo para pruebas):
   - Panel de Control → Firewall de Windows → Activar o desactivar
   - Desactivar en redes privadas (temporalmente)

### Backend no responde
- Verifica que está corriendo: `http://localhost:3000/api`
- Revisa la consola del backend para errores

### Dispositivo no conecta
- Verifica que está en la **misma red WiFi**
- Intenta hacer ping: `ping 192.168.68.111` desde otro dispositivo
