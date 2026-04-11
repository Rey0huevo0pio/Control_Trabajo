# 🧠 SISTEMA DE AUTO-APRENDIZAJE

> **Este archivo define cómo el asistente aprende de los errores y se auto-actualiza**
>
> **⚡ REGLA DE ORO:** Cada error encontrado y solución aplicada DEbe quedar documentada aquí
> para no repetir el mismo problema en el futuro.

---

## 📋 REGLAS FUNDAMENTALES

### 1. NUNCA REPETIR ERRORES
- Si un error ya fue solucionado, la solución debe estar documentada
- Antes de implementar, consultar este archivo y `SOLUCIONES_CONOCIDAS.md`
- Si encuentras el mismo error, referencia la solución previa

### 2. DOCUMENTAR TODO
- **Cada cambio en código** = documentación automática
- **Cada error** = registro + solución
- **Cada decisión** = explicación del porqué
- **Cada mejora** = qué se mejoró y cómo

### 3. AUTO-ACTUALIZACIÓN
- Después de cada cambio, actualizar:
  - ✅ Este archivo (si hay nuevos aprendizajes)
  - ✅ `SOLUCIONES_CONOCIDAS.md` (si hay nuevas soluciones)
  - ✅ `CHANGELOG.md` (registro cronológico)
  - ✅ `.md` del módulo afectado
  - ✅ Skills relacionados (si aplica)
  - ✅ Constantes y tipos (si cambiaron)

---

## 📚 LECCIONES APRENDIDAS

### Formato de registro:
```markdown
### [ID] - Título del Problema
- **Fecha:** YYYY-MM-DD
- **Módulo afectado:** nombre del módulo
- **Error/Síntoma:** descripción del problema
- **Causa raíz:** qué lo causó
- **Solución aplicada:** cómo se resolvió
- **Archivos modificados:** lista de archivos
- **Lección:** qué aprender para no repetirlo
- **Referencia:** link a documentación relevante
```

---

## 🚨 ERRORES CONOCIDOS Y SOLUCIONES

### [E001] - Error de imports con rutas relativas
- **Fecha:** 2026-04-11
- **Módulo afectado:** Todos los módulos
- **Error/Síntoma:** `Cannot find module` al importar entre componentes
- **Causa raíz:** Uso de rutas relativas incorrectas o faltante extensión `.jsx`
- **Solución aplicada:** 
  - Usar siempre rutas relativas desde el archivo actual
  - Incluir extensión `.jsx` en imports de componentes
  - Usar barrel exports (`index.js`) para simplificar
- **Archivos modificados:** Varios screens
- **Lección:** Siempre verificar imports antes de commitear, usar `npm run lint`
- **Referencia:** `Web-Flonten/.qwen/IMPORTS_GUIDE.md`

### [E002] - Estado no se actualiza en React
- **Fecha:** 2026-04-11
- **Módulo afectado:** EscanearDocumentoScreen
- **Error/Síntoma:** UI no refleja cambios después de acción
- **Causa raíz:** Mutación directa de estado en lugar de crear nuevo objeto
- **Solución aplicada:** 
  - Usar spread operator `{...estado, nuevoCampo}` en lugar de `estado.campo = valor`
  - Con Zustand, usar `set()` correctamente
- **Archivos modificados:** `EscanearDocumentoScreen.jsx`
- **Lección:** Nunca mutar estado directamente, siempre crear nuevas referencias
- **Referencia:** React docs - State updates

### [E003] - Estilos inconsistentes entre pantallas
- **Fecha:** 2026-04-11
- **Módulo afectado:** Múltiples screens
- **Error/Síntoma:** Botones y cards se ven diferentes en cada pantalla
- **Causa raíz:** No usar el Design System, crear estilos inline
- **Solución aplicada:** 
  - Importar componentes de `@/components/design-system/`
  - Usar tokens de Tamagui en lugar de valores hardcodeados
  - Seguir `DESIGN_SYSTEM.md` y `DESIGN_RULES.md`
- **Archivos modificados:** Varios screens
- **Lección:** SIEMPRE usar el Design System, NUNCA crear estilos desde cero
- **Referencia:** `Web-Flonten/.qwen/DESIGN_SYSTEM.md`

