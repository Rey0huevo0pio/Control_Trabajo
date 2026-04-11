# ADR: CameraScanner — Problema de Cámara Trasera en Android/Chrome

**Fecha:** 2025  
**Estado:** Resuelto ✅  
**Archivo afectado:** `CameraScanner.jsx`  
**Dispositivo de prueba:** King Kong Power 3 (MediaTek, Android, Chrome)

---

## El Problema

La cámara trasera no se abría en la página web aunque:
- Los permisos de cámara estaban concedidos en Chrome
- En Google Lens y otras apps la cámara trasera funcionaba perfectamente
- El código pedía `facingMode: 'environment'` que es el estándar

Lo que se veía en consola:
```
❌ Requested device not found
❌ Timeout starting video source
```
O bien: la cámara abría pero mostraba **pantalla negra**.

---

## Causa Raíz (3 problemas encadenados)

### Problema 1 — `requestCameraPermission` abría la cámara trasera y la cerraba
La función de permiso pedía `facingMode: 'environment'`, obtenía el stream y lo cerraba inmediatamente. Cuando `startCamera` intentaba abrir la misma cámara milisegundos después, Android/Chrome lanzaba `NotFoundError` porque el driver de cámara MediaTek no libera el hardware tan rápido.

**Síntoma:** `Requested device not found` en el primer intento.

### Problema 2 — `deviceId: { exact }` no funciona en MediaTek
En chipsets MediaTek, `getUserMedia({ video: { deviceId: { exact: id } } })` lanza `NotFoundError` aunque el `deviceId` sea correcto. Es un bug conocido del driver de cámara de estos chips.

**Síntoma:** Todos los intentos con `exact` fallaban aunque el deviceId existiera en `enumerateDevices()`.

### Problema 3 — React Strict Mode montaba el componente DOS veces
React Strict Mode (desarrollo) monta → desmonta → monta cada componente. El lock global tenía 5000ms de expiración, así que el segundo mount (el real) quedaba bloqueado. Cuando se redujo a 1500ms, el problema cambió: ambas instancias llegaban a abrir el stream simultáneamente, y dos streams sobre la misma cámara física = **pantalla negra** en Android.

**Síntoma:** Todos los logs aparecían `2×` y la pantalla quedaba negra aunque el stream dijera `✅ Video playing`.

---

## Solución Implementada

### 1. `requestPermission` solo pide `{ video: true }`
No usa `facingMode` ni `deviceId`. Solo abre cualquier cámara para obtener el permiso del sistema y la cierra. La selección de cámara trasera ocurre después, con un delay de 200ms para que el hardware se libere.

```javascript
const s = await navigator.mediaDevices.getUserMedia({ video: true });
s.getTracks().forEach(t => t.stop());
// ← 200ms de delay antes de abrir el stream real
```

### 2. Selección de cámara por `enumerateDevices` + `deviceId: { ideal }`
En lugar de `facingMode: { exact: 'environment' }`, se enumeran los dispositivos y se selecciona la cámara trasera por su label. Se usa `ideal` (no `exact`) para que si falla, el navegador use cualquier cámara disponible en lugar de lanzar error.

```javascript
// Prioridad de selección:
// 1. Label contiene "camera 0" → trasera principal en MediaTek/Android
// 2. Label contiene back/rear/trasera/environment
// 3. Última cámara de la lista (en móvil suele ser trasera)

video: { deviceId: { ideal: backCamera.deviceId } }
//                   ↑ ideal, NO exact
```

### 3. Flag global `CAMERA_ACTIVE_GLOBALLY`
Un booleano a nivel de módulo (fuera del componente) que bloquea cualquier segunda instancia antes de que llegue a pedir el stream. Se resetea en el cleanup del `useEffect`.

```javascript
let CAMERA_ACTIVE_GLOBALLY = false;

// Al iniciar:
if (CAMERA_ACTIVE_GLOBALLY) return; // bloquea instancia duplicada
CAMERA_ACTIVE_GLOBALLY = true;

// En cleanup:
CAMERA_ACTIVE_GLOBALLY = false;
```

