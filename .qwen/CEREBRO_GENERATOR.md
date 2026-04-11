# 🧠 CEREBRO GENERATOR - Prompt Template

> **Copia y pega este prompt en cualquier proyecto nuevo o existente**
> **Qwen Code creará automáticamente todo el sistema de cerebro como el que ya tienes**

---

## 📋 PROMPT PARA GENERAR CEREBRO

```
Quiero que crees el "cerebro" completo de este proyecto usando la arquitectura probada de .qwen/.

## 🎯 QUÉ NECESITO

Quiero un sistema completo de documentación y contexto que incluya:

### 1. DOCUMENTOS MAESTROS (en .qwen/)
- **INDEX.md** - Índice maestro con todos los documentos
- **CEREBRO.md** - Contexto general del proyecto (arquitectura, stack, módulos)
- **CONTEXT.md** - Contexto persistente que se carga en cada sesión
- **BACKEND_INDEX.md** - Mapa detallado del backend (si aplica)
- **FRONTEND_INDEX.md** - Mapa detallado del frontend (si aplica)
- **IMPORTS_GUIDE.md** - Guía completa de imports y dependencias
- **ENDPOINTS.md** - Todos los endpoints documentados (si hay API)
- **FLUJOS.md** - Flujos de negocio completos paso a paso
- **DECISIONES.md** - Decisiones técnicas y por qué se eligió cada cosa
- **DESIGN_SYSTEM.md** - Sistema de diseños y estilos (si hay UI)
- **DESIGN_RULES.md** - Reglas de consistencia de diseño (si hay UI)
- **CHANGELOG.md** - Historial de cambios con template

### 2. SKILLS (en .qwen/skills/)
- **doc-auto-update.md** - Skill que detecta cambios y actualiza docs automáticamente
- **ui-design-planning.md** - Skill de planificación de diseño UI/UX (si hay frontend)

### 3. COMENTARIOS EN CÓDIGO
Todos los archivos clave deben tener comentarios explicativos con:
- Qué hace el archivo
- Conexiones con otros archivos (rutas relativas)
- Endpoints que genera (backend)
- Cómo modificarlo

### 4. CARACTERÍSTICAS DEL CEREBRO

**Autoactualización:**
- Después de cada cambio en código → actualizar documentación
- Detectar código no documentado → documentarlo
- Antes de commit → verificar docs actualizados

**Protección de diseños:**
- NO cambiar estilos sin permiso explícito
- Verificar DESIGN_SYSTEM.md antes de modificar
- Preguntar al usuario qué quiere cambiar
- Mostrar diseño antes/después

**Consistencia:**
- Reglas estrictas de diseño
- NO hardcodear colores
- Usar componentes reutilizables
- Migrar, no duplicar

## 📐 ESTRUCTURA QUE DEBE CREAR

```
.qwen/
├── INDEX.md                    # Índice maestro
├── CEREBRO.md                  # Contexto general
├── CONTEXT.md                  # Contexto persistente
├── BACKEND_INDEX.md            # Mapa backend
├── FRONTEND_INDEX.md           # Mapa frontend
├── IMPORTS_GUIDE.md            # Guía de imports
├── ENDPOINTS.md                # Endpoints documentados
├── FLUJOS.md                   # Flujos de negocio
├── DECISIONES.md               # Decisiones técnicas
├── DESIGN_SYSTEM.md            # Sistema de diseños
├── DESIGN_RULES.md             # Reglas de consistencia
├── CHANGELOG.md                # Historial de cambios
└── skills/
    ├── doc-auto-update.md      # Autoactualización
    └── ui-design-planning.md   # Planificación UI
```

## 🔍 INSTRUCCIONES PARA QWEN CODE

1. **Explorar el proyecto completo**
   - Listar TODAS las carpetas y subcarpetas
   - Identificar stack tecnológico
   - Detectar módulos existentes
   - Mapear archivos clave

2. **Crear documentos con información real**
   - NO usar placeholders
   - Usar información REAL del proyecto
   - Documentar TODOS los módulos encontrados
   - Listar TODOS los endpoints existentes
   - Registrar TODOS los estilos de diseño

3. **Comentar archivos críticos**
   - Entry points (main.ts, App.tsx, index.ts, etc.)
   - Configuración principal (app.module.ts, etc.)
   - Servicios clave
   - Guards/Middleware
   - Stores de estado global

4. **Configurar autoactualización**
   - Skill de doc-auto-update
   - Skill de ui-design-planning
   - Reglas de protección de diseños

5. **Generar CHANGELOG inicial**
   - Registrar creación del cerebro
   - Listar todos los archivos creados
   - Template para futuras entradas

## ✅ CHECKLIST DE VERIFICACIÓN

Después de crear el cerebro, verificar:
- [ ] Todos los 12 archivos existen en .qwen/
- [ ] Los 2 skills existen en .qwen/skills/
- [ ] BACKEND_INDEX.md tiene TODOS los módulos documentados
- [ ] FRONTEND_INDEX.md tiene TODOS los módulos/screens
- [ ] ENDPOINTS.md tiene TODOS los endpoints reales
- [ ] DESIGN_SYSTEM.md tiene TODOS los estilos encontrados
- [ ] CONTEXT.md tiene resumen completo del proyecto
- [ ] Al menos 5 archivos críticos tienen comentarios explicativos
- [ ] INDEX.md referencia todos los documentos

## 📝 INFORMACIÓN DEL PROYECTO ACTUAL

**Tipo de proyecto:** [Fullstack / Frontend-only / Backend-only]
**Stack tecnológico detectado:** [Qwen debe identificarlo]
**Framework principal:** [Qwen debe identificarlo]
**Base de datos:** [si aplica]
**Frontend:** [si aplica]
**Backend:** [si aplica]

## 🚀 IMPORTANTE

- NO crear documentos vacíos o con placeholders
- TODA la información debe venir del proyecto real
- Explorar CADA carpeta antes de escribir
- Documentar TODO lo que encuentres
- Si hay código existente → comentarlo
- Si hay APIs → documentar endpoints
- Si hay UI → registrar estilos y patrones

**Proceder a crear el cerebro completo ahora.**
```

