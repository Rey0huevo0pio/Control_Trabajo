# 📝 PLANTILLA DE DOCUMENTACIÓN PARA COMPONENTES

> **CÓMO USAR:** Copiar esta plantilla en cada nuevo componente, screen o módulo creado
> **UBICACIÓN:** Mismo directorio del archivo, con nombre `[NombreComponente].md`

---

## 📱 `[NombreComponente]` - Documentación

> **Última actualización:** `[YYYY-MM-DD]`
> **Autor:** `[Nombre]`
> **Estado:** ✅ Activo | 🔄 En desarrollo | ⚠️ Deprecated

---

## 📋 DESCRIPCIÓN GENERAL

### ¿Qué hace este componente?
`[Descripción clara y concisa de la responsabilidad principal]`

### ¿Para qué sirve?
`[Explicación del valor que aporta al usuario/sistema]`

### ¿Cómo funciona?
`[Explicación técnica del flujo de datos y comportamiento]`

---

## 📋 RESUMEN DE ARCHIVOS

| Archivo | Propósito | Última modificación |
|---------|-----------|---------------------|
| `[NombreComponente].jsx` | Componente principal | `[YYYY-MM-DD]` |
| `[NombreComponente].test.jsx` | Tests del componente | `[YYYY-MM-DD]` |
| `[otros archivos]` | `[descripción]` | `[YYYY-MM-DD]` |

---

## 🔄 HISTORIAL DE CAMBIOS

### [YYYY-MM-DD] - [Descripción breve del cambio]
- **Qué se hizo:** 
  - [Descripción específica de los cambios]
- **Por qué:** 
  - [Razón del cambio, ticket, issue, etc.]
- **Cómo funciona:** 
  - [Explicación técnica de la implementación]
  - [Flujo de datos si aplica]
- **Archivos modificados:**
  - `[ruta/archivo1.jsx]` - [qué cambió]
  - `[ruta/archivo2.jsx]` - [qué cambió]
- **Problemas encontrados:** 
  - [Lista de errores o dificultades]
- **Soluciones aplicadas:** 
  - [Cómo se resolvió cada problema]

---

## 🚨 PROBLEMAS Y SOLUCIONES

### Problema 1: [Título descriptivo]
- **Síntoma:** [Qué se observó inicialmente]
- **Causa:** [Qué lo provocó, causa raíz]
- **Solución:** 
  ```javascript
  // Código de la solución aplicada
  ```
- **Lección:** [Qué aprender para no repetir]
- **Referencia:** `[link a APRENDIZAJE.md si está documentado]`

### Problema 2: [Título descriptivo]
- **Síntoma:** [Qué se observó inicialmente]
- **Causa:** [Qué lo provocó, causa raíz]
- **Solución:** [Cómo se resolvió]
- **Lección:** [Qué aprender para no repetir]

---

## 🔗 CONEXIONES

### API Endpoints
- `GET /api/[endpoint]` - [para qué se usa]
- `POST /api/[endpoint]` - [para qué se usa]

### Stores
- `use[Nombre]Store` - [qué datos consume]
- `useAuthStore` - [qué datos de auth usa]

### Componentes Hijos
- `[ChildComponent]` - [para qué se usa]
- `[OtroComponent]` - [para qué se usa]

### Hooks
- `use[NombreHook]` - [qué hace]
- `useNavigation` - [navegación]
- `useQuery` - [queries]

### Navegación
- **Ruta actual:** `/[ruta]`
- **Navega a:** `/[otra-ruta]` con params `{[params]}`
- **Viene de:** `/[ruta-anterior]`

---

## 🎨 DISEÑO Y ESTILOS

### Design System
- Componentes usados de `@/components/design-system/`:
  - `Button` - variantes usadas
  - `Input` - variantes usadas
  - `Card` - variantes usadas

### Tokens de Tamagui
- Colores: `$color`, `$background`, etc.
- Spacing: `$2`, `$4`, `$6`, etc.
- Typography: `$heading`, `$body`, etc.

### ⚠️ ADVERTENCIAS DE ESTILO
- [ ] NO cambiar estilos sin permiso explícito
- [ ] Consultar DESIGN_SYSTEM.md antes de modificar
- [ ] Consultar DESIGN_RULES.md antes de modificar

---

## 🧪 TESTING

### Tests existentes
- [ ] Tests unitarios: `[archivo.test.jsx]`
- [ ] Tests de integración: `[archivo.test.jsx]`
- [ ] Tests E2E: `[archivo.spec.js]`

### Cómo testear
```bash
# Comando para testear este componente
npm run test -- [NombreComponente]
```

### Casos de prueba importantes
1. [Caso 1] - [qué prueba]
2. [Caso 2] - [qué prueba]
3. [Caso de error] - [qué prueba]

---

## 💡 NOTAS IMPORTANTES

### Cosas a recordar
- [Nota 1]
- [Nota 2]
- [Nota 3]

### Advertencias
- ⚠️ [Advertencia 1]
- ⚠️ [Advertencia 2]

### Mejores prácticas específicas
- [Práctica 1]
- [Práctica 2]

### Errores comunes
- [Error común 1] - cómo evitarlo
- [Error común 2] - cómo evitarlo

---

## 📚 REFERENCIAS EXTERNAS

- [Documentación oficial de React](https://react.dev)
- [Documentación de Tamagui](https://tamagui.dev)
- [Documentación de Zustand](https://zustand.docs.pmnd.rs)
- [Otros recursos relevantes]

---

## 🏷️ TAGS

`[#componente]` `[#screen]` `[#archivero]` `[#formulario]` `[#api]` `[#auth]`

---

> **Mantener este archivo actualizado después de cada cambio**
> **Última revisión:** [YYYY-MM-DD] por [Nombre]