### 4. `requestAnimationFrame` → `setTimeout(120ms)`
rAF corre a 60fps (16ms). jsQR tarda 50-100ms en procesar un frame. Esto causaba violations de `requestAnimationFrame handler took 119ms`. Con setTimeout a 120ms el escaneo corre a ~8fps, suficiente para leer QR y sin bloquear el hilo principal.

---

## Reglas — NO hacer esto en futuras modificaciones

> ⚠️ Si modificas `CameraScanner.jsx`, lee esto primero.

| ❌ NO hacer | ✅ Por qué / Alternativa |
|---|---|
| Usar `facingMode: { exact: 'environment' }` | Lanza `NotFoundError` en MediaTek. Usar `{ ideal: 'environment' }` o selección por `deviceId` |
| Usar `deviceId: { exact: id }` | Mismo problema en MediaTek. Usar `{ ideal: id }` |
| Abrir un stream en `requestPermission` con `facingMode` | Deja la cámara ocupada. Solo usar `{ video: true }` para el permiso |
| Eliminar el flag `CAMERA_ACTIVE_GLOBALLY` | Causa pantalla negra por dos streams simultáneos en React Strict Mode |
| Cambiar `setTimeout` por `requestAnimationFrame` en el loop de escaneo | Causa violations de rendimiento. jsQR es lento, necesita al menos 100ms entre frames |
| Agregar `delay` de más de 500ms antes de `openBackCameraStream` | Hace la inicialización lenta innecesariamente. 200ms es suficiente |
| Resetear `CAMERA_ACTIVE_GLOBALLY = false` dentro de `startCamera` | Solo debe resetearse en el cleanup del `useEffect`, nunca antes |

---

## Flujo correcto de inicialización

```
useEffect (scanning=true)
    │
    ├─ CAMERA_ACTIVE_GLOBALLY? → SÍ → return (bloquea duplicado)
    │
    ├─ CAMERA_ACTIVE_GLOBALLY = true
    │
    ├─ isNativeCapacitor?
    │   ├─ SÍ → CameraPreview.start({ position: 'rear' }) → listo
    │   └─ NO ↓
    │
    ├─ requestPermission()
    │   └─ getUserMedia({ video: true }) → stop() inmediato
    │
    ├─ await 200ms  ← CRÍTICO: libera el hardware
    │
    ├─ enumerateDevices() → selectBackCamera()
    │   └─ Prioridad: "camera 0" → back/rear → última
    │
    ├─ getUserMedia({ deviceId: { ideal: id } })
    │   └─ Fallback: facingMode 'environment' → video: true
    │
    ├─ video.srcObject = stream → video.play()
    │
    └─ setIsLoading(false) → scheduleScan() activo

cleanup (unmount / scanning=false)
    ├─ CAMERA_ACTIVE_GLOBALLY = false
    ├─ clearTimeout(scanTimer)
    ├─ stream.getTracks().forEach(stop)
    ├─ video.srcObject = null
    └─ CameraPreview.stop() si nativo
```

---

## Dispositivos probados

| Dispositivo | Chip | Resultado |
|---|---|---|
| King Kong Power 3 | MediaTek | ✅ Funciona con `camera 0, facing back` |
| Chrome (navegador) | Web | ✅ Fallback web con `getUserMedia` |

> Si se prueba en otros dispositivos, agregar resultados aquí.

---

## Nota sobre CameraScanner_ZERO_DELAY.jsx

⚠️ **IMPORTANTE**: `CameraScanner_ZERO_DELAY.jsx` es una versión **OBSOLETA** que fue reemplazada por `CameraScanner.jsx` (la versión robusta).

### Problemas conocidos de ZERO_DELAY:
1. Usa `requestAnimationFrame` que causa violations de rendimiento
2. No tiene el flag `CAMERA_ACTIVE_GLOBALLY` correcto
3. La inicialización web tiene bugs con React Strict Mode
4. **Pantalla negra en modo web** por falta de asignación correcta del stream
5. El lock con timestamp no previene correctamente el doble montaje

