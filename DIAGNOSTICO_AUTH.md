# 🔧 Diagnóstico de Autenticación

## Problema: Error 401 Unauthorized en `/api/users`

### Causa
El endpoint `/api/users` requiere **autenticación JWT**. El error 401 significa que:
1. ❌ No hay token JWT enviado, O
2. ❌ El token es inválido/expirado, O
3. ❌ El usuario no tiene permisos suficientes

---

## ✅ Flujo Correcto de Autenticación

```
1. Usuario abre la app
   ↓
2. Ve pantalla de Login
   ↓
3. Ingresa Control_Usuario y Password
   ↓
4. Backend valida credenciales
   ↓
5. Backend devuelve: { user: {...}, token: "JWT_TOKEN" }
   ↓
6. Frontend guarda token (authStore.login)
   ↓
7. Frontend navega a Home
   ↓
8. Usuario va a "Gestión de Usuarios"
   ↓
9. UserList hace GET /api/users CON el token
   ↓
10. Backend verifica token y devuelve usuarios ✅
```

---

## 🔍 Pasos para Solucionar

### Paso 1: Verifica que hiciste Login correctamente

**Prueba de Login:**
```bash
# Abre una terminal y prueba el login:
curl -X POST http://192.168.100.29:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"Control_Usuario":"TU_USUARIO","password":"TU_PASSWORD"}'
```

**Si la respuesta es:**
```json
{
  "success": true,
  "message": "Login exitoso",
  "data": {
    "user": { ... },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```
✅ Login funciona

**Si la respuesta es 401:**
```json
{
  "message": "Credenciales inválidas",
  "error": "Unauthorized",
  "statusCode": 401
}
```
❌ Usuario o contraseña incorrectos

### Paso 2: Crea un usuario de prueba (si no tienes ninguno)

```bash
curl -X POST http://192.168.100.29:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "Control_Usuario": "USR001",
    "password": "123456",
    "nombre": "Admin",
    "apellido": "Test",
    "rol": "admin"
  }'
```

### Paso 3: Verifica el token en el frontend

**En el LoginScreen, después del login exitoso:**
- El token debe guardarse en `authStore`
- `setAuthToken(token)` debe ser llamado
- Todas las peticiones siguientes deben incluir `Authorization: Bearer TOKEN`

### Paso 4: Accede a Gestión de Usuarios DESPUÉS del Login

**Orden correcta:**
1. ✅ Abre la app
2. ✅ Haz login con un usuario válido
3. ✅ Navega al Home
4. ✅ Ve a "Gestión de Usuarios"
5. ✅ Debería cargar la lista de usuarios

**Orden INCORRECTA:**
1. ❌ Abre la app
2. ❌ Va directamente a "Gestión de Usuarios" (sin login)
3. ❌ Error 401 - No hay token

---

## 🛠️ Solución Temporal (SOLO PARA DESARROLLO)

Si quieres probar sin autenticación temporalmente:

### Opción A: Quitar guards del backend (NO RECOMENDADO)

**Archivo:** `src/Controllers/Usuarios/users.controller.ts`

```typescript
// ANTES (requiere auth):
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {

// DESPUÉS (sin auth - SOLO DESARROLLO):
@Controller('users')
// @UseGuards(JwtAuthGuard, RolesGuard)  // Comentado
export class UsersController {
```

⚠️ **IMPORTANTE:** Esto elimina la seguridad. NO lo uses en producción.

### Opción B: Crear endpoint público para desarrollo

Agrega un endpoint sin auth temporal:

```typescript
// En users.controller.ts
@Get('public')
findAllPublic() {
  return this.usersService.findAll();
}
```

---

## 📋 Checklist de Verificación

- [ ] Backend corriendo en puerto 3000
- [ ] MongoDB conectado
- [ ] Usuario registrado en la BD
- [ ] Login exitoso (recibes token)
- [ ] Token guardado en authStore
- [ ] Navegas a Gestión de Usuarios DESPUÉS del login
- [ ] Token se envía en header `Authorization: Bearer ...`

---

## 🚀 Comandos Útiles

### Ver logs del backend:
```bash
cd backen_cerebro
npm start
```

### Ver logs del frontend:
```bash
cd C_Ticket_Apk_STV
npx expo start
```

### Probar endpoint con token:
```bash
# Primero haz login y copia el token
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# Luego prueba el endpoint
curl -X GET http://192.168.100.29:3000/api/users \
  -H "Authorization: Bearer $TOKEN"
```

---

## 💡 Tips

1. **Siempre haz login primero** antes de acceder a cualquier pantalla protegida
2. **El token expira** - si pasa mucho tiempo, haz login de nuevo
3. **Verifica la consola** - hay mensajes de error detallados
4. **Reinicia la app** después de cambios en el código

---

**Fecha:** Abril 5, 2026