---

## 💡 CÓMO USAR ESTE PROMPT

### Para Proyecto Nuevo

1. Crear estructura básica del proyecto
2. Copiar y pegar el prompt de arriba
3. Qwen Code explorará y creará todo el cerebro
4. Verificar con el checklist
5. ¡Listo para trabajar!

### Para Proyecto Existente

1. Ir al directorio del proyecto
2. Abrir chat con Qwen Code
3. Copiar y pegar el prompt
4. Qwen Code mapeará TODO lo existente
5. Creará documentos con información real
6. Verificar con el checklist
7. ¡Cerebro listo!

### Para Migrar de Mobile a Web (o viceversa)

1. Tener el cerebro del proyecto original
2. Crear nuevo proyecto para la plataforma destino
3. Copiar y pegar el prompt en el nuevo proyecto
4. Qwen Code creará cerebro adaptado a la nueva plataforma
5. Referenciar el cerebro original para mantener consistencia

---

## 🔧 PERSONALIZACIÓN DEL PROMPT

**Si el proyecto es solo Backend:**
Agregar al prompt:
```
Este proyecto es SOLO backend. No crear:
- FRONTEND_INDEX.md
- DESIGN_SYSTEM.md
- DESIGN_RULES.md
- ui-design-planning.md

Enfocarse en:
- API endpoints
- Modelos/Schemas
- Servicios
- Autenticación
- Base de datos
```

**Si el proyecto es solo Frontend:**
Agregar al prompt:
```
Este proyecto es SOLO frontend. No crear:
- BACKEND_INDEX.md
- ENDPOINTS.md (a menos que consuma API)

Enfocarse en:
- Componentes
- Pantallas
- Estado global
- Navegación
- Sistema de diseño
- Estilos
```

**Si es un proyecto pequeño:**
Agregar al prompt:
```
Este es un proyecto pequeño. Puedes simplificar:
- Combinar BACKEND_INDEX y FRONTEND_INDEX en un solo PROJECT_INDEX.md
- Simplificar FLUJOS.md a los flujos principales
- Mantener DESIGN_SYSTEM.md si hay UI
- Los skills son obligatorios (no simplificar)
```

---

## 📊 QUÉ OBTENDRÁS

Después de ejecutar el prompt, tendrás:

| Archivo | Contenido |
|---------|-----------|
| INDEX.md | Punto de entrada a toda la documentación |
| CEREBRO.md | Contexto completo del proyecto |
| CONTEXT.md | Resumen que se carga en cada sesión |
| BACKEND_INDEX.md | Mapa de cada módulo del backend |
| FRONTEND_INDEX.md | Mapa de cada módulo del frontend |
| IMPORTS_GUIDE.md | Cómo importar todo (con ejemplos) |
| ENDPOINTS.md | Todos los endpoints documentados |
| FLUJOS.md | Flujos de negocio paso a paso |
| DECISIONES.md | Por qué se eligió cada cosa |
| DESIGN_SYSTEM.md | Registro de todos los estilos |
| DESIGN_RULES.md | Reglas de consistencia |
| CHANGELOG.md | Historial de cambios |
| skills/doc-auto-update.md | Autoactualización |
| skills/ui-design-planning.md | Planificación UI |

---

## 🎯 EJEMPLO DE USO REAL

**Scenario:** Tienes un proyecto React + Express que quieres documentar

```bash
cd /path/to/mi-proyecto

# Abrir Qwen Code
qwen

# Pegar el prompt completo
# (el de arriba)

# Qwen Code hará:
# 1. Explorar toda la estructura
# 2. Identificar: React, Express, PostgreSQL, etc.
# 3. Mapear: componentes, rutas, modelos
# 4. Crear: todos los documentos .qwen/
# 5. Comentar: archivos críticos
# 6. Configurar: skills de autoactualización

# Resultado:
# ✅ Cerebro completo listo
# ✅ Documentación real del proyecto
# ✅ Autoactualización configurada
# ✅ Protección de diseños
```

---

> **CONSEJO:** Guarda este archivo en un lugar accesible. Lo usarás en cada proyecto nuevo.