### Decisión arquitectónica (2026-04-09):
**`ScannerQR.jsx` ahora usa `CameraScanner.jsx`** en lugar de `CameraScanner_ZERO_DELAY.jsx`:

```javascript
// ❌ ANTES (causaba pantalla negra)
import CameraScanner from './Components_ScannerQR/CameraScanner_ZERO_DELAY';

// ✅ AHORA (funciona correctamente)
import CameraScanner from './Components_ScannerQR/CameraScanner';
```

### Razón:
`CameraScanner.jsx` (versión estándar) tiene:
- ✅ Flag global `CAMERA_ACTIVE_GLOBALLY` robusto
- ✅ Loop con `setTimeout(120ms)` sin violations
- ✅ Inicialización web probada y funcionando
- ✅ Mejor manejo de cleanup
- ✅ Funciona tanto en modo nativo (Capacitor) como web (Chrome/Firefox)

### Cuándo usar cada versión:
| Versión | Cuándo usar |
|---|---|
| `CameraScanner.jsx` | **✅ USAR SIEMPRE** - Versión principal probada |
| `CameraScanner_ZERO_DELAY.jsx` | ❌ NO USAR - Obsoleta, mantiene solo como referencia |

---

## Problema: Cámara no reabre después de tomar varias fotos (RegistrationForm.jsx)

**Fecha:** 2026-04-09
**Estado:** Resuelto ✅
**Archivo afectado:** `RegistrationForm.jsx`

### El Problema

Después de tomar **más de 2 fotos** con la cámara de RegistrationForm (para evidencia), la cámara:
- No volvía a abrir
- Arrojaba error inmediatamente
- Mostraba pantalla negra o "Requested device not found"

### Causa Raíz

1. **Sin flag global**: `RegistrationForm.jsx` NO tenía `CAMERA_ACTIVE_GLOBALLY`
2. **Cleanup incompleto**: `stopCamera()` limpiaba el stream pero NO esperaba a que el hardware se liberara
3. **Race condition**: Al llamar `startCamera()` inmediatamente después de `stopCamera()`, el hardware aún estaba ocupado

### Solución Implementada

#### 1. Flag Global `CAMERA_ACTIVE_GLOBALLY`
```javascript
let CAMERA_ACTIVE_GLOBALLY = false;

// En startCamera:
if (CAMERA_ACTIVE_GLOBALLY) return; // Bloquea si ya está activa
CAMERA_ACTIVE_GLOBALLY = true;
```

#### 2. Resetear flag en TODOS los caminos de error
```javascript
if (!granted) {
  CAMERA_ACTIVE_GLOBALLY = false; // ✅ Resetear en error
  return;
}
```

#### 3. Delay de liberación en `stopCamera()`
```javascript
// Detener streams...
await new Promise(resolve => setTimeout(resolve, 300)); // 🔥 CRÍTICO
CAMERA_ACTIVE_GLOBALLY = false; // Resetear después de limpiar
```

#### 4. Resetear flag en cleanup de desmontaje
```javascript
useEffect(() => {
  return () => {
    // Limpiar CameraPreview y streams...
    CAMERA_ACTIVE_GLOBALLY = false; // ✅ Resetear al desmontar
  };
}, [cameraPreviewActive]);
```

### Resultado

✅ La cámara ahora puede reabrirse **ilimitadamente** después de tomar fotos
✅ No más errores de "Requested device not found"
✅ No más pantalla negra por hardware ocupado
✅ Cleanup completo garantizado

---

## Problema: Cámara se traba cuando usuario cierra bruscamente (Stale Lock)

**Fecha:** 2026-04-09
**Estado:** Resuelto ✅
**Archivos afectados:** `CameraScanner.jsx`, `RegistrationForm.jsx`

### El Problema

Cuando un usuario:
- Cierra la cámara bruscamente (navega fuera, cierra modal, cambia de tab)
- Minimiza el navegador mientras la cámara está activa
- Cambia a input manual sin cerrar la cámara correctamente

