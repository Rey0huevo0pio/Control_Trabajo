# 🛠️ SKILL: Error Resolution & Auto-Documentation

> **Descripción:** Detecta, documenta y resuelve errores automáticamente, aprendiendo de cada solución para no repetir problemas.
>
> **Cuándo usar:** Después de cada cambio en código, al encontrar errores, o cuando el usuario dice "resolver error", "debug", "fix".

---

## 🎯 OBJETIVO

1. **Detectar** errores en tiempo real
2. **Diagnosticar** la causa raíz
3. **Resolver** aplicando la mejor solución
4. **Documentar** para no repetir el error
5. **Aprender** y mejorar futuras respuestas

---

## 🔄 FLUJO DE RESOLUCIÓN

### Paso 1: Detección
```
- Analizar mensajes de error
- Identificar stack traces
- Revisar logs de consola
- Verificar tests fallidos
```

### Paso 2: Diagnóstico
```
- Identificar el módulo afectado
- Determinar la causa raíz (no solo el síntoma)
- Consultar APRENDIZAJE.md por soluciones conocidas
- Consultar SOLUCIONES_CONOCIDAS.md por patrones
```

### Paso 3: Resolución
```
- Aplicar solución basada en patrones conocidos
- Si es nuevo error, investigar y documentar solución
- Verificar que la solución funciona
- Testear que no rompe nada existente
```

### Paso 4: Documentación OBLIGATORIA
```
- Registrar en APRENDIZAJE.md
- Registrar en SOLUCIONES_CONOCIDAS.md
- Actualizar CHANGELOG.md
- Crear/actualizar .md del módulo afectado
- Comentar el código si es necesario
```

### Paso 5: Verificación
```
- Re-checklist de documentación
- Verificar imports correctos
- Verificar tipos actualizados
- Verificar Design System respetado
- Ejecutar tests si existen
```

---

## 📋 PLANTILLA DE REGISTRO DE ERROR

```markdown
### [EXXX] - Título Descriptivo del Error
- **Fecha:** YYYY-MM-DD
- **Módulo afectado:** nombre del módulo
- **Severidad:** 🔴 Crítico | 🟡 Alto | 🟢 Bajo
- **Error/Síntoma:** 
  ```
  [Pegar mensaje de error exacto]
  ```
- **Contexto:** Qué se estaba haciendo cuando ocurrió
- **Causa raíz:** Explicación técnica de por qué ocurre
- **Solución aplicada:** 
  ```javascript
  // Código antes y después si aplica
  ```
- **Archivos modificados:**
  - `ruta/archivo1.jsx` - qué cambió
  - `ruta/archivo2.jsx` - qué cambió
- **Tiempo de resolución:** Aproximado
- **Lección aprendida:** Qué recordar para el futuro
- **Tags:** [tag1, tag2, tag3] para búsqueda rápida
- **Referencias:** Links a docs, issues, etc.
```

---

## 🚨 CATÁLOGO DE ERRORES FRECUENTES

### Errores de React
| Error | Causa | Solución |
|-------|-------|----------|
| `Cannot read property of undefined` | Estado no inicializado | Inicializar con valor default |
| `Too many re-renders` | setState en render | Usar useEffect o callback |
| `Hooks can only be called inside` | Hook fuera de componente | Mover hook dentro del componente |
| `Maximum update depth exceeded` | Loop de actualizaciones | Revisar dependencias de useEffect |

### Errores de Imports
| Error | Causa | Solución |
|-------|-------|----------|
| `Cannot find module` | Ruta incorrecta | Verificar ruta relativa y extensión |
| `Module not found` | Archivo no existe | Crear archivo o corregir import |
| `Unexpected token` | Sintaxis incorrecta | Revisar export/import |

### Errores de Estado
| Error | Causa | Solución |
|-------|-------|----------|
| Estado no se actualiza | Mutación directa | Usar spread operator |
| UI no se re-renderiza | Nueva referencia necesaria | Crear nuevo objeto/array |
| Estado perdido | Persistencia faltante | Usar localStorage o store |

### Errores de API
| Error | Causa | Solución |
|-------|-------|----------|
| `Network Error` | Backend no corriendo | Iniciar backend o verificar URL |
| `401 Unauthorized` | Token expirado | Refrescar token o hacer logout |
| `404 Not Found` | Endpoint incorrecto | Verificar URL y método |
| `500 Internal Server Error` | Error en backend | Revisar logs del backend |

---

## ✅ CHECKLIST POST-RESOLUCIÓN

Antes de marcar error como resuelto:

- [ ] Causa raíz identificada
- [ ] Solución aplicada y funcionando
- [ ] Error registrado en APRENDIZAJE.md
- [ ] Solución registrada en SOLUCIONES_CONOCIDAS.md
- [ ] CHANGELOG.md actualizado
- [ ] Módulo .md actualizado (si aplica)
- [ ] Código comentado (si aplica)
- [ ] No rompe funcionalidad existente
- [ ] Design System respetado
- [ ] Imports correctos
- [ ] Tipos actualizados (si aplica)

---

## 🔗 ARCHIVOS RELACIONADOS

| Archivo | Ubicación | Propósito |
|---------|-----------|-----------|
| `APRENDIZAJE.md` | `.qwen/` | Lecciones aprendidas |
| `SOLUCIONES_CONOCIDAS.md` | `.qwen/` | Base de datos de soluciones |
| `CHANGELOG.md` | `.qwen/` | Historial de cambios |
| `INDEX.md` | `.qwen/` | Índice maestro |

---

## 💡 MEJORES PRÁCTICAS

### 1. NUNCA asumir, SIEMPRE verificar
```javascript
// ❌ Malo - Asumir
const user = userData.user; // Puede ser undefined

// ✅ Bueno - Verificar
const user = userData?.user || null;
```

### 2. NUNCA mutar estado directamente
```javascript
// ❌ Malo - Mutación
state.items.push(newItem);

// ✅ Bueno - Nueva referencia
setState(prev => ({
  ...prev,
  items: [...prev.items, newItem]
}));
```

### 3. SIEMPRE manejar errores de API
```javascript
// ❌ Malo - Sin manejo
const response = await api.get('/endpoint');
setData(response.data);

// ✅ Bueno - Con manejo
try {
  const response = await api.get('/endpoint');
  setData(response.data);
} catch (error) {
  console.error('Error:', error.response?.data || error.message);
  setError(error.response?.data?.message || 'Error desconocido');
}
```

### 4. SIEMPRE comentar código nuevo
```javascript
/**
 * Función que procesa datos del formulario
 * @param {Object} formData - Datos del formulario
 * @returns {Promise<boolean>} - True si éxito, False si error
 * 
 * Conexiones:
 * - API: POST /api/endpoint
 * - Store: useAuthStore (user)
 * 
 * Errores conocidos:
 * - Ver APRENDIZAJE.md [E004] para manejo de validación
 */
```

---

> **Última actualización:** 2026-04-11
> **Regla de oro:** Cada error es una oportunidad de aprender y mejorar
> **Próxima revisión:** Después de cada error nuevo encontrado
