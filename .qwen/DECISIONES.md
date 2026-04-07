# 🎯 DECISIONES TÉCNICAS - STV Global

> **Por qué se eligió cada tecnología, patrón y enfoque**
> 
> **Propósito:** Documentar el "por qué" detrás de cada decisión técnica para no perder el contexto

---

## 📚 STACK TECNOLÓGICO

### Backend: ¿Por qué NestJS?

**Decisión:** NestJS 11 + TypeScript

**Por qué:**
- ✅ Arquitectura modular y escalable por defecto
- ✅ Inyección de dependencias nativa
- ✅ TypeScript obligatorio → menos bugs en runtime
- ✅ Guards, Interceptors, Pipes → auth y validación centralizada
- ✅ Compatible con Express y Fastify
- ✅ Testing integrado (Jest)
- ✅ Comunidad grande y documentación extensa

**Alternativas consideradas:**
- ❌ Express puro → Menos estructura, más boilerplate
- ❌ Fastify → Menos maduro, menos ecosistema
- ❌ Django/FastAPI → Python, pero el equipo usa TypeScript

---

### Base de Datos: ¿Por qué MongoDB?

**Decisión:** MongoDB 9 con Mongoose ODM

**Por qué:**
- ✅ Schema flexible → ideal para datos que cambian (tickets, chat)
- ✅ Documentos anidados → perfecto para mensajes en chat, historial de estados
- ✅ Escala horizontalmente fácil
- ✅ JSON nativo → coincide con API responses
- ✅ Mongoose → validación de schema, hooks, tipos
- ✅ Rápido para lectura/escritura de documentos

**Alternativas consideradas:**
- ❌ PostgreSQL → Más rígido, requiere migraciones para cambios de schema
- ❌ MySQL → Mismo problema que PostgreSQL
- ❌ Redis → Solo para cache, no para datos persistentes

---

### Auth: ¿Por qué JWT + Passport?

**Decisión:** JWT tokens con Passport strategy

**Por qué:**
- ✅ Stateless → no requiere sesión en servidor
- ✅ Escala horizontal sin sticky sessions
- ✅ Mobile-friendly → tokens se guardan en device
- ✅ Passport → ecosystema grande, estrategias probadas
- ✅ Fácil de integrar con React Native
- ✅ Expiración configurable → seguridad

**Payload del token:**
```typescript
{
  sub: userId,           // ID del usuario
  Control_Usuario: string, // Identificador único
  rol: RolUsuario        // Rol para autorización rápida
}
```

**Alternativas consideradas:**
- ❌ Session-based → Requiere cookies, no funciona bien con mobile
- ❌ API keys → No soporta usuarios individuales
- ❌ OAuth2 → Overkill para uso interno

---

### Frontend: ¿Por qué React Native + Expo?

**Decisión:** React Native con Expo SDK

**Por qué:**
- ✅ Un código para iOS y Android
- ✅ TypeScript compartido con backend
- ✅ Expo → desarrollo más rápido, menos configuración nativa
- ✅ Hot reload → iteración rápida
- ✅ Ecosistema React → mismos patrones que web
- ✅ Acceso a APIs nativas cuando sea necesario

**Alternativas consideradas:**
- ❌ Nativo (Swift/Kotlin) → Doble trabajo, doble mantenimiento
- ❌ Flutter → Dart, lenguaje adicional al equipo
- ❌ Ionic → Rendimiento inferior para casos complejos

---

### UI: ¿Por qué Tamagui?

**Decisión:** Tamagui como UI framework

**Por qué:**
- ✅ Performance optimizado (compila a CSS)
- ✅ Tipos TypeScript fuertes
- ✅ Shortharms → código más conciso
- ✅ Temas → modo claro/oscuro fácil
- ✅ Responsive → adapta a diferentes tamaños de pantalla
- ✅ Components accesibles por defecto

**Alternativas consideradas:**
- ❌ React Native StyleSheet → Más boilerplate, menos reusable
- ❌ NativeWind → Tailwind para RN, pero menos tipos
- ❌ UI Kitten → Menos flexible

---

### Estado Global: ¿Por qué Zustand?

**Decisión:** Zustand para estado global

**Por qué:**
- ✅ API simple → menos boilerplate que Redux
- ✅ TypeScript nativo → tipos automáticos
- ✅ Sin providers → no envolver app
- ✅ Middleware fácil → persist, devtools
- ✅ Pequeño → ~1KB bundle size
- ✅ Funciona bien con React Native