El flag `CAMERA_ACTIVE_GLOBALLY` quedaba **trabado en `true`** indefinidamente, causando que:
- La cámara nunca más volvía a abrir
- Se quedaba "Cargando..." infinitamente
- Solo se resolvía recargando la página completa

### Causa Raíz

**Stale Lock**: El flag global se adquiría pero **nunca se liberaba** si el componente se desmontaba sin ejecutar el cleanup del useEffect, o si el usuario navegaba fuera antes de que `stopCamera()` completara.

### Solución Implementada

#### 1. Timestamp en el Lock
```javascript
let CAMERA_ACTIVE_GLOBALLY = false;
let CAMERA_LOCK_TIMESTAMP = 0;
const LOCK_MAX_DURATION = 30000; // 30 segundos máximo
```

#### 2. Detección Automática de Stale Lock
```javascript
const canAcquireCameraLock = () => {
  const now = Date.now();
  const timeSinceLock = now - CAMERA_LOCK_TIMESTAMP;

  // Si el lock tiene más de 30 segundos, forzar liberación
  if (CAMERA_ACTIVE_GLOBALLY && timeSinceLock > LOCK_MAX_DURATION) {
    console.warn('⚠️ Stale lock detectado (>30s), forzando liberación');
    CAMERA_ACTIVE_GLOBALLY = false;
  }

  if (CAMERA_ACTIVE_GLOBALLY) {
    return false;
  }

  CAMERA_ACTIVE_GLOBALLY = true;
  CAMERA_LOCK_TIMESTAMP = now;
  return true;
};
```

#### 3. Función Helper para Liberar Lock
```javascript
const releaseCameraLock = (reason = 'Manual') => {
  console.log(`🔓 Lock liberado (${reason})`);
  CAMERA_ACTIVE_GLOBALLY = false;
  CAMERA_LOCK_TIMESTAMP = 0;
};
```

#### 4. Uso Consistente en TODOS los Puntos
- **En `startCamera()`**: Usa `canAcquireCameraLock()`
- **En `stopCamera()`**: Usa `releaseCameraLock('Stop camera')`
- **En errores**: Usa `releaseCameraLock('Error ...')`
- **En cleanup**: Usa `releaseCameraLock('Cleanup desmontaje')`

### Resultado

| Escenario | Antes | Después |
|-----------|-------|---------|
| Usuario cierra bruscamente | ❌ Lock trabado para siempre | ✅ Auto-libera después de 30s |
| Cambia a input manual | ❌ Cámara no reabre | ✅ Stale detection la libera |
| Navega fuera del componente | ❌ Requiere reload | ✅ Cleanup + stale detection |
| Múltiples intentos rápidos | ❌ Puede trabarse | ✅ Lock con timestamp protege |

### Logging Agregado

```
⚠️ Lock de cámara stale detectado en CameraScanner (>30s), forzando liberación
⏭️ Instancia duplicada bloqueada (o stale lock detectado)
🔓 Lock de cámara liberado (Stop camera)
🔓 Lock de cámara liberado (Cleanup desmontaje)
🔓 Lock de cámara liberado (Error acceso)
```

### Configuración Ajustable

```javascript
const LOCK_MAX_DURATION = 30000; // 30 segundos
```

Si necesitas más o menos tiempo, ajusta este valor:
- `15000` = 15 segundos (más agresivo)
- `60000` = 60 segundos (más permisivo)
- `30000` = 30 segundos (balance recomendado) ✅

---

## Cámaras detectadas en King Kong Power 3

```
Cámara 0: "camera 1, facing front"  ← frontal
Cámara 1: "camera 3, facing back"   ← gran angular / macro (pantalla negra si se usa)
Cámara 2: "camera 2, facing back"   ← secundaria
Cámara 3: "camera 0, facing back"   ← PRINCIPAL ✅ (la correcta)
```

La cámara principal es `"camera 0, facing back"` aunque esté en el índice 3 de la lista. Por eso la selección es por **label**, no por posición en el array.

---

## Migración a `cameraLock.js` compartido

**Fecha:** 2026-04-09
**Estado:** Completado ✅
**Archivos afectados:** `CameraScanner.jsx`, `RegistrationForm.jsx`, `cameraLock.js`