---

## 🎯 PATRONES DE SOLUCIÓN REUTILIZABLES

### Patrón 1: Autenticación
```javascript
// SIEMPRE usar este patrón para verificar auth
import { useAuthStore } from '@/store/authStore';
const { user, isAuthenticated } = useAuthStore();
if (!isAuthenticated()) return <Navigate to="/login" />;
```

### Patrón 2: Llamadas API
```javascript
// SIEMPRE usar este patrón para API calls
import { api } from '@/services/api';
try {
  const response = await api.get('/endpoint');
  setData(response.data);
} catch (error) {
  console.error('Error:', error.response?.data || error.message);
  setError(error.response?.data?.message || 'Error desconocido');
}
```

### Patrón 3: Estado con Zustand
```javascript
// SIEMPRE usar este patrón para estado global
import { create } from 'zustand';
export const useStore = create((set) => ({
  data: null,
  setData: (data) => set({ data }),
  clearData: () => set({ data: null }),
}));
```

### Patrón 4: Documentación de Componente
```javascript
/**
 * ============================================================================
 * 📱 NOMBRE_COMPONENTE - Descripción corta
 * ============================================================================
 *
 * QUÉ HACE:
 * - Responsabilidad principal
 * - Funcionalidades clave
 *
 * CONEXIONES:
 * - API: /endpoint (método)
 * - Store: useStore (qué usa)
 * - Componentes: ChildComponent (para qué)
 *
 * PROPS:
 * - prop1: tipo - descripción
 * - prop2: tipo - descripción
 *
 * ============================================================================
 */
```

---

## 🔄 FLUJO DE AUTO-MEJORA

### Después de CADA cambio:

1. **Identificar qué cambió**
   - ¿Nuevos archivos?
   - ¿Archivos modificados?
   - ¿Archivos eliminados?

2. **Documentar el cambio**
   - ¿Por qué se hizo?
   - ¿Qué problema resuelve?
   - ¿Cómo funciona?

3. **Registrar errores encontrados**
   - ¿Hubo errores durante la implementación?
   - ¿Cómo se solucionaron?
   - ¿Qué se aprendió?

4. **Actualizar documentación**
   - `CHANGELOG.md` → registro cronológico
   - `APRENDIZAJE.md` → lecciones aprendidas
   - `SOLUCIONES_CONOCIDAS.md` → soluciones técnicas
   - `.md` del módulo → documentación específica
   - Skills → si se crearon nuevas habilidades

5. **Verificar consistencia**
   - ¿Los imports son correctos?
   - ¿Los tipos están actualizados?
   - ¿Las constantes reflejan los cambios?
   - ¿El Design System se respetó?

---

## 📝 CHECKLIST DE DOCUMENTACIÓN

Antes de considerar una tarea completa:

- [ ] Código comentado con formato estándar
- [ ] README del módulo actualizado/creado
- [ ] CHANGELOG.md actualizado
- [ ] APRENDIZAJE.md actualizado (si hay errores/soluciones)
- [ ] SOLUCIONES_CONOCIDAS.md actualizado (si hay soluciones)
- [ ] Constantes actualizadas (si aplica)
- [ ] Tipos actualizados (si aplica)
- [ ] Skills actualizados (si aplica)
- [ ] Design System respetado
- [ ] Imports correctos
- [ ] Rutas correctas

---

## 🔗 ARCHIVOS RELACIONADOS

| Archivo | Propósito |
|---------|-----------|
| `SOLUCIONES_CONOCIDAS.md` | Base de datos de soluciones técnicas |
| `CHANGELOG.md` | Historial cronológico de cambios |
| `INDEX.md` | Índice maestro de documentación |
| `skills/doc-auto-update.md` | Skill de auto-actualización |
| `skills/error-resolution.md` | Skill de resolución de errores (por crear) |

---

> **Última actualización:** 2026-04-11
> **Creado por:** Sistema de Auto-Aprendizaje Qwen
> **Regla:** NUNCA repetir errores documentados, SIEMPRE consultar antes de implementar