**Store principal:**
```typescript
// authStore.ts
{
  user: User | null,
  token: string | null,
  isAuthenticated: boolean,
  login(), logout(), hasPermission(), hasRole()
}
```

**Alternativas consideradas:**
- ❌ Redux → Demasiado boilerplate para este caso
- ❌ Context API → Rendimiento pobre para updates frecuentes
- ❌ MobX → Más complejo de configurar

---

## 🏗️ PATRONES DE DISEÑO

### ¿Por qué Arquitectura Multi-Módulo en Frontend?

**Decisión:** `src/` + `src_*_STV/` módulos independientes

**Por qué:**
- ✅ Separación de responsabilidades clara
- ✅ Cada módulo puede desarrollarse independientemente
- ✅ Fácil de navegar → saber dónde está cada cosa
- ✅ Módulos reutilizables → podrían separarse en paquetes
- ✅ AppNavigator como conector central → punto único de integración

**Estructura:**
```
src/                    # Principal (Auth, Home, Users)
src_Archivero_STV/      # Gestión documental
src_Chat_STV/           # Chat + Email + Noticias
src_Instalaciones_STV/  # Instalaciones
src_P_Ticket_IT/        # Tickets IT
```

**Alternativas consideradas:**
- ❌ Todo en `src/` → Se volvería gigante, difícil de navegar
- ❌ Monorepo con paquetes → Overkill para este tamaño
- ❌ Feature folders → Mezcla demasiado, menos claro

---

### ¿Por qué RBAC (Role-Based Access Control)?

**Decisión:** Sistema de roles con permisos granulares

**Por qué:**
- ✅ Control fino de qué puede hacer cada usuario
- ✅ Fácil de auditar → saber quién hizo qué
- ✅ Escalable → agregar nuevos roles/permisos sin cambiar código
- ✅ Guards en backend + verificación en frontend → doble capa
- ✅ Mapeo de roles a permisos centralizado

**Roles:**
- `VIGILANTE` → Básico: dashboard, chat, tickets (crear/ver)
- `SUPERVISOR` → Vigilante + reportes, asignar tickets
- `RH` → Supervisor + gestión usuarios
- `IT` → Todos los permisos CRUD
- `ADMIN` → Sin restricciones

**Alternativas consideradas:**
- ❌ Solo roles → Demasiado grueso, no permite granularidad
- ❌ ACL → Más complejo de mantener
- ❌ ABAC → Overkill para este caso

---

### ¿Por qué DTOs con class-validator?

**Decisión:** DTOs como clases con decoradores

**Por qué:**
- ✅ Validación automática → no repetir en cada controller
- ✅ Tipos fuertes → TypeScript ayuda en compile time
- ✅ Whitelist → ignora campos no definidos → seguridad
- ✅ Transformación → convierte strings a números, fechas, etc.
- ✅ Mensajes de error claros → fácil debugging

**Ejemplo:**
```typescript
class CreateUsuarioDto {
  @IsString()
  @IsNotEmpty()
  Control_Usuario: string;

  @IsString()
  @MinLength(6)
  password: string;
}
```

**Alternativas consideradas:**
- ❌ Validación manual → Repetitiva, propensa a errores
- ❌ Zod → Bueno, pero no integrado con NestJS
- ❌ Joi → Menos tipos TypeScript

---

## 🔐 SEGURIDAD

### ¿Por qué CORS abierto en desarrollo?

**Decisión:** `origin: true` para desarrollo

**Por qué:**
- ✅ Desarrollo móvil → IP cambia, difícil de hardcodear
- ✅ No bloquear desarrollo → productividad
- ⚠️ DEBE cerrarse en producción → restringir a URLs específicas

**Para producción:**
```typescript
app.enableCors({
  origin: ['https://tudominio.com', 'https://app.tudominio.com'],
});
```

---

### ¿Por qué bcrypt con salt rounds 10?

**Decisión:** bcrypt.genSalt(10)

**Por qué:**
- ✅ Balance entre seguridad y rendimiento
- ✅ 10 rounds → ~100ms por hash → aceptable para login/register
- ✅ Resistente a ataques de fuerza bruta
- ✅ Estándar de la industria