### Cambio
El flag global `CAMERA_ACTIVE_GLOBALLY` fue migrado a un módulo compartido `cameraLock.js` que centraliza el control de acceso a la cámara.

### Arquitectura
```
cameraLock.js
├── acquireCameraLock(owner)
├── waitAndAcquireCameraLock(owner, timeoutMs)
├── releaseCameraLock(owner)
├── isCameraLocked()
├── forceAcquireCameraLock(owner, onForced)
└── STALE_TIMEOUT_MS = 8000ms (auto-libera lock abandonado)
```

### Reglas
- **Siempre** usar `waitAndAcquireCameraLock()` en `startCamera`
- **Siempre** usar `releaseCameraLock()` en cleanup de `useEffect`
- **Siempre** usar `forceAcquireCameraLock()` como fallback si el wait falla
- **Siempre** liberar el lock en TODOS los caminos de error

---

## Corrección de Build: Terser → esbuild (vite.config.js)

**Fecha:** 2026-04-10
**Estado:** Completado ✅
**Archivo afectado:** `vite.config.js`

### El Problema
Al empaquetar la app para producción, el Home mostraba **pantalla en blanco** con errores:
```
Uncaught SyntaxError: Unexpected strict mode reserved word (at Home-D46855AI.js:2:134957)
Uncaught (in promise) TypeError: Failed to convert value to 'Response'
```

### Causa Raíz
**Terser** (minificador) generaba JavaScript inválido al minificar ciertos patrones de código en Home.jsx y sus dependencias. El minificador producía nombres de variables que colisionaban con palabras reservadas de strict mode (`class`, `function`, `delete`, etc.).

El segundo error (`Failed to convert value to 'Response'`) era un **error en cascada** — cuando el chunk de Home falla al parsearse, las operaciones async dentro también fallan.

### Solución
Cambiar el minificador de `terser` a `esbuild` en `vite.config.js`:

```diff
  build: {
    target: 'es2015',
-   minify: 'terser',
-   terserOptions: {
-     compress: {
-       drop_console: true,
-       drop_debugger: true,
-       pure_funcs: ['console.log', 'console.info']
-     }
-   },
+   minify: 'esbuild',
    rollupOptions: {
```

### Por qué esbuild
| Característica | Terser | esbuild |
|---|---|---|
| Velocidad | Lento | ~100x más rápido |
| Estabilidad | Bugs con patrones complejos | Muy estable |
| Strict mode | Colisiones de nombres | Sin colisiones |
| Drop console | Via config | Nativo (`esbuild.drop`) |

### Reglas — NO hacer esto

| ❌ NO hacer | ✅ Por qué / Alternativa |
|---|---|
| Volver a `minify: 'terser'` | Genera JS inválido con patrones de React complejos |
| Agregar `terserOptions` sin esbuild | esbuild ya maneja drop de console/debugger |

---

## Flash automático al tomar foto (RegistrationForm.jsx)

**Fecha:** 2026-04-10
**Estado:** Implementado ✅
**Archivo afectado:** `RegistrationForm.jsx`

### El Problema
RegistrationForm no tenía flash/linterna para iluminar lugares oscuros al tomar fotos de evidencia. El botón de linterna toggle (`toggleTorch`) causaba errores:
```
❌ Error linterna: UnknownError: setPhotoOptions failed
⚠️ [FLASH] No hay stream de cámara activo
```

### Decisión de Diseño
**NO se usa un botón de linterna toggle** (prender/apagar). En su lugar, el flash se dispara **automáticamente** al tomar la foto, como en una cámara de teléfono.

### Implementación

