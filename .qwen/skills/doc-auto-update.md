name: doc-auto-update
description: |
  Automatically detects code changes and updates project documentation in .qwen/ folder.
  Use when: after implementing any code change, before committing, or when user asks to update docs.
  This skill ensures project documentation is always up-to-date and no code change goes undocumented.

content: |
  # Skill: Auto-Actualización de Documentación

  ## Propósito
  Detectar cambios en el código y actualizar automáticamente la documentación en `.qwen/` para mantener el cerebro del proyecto siempre actualizado.

  ## Cuándo ejecutar
  - Después de implementar cualquier cambio en el código
  - Antes de hacer commit
  - Cuando el usuario pide "actualizar docs" o "sync docs"
  - Cuando se detecta código no documentado

  ## Proceso de Actualización

  ### Paso 1: Detectar cambios
  ```bash
  git status
  git diff HEAD
  git diff --staged
  git log -n 5 --oneline
  ```

  ### Paso 2: Analizar qué cambió
  Identificar:
  - ¿Se agregaron nuevos archivos? → Documentar en el índice correspondiente
  - ¿Se modificaron archivos existentes? → Actualizar documentación
  - ¿Se eliminaron archivos? → Eliminar de la documentación
  - ¿Se cambió la estructura de carpetas? → Actualizar mapas de archivos
  
  **⚠️ IMPORTANTE - ARQUITECTURA MULTI-MÓDULO:**
  El frontend tiene múltiples módulos independientes:
  - `src/` → Módulo principal (padre)
  - `src_Archivero_STV/` → Módulo archivero
  - `src_Chat_STV/` → Módulo chat
  - `src_Instalaciones_STV/` → Módulo instalaciones
  - `src_P_Ticket_IT/` → Módulo tickets IT
  
  Cuando cambies algo en CUALQUIERA de estos módulos, actualiza su sección correspondiente en FRONTEND_INDEX.md

  ### Paso 3: Actualizar documentación

  #### Si cambió el backend (`backen_cerebro/`):
  1. Leer `BACKEND_INDEX.md`
  2. Actualizar:
     - Estructura de carpetas si cambió
     - Tabla de archivos del módulo afectado
     - Endpoints si se agregaron/modificaron
     - Rutas de importación si cambiaron
  3. Si hay nuevo módulo no documentado:
     - Agregar sección completa en `BACKEND_INDEX.md`
     - Actualizar `CEREBRO.md` con el nuevo módulo
     - Agregar imports de ejemplo en `IMPORTS_GUIDE.md`

  #### Si cambió el frontend (`C_Ticket_Apk_STV/`):
  1. Leer `FRONTEND_INDEX.md`
  2. Identificar QUÉ módulo cambió:
     - `src/` → Actualizar sección "MÓDULO PRINCIPAL"
     - `src_Archivero_STV/` → Actualizar sección "MÓDULO ARCHIVERO"
     - `src_Chat_STV/` → Actualizar sección "MÓDULO CHAT"
     - `src_Instalaciones_STV/` → Actualizar sección "MÓDULO INSTALACIONES"
     - `src_P_Ticket_IT/` → Actualizar sección "MÓDULO TICKETS IT"
  3. Actualizar:
     - Estructura de carpetas si cambió
     - Tabla de screens/componentes
     - Stores si se modificaron
     - Servicios si cambiaron
     - Navegación si se agregaron rutas
  4. Si hay nueva pantalla o módulo no documentado:
     - Agregar sección completa en FRONTEND_INDEX.md
     - Actualizar tabla de módulos en CEREBRO.md
     - Agregar en CONNECTIONS de AppNavigator si es nuevo módulo
     - Agregar imports de ejemplo en IMPORTS_GUIDE.md

  #### Si cambió la arquitectura general:
  1. Leer `CEREBRO.md`
  2. Actualizar:
     - Resumen ejecutivo si cambió el scope
     - Arquitectura general si cambió estructura
     - Puntos clave para modificaciones
     - Guía rápida de navegación

  ### Paso 4: Detectar código no documentado
  Buscar:
  - Nuevos archivos sin referencia en la documentación
  - Nuevas carpetas sin documentar
  - Nuevos imports/export no mencionados
  - Endpoints nuevos no listados

  Para cada elemento no documentado:
  1. Leer el archivo
  2. Entender su función
  3. Agregar a la documentación correspondiente
  4. Agregar ejemplos de uso si aplica

  ### Paso 5: Actualizar CONTEXT.md
  Siempre actualizar `CONTEXT.md` con:
  - Nuevos módulos agregados
  - Cambios en roles/permisos
  - Cambios en URLs de endpoints
  - Reglas nuevas importantes

  ## Reglas de Documentación

  ### Qué documentar SIEMPRE:
  - ✅ Nuevos módulos (backend o frontend)
  - ✅ Nuevos endpoints
  - ✅ Nuevos schemas/modelos
  - ✅ Nuevas pantallas
  - ✅ Nuevos servicios API
  - ✅ Nuevos stores (estado global)
  - ✅ Cambios en roles/permisos
  - ✅ Nuevas rutas de navegación
  - ✅ Nuevas dependencias importantes

  ### Qué documentar SOLO si es importante:
  - ⚠️ Cambios en lógica de negocio existente
  - ⚠️ Refactorización de componentes
  - ⚠️ Cambios en validaciones
  - ⚠️ Optimizaciones de rendimiento

  ### Qué NO documentar:
  - ❌ Cambios de formato/estilo
  - ❌ Corrección de typos
  - ❌ Cambios en comentarios del código
  - ❌ Cambios en tests (a menos que sea nueva funcionalidad)

  ## Formato de Actualización

  ### Para nuevo módulo backend:
  ```markdown
  ### 🆕 [Nombre] Module
  **Ruta:** `src/Modules/[Nombre]/`
  **Propósito:** [Descripción]
  **Creado:** [Fecha]

  | Archivo | Función |
  |---------|---------|
  | `[nombre].module.ts` | Configuración del módulo |
  | `[nombre].controller.ts` | Controlador REST |
  | `[nombre].service.ts` | Lógica de negocio |

  **Endpoints que genera:**
  - `GET /api/[nombre]`
  - `POST /api/[nombre]`
  ```

  ### Para nueva pantalla frontend:
  ```markdown
  ### 🆕 [Nombre] Screen
  **Ruta:** `src/screens/P_[Nombre]/` o `src_[Modulo]/screens/`
  **Propósito:** [Descripción]
  **Creado:** [Fecha]
  **Módulo:** [Principal/Archivero/Chat/Instalaciones/Tickets]

  | Archivo | Función |
  |---------|---------|
  | `index.ts` | Export del screen |
  | `[Nombre]Screen.tsx` | Componente principal |

  **Navegación:**
  - Ruta: `'[Nombre]'`
  - Params: `{ id?: string }`
  - Navigator: [AppNavigator/ModuloNavigator]
  ```

  ## Verificación Final

  Después de actualizar:
  1. Leer todos los archivos modificados
  2. Verificar que la información sea correcta
  3. Verificar que los ejemplos de código funcionen
  4. Actualizar fecha de última actualización
  5. Confirmar que no quedó nada sin documentar

  ## Ejemplo de Uso

  ```
  Usuario: "Agregué un módulo de notificaciones"
  
  1. Ejecutar git diff para ver cambios
  2. Detectar nuevos archivos en backen_cerebro/src/Modules/Notificaciones/
  3. Leer archivos nuevos
  4. Actualizar BACKEND_INDEX.md con nueva sección
  5. Actualizar CEREBRO.md con nuevo módulo
  6. Actualizar IMPORTS_GUIDE.md con ejemplos
  7. Actualizar CONTEXT.md
  8. Confirmar al usuario: "✅ Documentación actualizada"
  ```

  ## Nota Importante

  Este skill DEBE ejecutarse automáticamente después de cualquier cambio significativo en el código. No preguntar al usuario si quiere actualizar la documentación - hacerlo directamente. La documentación siempre debe estar al día.