**Alternativas consideradas:**
- ❌ MD5/SHA → No seguros, crackeables
- ❌ Argon2 → Más seguro, pero más complejo de configurar
- ❌ PBKDF2 → Más lento, mismo nivel de seguridad

---

### ¿Por qué password no se retorna en responses?

**Decisión:** `sanitizeUser()` elimina password

**Por qué:**
- ✅ Seguridad → nunca exponer contraseña
- ✅ No se necesita en frontend → solo para auth
- ✅ Previene leaks accidentales

---

## 📊 BASE DE DATOS

### ¿Por qué timestamps: true en schemas?

**Decisión:** `@Schema({ timestamps: true })`

**Por qué:**
- ✅ Automático → no manualmente en cada creación/update
- ✅ `createdAt` y `updatedAt` siempre disponibles
- ✅ Útil para auditoría y debugging
- ✅ Mongoose lo maneja automáticamente

---

### ¿Por qué índices en schemas?

**Decisión:** Índices en campos de búsqueda frecuente

**Por qué:**
- ✅ Performance → búsquedas más rápidas
- ✅ Unique → previene duplicados a nivel de BD
- ✅ Mongoose los crea automáticamente al iniciar

**Índices creados:**
```typescript
UsuarioSchema.index({ nombre: 1, apellido: 1 });  // Búsqueda
UsuarioSchema.index({ Control_Usuario: 1 }, { unique: true });  // Único
```

---

## 🔄 COMUNICACIÓN

### ¿Por qué API REST en lugar de GraphQL/WebSockets?

**Decisión:** REST para ahora, WebSockets podrían agregarse

**Por qué REST:**
- ✅ Simple y entendible
- ✅ Caché nativo
- ✅ Tooling maduro
- ✅ Fácil de testear
- ✅ Suficiente para casos actuales

**WebSockets podrían agregarse para:**
- Chat en tiempo real (ahora es polling o manual refresh)
- Notificaciones push
- Actualizaciones en vivo de tickets

---

## 📱 FRONTEND

### ¿Por qué Zustand en lugar de Redux/Context?

**Decisión:** Zustand

**Por qué:**
- ✅ Menos boilerplate → más productividad
- ✅ Sin providers → código más limpio
- ✅ TypeScript nativo → tipos automáticos
- ✅ Fácil de testear
- ✅ Suficiente para complejidad actual

---

### ¿Por qué React Navigation en lugar de otra navegación?

**Decisión:** React Navigation con Stack Navigator

**Por qué:**
- ✅ Oficial para React Native
- ✅ TypeScript support
- ✅ Animaciones nativas
- ✅ Fácil de configurar
- ✅ Comunidad grande

---

## 📝 CONVICIONES DE NOMBRES

### ¿Por qué `Control_Usuario` en lugar de `username` o `email`?

**Decisión:** `Control_Usuario` como identificador único

**Por qué:**
- ✅ Término del negocio → usuarios entienden
- ✅ Único por organización
- ✅ No cambia → email puede cambiar
- ✅ Formato específico de la empresa

---

### ¿Por qué prefijo `P_` para screens?

**Decisión:** `P_Auth`, `P_Principal`, etc.

**Por qué:**
- ✅ "P" = "Pantalla" o "Page"
- ✅ Fácil de identificar en imports
- ✅ Agrupa visualmente en IDE
- ✅ Convención del proyecto

---

### ¿Por qué `src_*_STV` para módulos?

**Decisión:** `src_Archivero_STV`, `src_Chat_STV`, etc.

**Por qué:**
- ✅ `src_` → indica que es código fuente
- ✅ `STV` → marca del proyecto (Sotavento)
- ✅ Diferencia de dependencias de npm
- ✅ Claro que es módulo del proyecto

---

## 🚨 DECISIONES IMPORTANTES A RECORDAR

1. **NO cambiar `Control_Usuario`** → Es identificador único, afectaría toda la BD
2. **NO eliminar roles existentes** → Usuarios existentes dependen de ellos
3. **Mantener CORS abierto en desarrollo** → Para desarrollo móvil
4. **Cerrar CORS en producción** → Por seguridad
5. **No cambiar estructura de JWT payload** → Tokens existentes dejarían de funcionar
6. **Mantener PERMISOS_POR_ROL actualizado** → Authorization depende de ello
7. **No cambiar schema de usuarios sin migración** → Puede romper datos existentes

---

> **NOTA:** Este archivo debe actualizarse cuando se tomen nuevas decisiones técnicas.