#### 1. `triggerCameraFlash` — Flash automático
```javascript
const triggerCameraFlash = useCallback(async () => {
  // 1. Efecto visual (pantalla blanca 200ms)
  setShowFlashEffect(true);
  setTimeout(() => setShowFlashEffect(false), 200);

  // 2. Flash físico según modo
  if (cameraPreviewActive) {
    // Nativo: CameraPreview.setFlashMode
    await CameraPreview.setFlashMode({ flashMode: 'torch' });
    await setTimeout(100);
    await CameraPreview.setFlashMode({ flashMode: 'off' });
  } else if (videoTrackRef.current) {
    // Web: track.applyConstraints con torch
    const track = videoTrackRef.current;
    if ('torch' in track.getCapabilities()) {
      await track.applyConstraints({ advanced: [{ torch: true }] });
      await setTimeout(150);
      await track.applyConstraints({ advanced: [{ torch: false }] });
    }
  }
}, [cameraPreviewActive]);
```

#### 2. Integración en `takePhoto`
El flash se ejecuta **antes** de capturar la imagen:
```javascript
const takePhoto = useCallback(async () => {
  if (cameraPreviewActive) {
    await triggerCameraFlash();    // ← Flash primero
    const result = await CameraPreview.capture({ quality: 90 });
    // ...
  } else {
    await triggerCameraFlash();    // ← Flash primero
    canvas.drawImage(video, 0, 0); // ← Captura después
    // ...
  }
}, [cameraPreviewActive, handleCameraPhoto, stopCamera, triggerCameraFlash]);
```

#### 3. Efecto visual de flash
Overlay blanco que simula el destello de un flash real:
```jsx
{showFlashEffect && (
  <div className="absolute inset-0 bg-white z-50 animate-flash"
       style={{ animation: 'flashFadeOut 0.2s ease-out' }} />
)}
```

#### 4. Guard de video track
```javascript
// Módulo (fuera del componente)
const videoTrackRef = { current: null };

// En startCamera:
const [track] = stream.getVideoTracks();
videoTrackRef.current = track;

// En stopCamera:
videoTrackRef.current = null;
```

### Estados eliminados
| Estado | Razón |
|---|---|
| `isTorchOn` | No hay toggle de linterna |
| `torchAvailable` | No se necesita indicador UI |
| `toggleTorch()` | Función eliminada |

### Flujo correcto
```
Usuario presiona "Tomar Foto"
    │
    ├─ takePhoto()
    │   │
    │   ├─ triggerCameraFlash()
    │   │   ├─ showFlashEffect = true (pantalla blanca)
    │   │   ├─ Flash físico ON (100-150ms)
    │   │   └─ Flash físico OFF + showFlashEffect = false
    │   │
    │   ├─ Capturar imagen
    │   │   ├─ Nativo: CameraPreview.capture()
    │   │   └─ Web: canvas.drawImage(video)
    │   │
    │   └─ handleCameraPhoto(dataUrl) → stopCamera()
    │
    └─ Foto guardada
```

### Console Logs
```
📸 [TAKE_PHOTO] takePhoto llamado
📸 [TAKE_PHOTO] cameraPreviewActive: true/false
📸 [TAKE_PHOTO] Activando flash...
📸 [FLASH] triggerCameraFlash llamado
📸 [FLASH] Modo nativo - CameraPreview.setFlashMode
📸 [FLASH] Flash nativo completado
📸 [TAKE_PHOTO] Capturando foto...
✅ Foto tomada con CameraPreview
```

### Reglas — NO hacer esto

| ❌ NO hacer | ✅ Por qué / Alternativa |
|---|---|
| Agregar botón de toggle de linterna | El usuario quiere flash automático al capturar, no linterna manual |
| Usar `CameraPreview.toggleTorch()` | Da error `setPhotoOptions failed`. Usar `setFlashMode({ flashMode: 'torch' })` |
| Llamar `triggerCameraFlash` sin `useCallback` | Causa error de dependencias en `takePhoto` |
| Omitir `triggerCameraFlash` del deps de `takePhoto` | React Hook exhaustive-deps falla |
| Quitar el efecto visual `showFlashEffect` | Sin feedback visual el usuario no sabe si el flash funcionó |

### Dispositivos probados

| Dispositivo | Modo | Resultado |
|---|---|---|
| Chrome (web) | getUserMedia torch | ⏳ Pendiente probar |
| King Kong Power 3 | CameraPreview nativo | ⏳ Pendiente probar |
