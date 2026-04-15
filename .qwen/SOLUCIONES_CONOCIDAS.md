# 💡 SOLUCIONES CONOCIDAS - Base de Datos

> **Base de datos de soluciones técnicas reutilizables**
>
> **⚡ IMPORTANTE:** Consultar ANTES de implementar cualquier solución
> **📝 Formato:** Problema → Causa → Solución → Código ejemplo

---

## 🔍 ÍNDICE POR CATEGORÍAS

### React y Estado
- [S001](#s001---estado-no-se-actualiza-en-ui) - Estado no se actualiza en UI
- [S002](#s002---demasiados-re-renders) - Demasiados re-renders
- [S003](#s003---componente-no-se-re-renderiza-con-objetos) - Componente no se re-renderiza con objetos

### Imports y Módulos
- [S004](#s004---cannot-find-module) - Cannot find module
- [S005](#s005---imports-relativos-incorrectos) - Imports relativos incorrectos

### Estilos y Design System
- [S006](#s006---estilos-inconsistentes-entre-pantallas) - Estilos inconsistentes entre pantallas
- [S007](#s007---no-usar-design-system) - No usar Design System

### API y Servicios
- [S008](#s008---network-error-en-api) - Network Error en API
- [S009](#s009---401-unauthorized) - 401 Unauthorized
- [S010](#s010---manejo-de-errores-en-api) - Manejo de errores en API

### Navegación
- [S011](#s011---useparams-undefined) - useParams undefined
- [S012](#s012---navigate-no-funciona) - Navigate no funciona

---

## 📚 SOLUCIONES DETALLADAS

### S001 - Estado no se actualiza en UI

**Síntoma:**
```javascript
// ❌ Esto NO funciona
const [items, setItems] = useState([]);
const addItem = (item) => {
  items.push(item); // Mutación directa
  setItems(items); // Same reference, no re-render
};
```

**Causa:** Mutación directa del estado. React compara referencias, no contenido.

**Solución:**
```javascript
// ✅ Esto SÍ funciona
const [items, setItems] = useState([]);
const addItem = (item) => {
  setItems([...items, item]); // Nueva referencia con spread
};

// Para objetos:
const [form, setForm] = useState({ name: '', email: '' });
const updateField = (field, value) => {
  setForm({ ...form, [field]: value }); // Spread + computed property
};
```

**Lección:** NUNCA mutar estado directamente. SIEMPRE crear nuevas referencias.

**Tags:** `[#react]` `[#estado]` `[#mutacion]` `[#re-render]`

---

### S002 - Demasiados re-renders

**Síntoma:**
```
Error: Too many re-renders. React limits the number of renders to prevent an infinite loop.
```

**Causa:** Llamar función directamente en evento en lugar de usar callback.

**Solución:**
```javascript
// ❌ Esto causa loop infinito
<button onClick={handleClick()}>Click</button> // Se ejecuta en render

// ✅ Esto es correcto
<button onClick={handleClick}>Click</button> // Referencia a función

// ✅ O con parámetros usando arrow function
<button onClick={() => handleClick(id)}>Click</button>

// ✅ O con useCallback para memoizar
const handleClick = useCallback(() => {
  // lógica
}, [dependencias]);
```

**Lección:** NUNCA llamar funciones con `()` en eventos, pasar referencias o arrow functions.

**Tags:** `[#react]` `[#eventos]` `[#loop]` `[#performance]`

---

### S003 - Componente no se re-renderiza con objetos

**Síntoma:**
Estado cambia pero UI no se actualiza al modificar objetos anidados.

**Causa:** Modificar propiedad de objeto sin crear nuevo objeto.

**Solución:**
```javascript
// ❌ No funciona
const [user, setUser] = useState({ name: 'John', age: 30 });
user.age = 31; // Mutación directa
setUser(user); // Misma referencia

// ✅ Funciona - Spread operator
const [user, setUser] = useState({ name: 'John', age: 30 });
setUser({ ...user, age: 31 }); // Nuevo objeto

// ✅ Funciona - Para objetos anidados
const [form, setForm] = useState({ 
  user: { name: 'John' },
  settings: { theme: 'dark' }
});
setForm({
  ...form,
  user: { ...form.user, name: 'Jane' } // Spread anidado
});

// ✅ Funciona - Función updater
setUser(prev => ({ ...prev, age: 31 })); // Mejor práctica
```

**Lección:** SIEMPRE crear nuevos objetos para cada nivel de anidación.

**Tags:** `[#react]` `[#objetos]` `[#anidado]` `[#inmutabilidad]`

---

### S004 - Cannot find module

**Síntoma:**
```
Cannot find module './components/Button' or its corresponding type declarations.
```

**Causa:** Ruta relativa incorrecta, archivo no existe, o falta extensión.

**Solución:**
```javascript
// ❌ Verificar:
import Button from './components/Button'; // ¿Existe? ¿Extensión?

// ✅ Correcto con extensión
import Button from './components/Button.jsx';

// ✅ Usar barrel export (index.js)
// components/index.js: export { Button } from './Button';
import { Button } from './components';

// ✅ Verificar estructura:
// src/
//   ├── screens/
//   │   └── HomeScreen.jsx
//   └── components/
//       └── Button.jsx
// Desde HomeScreen: import Button from '../components/Button';
```

**Debugging steps:**
1. Verificar que el archivo existe en la ruta
2. Verificar extensión (.jsx, .js, .tsx)
3. Verificar mayúsculas/minúsculas (case-sensitive en algunos sistemas)
4. Verificar export default vs named export

**Lección:** SIEMPRE verificar ruta, existencia y extensión del archivo importado.

**Tags:** `[#imports]` `[#rutas]` `[#módulos]` `[#build]`

---

### S005 - Imports relativos incorrectos

**Síntoma:**
Imports que funcionan en local pero fallan en producción o viceversa.

**Causa:** Confusión entre rutas absolutas y relativas, o alias no configurados.

**Solución:**
```javascript
// ✅ Relativo (recomendado para archivos cercanos)
import Button from '../../components/Button';

// ✅ Con alias (requiere configuración en vite.config.js)
import Button from '@/components/Button';
import { api } from '@/services/api';

// Configuración de alias en vite.config.js:
// resolve: {
//   alias: {
//     '@': path.resolve(__dirname, './src'),
//   },
// }
```

**Regla:** Usar relativos para módulos del mismo paquete, alias para código base del proyecto.

**Tags:** `[#imports]` `[#alias]` `[#configuración]`

---

### S006 - Estilos inconsistentes entre pantallas

**Síntoma:**
Botones, cards, inputs se ven diferentes en cada pantalla.

**Causa:** No usar Design System, crear estilos inline o hardcodeados.

**Solución:**
```javascript
// ❌ No hacer - Estilos inline inconsistentes
<div style={{ padding: '24px', backgroundColor: '#FF9500' }}>

// ✅ Usar Design System
import { Card, Text, Button } from '@/components/design-system';

<Card variant="primary">
  <Text variant="heading3">Título</Text>
  <Button variant="primary">Acción</Button>
</Card>

// ✅ O usar tokens de Tamagui
import { useTheme } from 'tamagui';

const theme = useTheme();
<div style={{ 
  padding: theme.space.$6, 
  backgroundColor: theme.color.val 
}}>
```

**Lección:** SIEMPRE usar componentes del Design System para consistencia.

**Tags:** `[#estilos]` `[#design-system]` `[#consistencia]` `[#tamagui]`

---

### S007 - No usar Design System

**Síntoma:**
Código con estilos hardcodeados, difícil de mantener y actualizar.

**Causa:** Desconocimiento del Design System o prisa en implementación.

**Solución:**
```javascript
// ❌ Antes - Sin Design System
function MyComponent() {
  return (
    <div style={{ padding: 24, backgroundColor: '#FF9500' }}>
      <button style={{ padding: '16px 24px', backgroundColor: '#007AFF' }}>
        Click
      </button>
    </div>
  );
}

// ✅ Después - Con Design System
import { Card, Button, Text } from '@/components/design-system';

function MyComponent() {
  return (
    <Card variant="primary">
      <Text variant="heading3">Título</Text>
      <Button variant="primary" size="large">
        Click
      </Button>
    </Card>
  );
}
```

**Beneficios:**
- ✅ Consistencia visual garantizada
- ✅ Cambios globales desde un solo lugar
- ✅ Mejor mantenibilidad
- ✅ Performance optimizado

**Tags:** `[#design-system]` `[#mejores-prácticas]` `[#mantenibilidad]`

---

### S008 - Network Error en API

**Síntoma:**
```
Error: Network Error
```

**Causa:** Backend no está corriendo, URL incorrecta, o problema de CORS.

**Solución:**
```javascript
// 1. Verificar que backend está corriendo
// Terminal: cd backen_cerebro && npm run start:dev

// 2. Verificar URL en constants/index.js
export const API_URL = import.meta.env.VITE_API_URL || 'http://192.168.68.115:3000/api';

// 3. Verificar .env.local tiene VITE_API_URL configurado

// 4. Manejar error correctamente
try {
  const response = await api.get('/endpoint');
  // procesar respuesta
} catch (error) {
  if (error.message === 'Network Error') {
    console.error('Backend no disponible. Verificar que está corriendo.');
    setError('Servidor no disponible. Intente más tarde.');
  } else {
    console.error('Error:', error.response?.data || error.message);
    setError(error.response?.data?.message || 'Error desconocido');
  }
}
```

**Checklist:**
- [ ] Backend corriendo en puerto correcto
- [ ] URL correcta en variables de entorno
- [ ] CORS configurado en backend
- [ ] Red/local connectivity funcionando

**Tags:** `[#api]` `[#network]` `[#backend]` `[#cors]`

---

### S009 - 401 Unauthorized

**Síntoma:**
```
Error: Request failed with status code 401
```

**Causa:** Token JWT expirado, inválido, o no enviado.

**Solución:**
```javascript
// El interceptor en services/api.js ya maneja 401:
// api.interceptors.response.use(
//   response => response,
//   error => {
//     if (error.response?.status === 401) {
//       useAuthStore.getState().logout();
//       window.location.href = '/login';
//     }
//   }
// );

// Pero para manejo manual:
import { useAuthStore } from '@/store/authStore';

const fetchData = async () => {
  const { token, logout } = useAuthStore.getState();
  
  if (!token) {
    logout();
    return;
  }
  
  try {
    const response = await api.get('/endpoint');
    // procesar
  } catch (error) {
    if (error.response?.status === 401) {
      logout(); // Token expirado
    }
  }
};
```

**Lección:** Verificar autenticación antes de llamar endpoints protegidos.

**Tags:** `[#auth]` `[#jwt]` `[#token]` `[#401]`

---

### S010 - Manejo de errores en API

**Síntoma:**
Errores no manejados causan crashes o UX pobre.

**Causa:** No usar try/catch o no manejar estados de error.

**Solución:**
```javascript
// ✅ Patrón completo de manejo de errores
const [data, setData] = useState(null);
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);

const fetchData = async () => {
  setLoading(true);
  setError(null);
  
  try {
    const response = await api.get('/endpoint');
    setData(response.data);
  } catch (error) {
    // Error de red
    if (error.message === 'Network Error') {
      setError('Sin conexión al servidor');
    } 
    // Error de autenticación
    else if (error.response?.status === 401) {
      setError('Sesión expirada. Inicie sesión nuevamente.');
    } 
    // Error del servidor
    else if (error.response?.data?.message) {
      setError(error.response.data.message);
    } 
    // Error genérico
    else {
      setError('Error inesperado. Intente más tarde.');
    }
    console.error('API Error:', error.response?.data || error.message);
  } finally {
    setLoading(false);
  }
};

// En JSX:
if (loading) return <LoadingSpinner />;
if (error) return <ErrorMessage message={error} onRetry={fetchData} />;
if (!data) return <EmptyState />;
return <DataView data={data} />;
```

**Lección:** SIEMPRE manejar los 3 estados: loading, error, data.

**Tags:** `[#api]` `[#errores]` `[#ux]` `[#patrones]`

---

### S011 - useParams undefined

**Síntoma:**
```
TypeError: Cannot read properties of undefined (reading 'id')
```

**Causa:** Componente no está dentro de un Route que defina el parámetro.

**Solución:**
```javascript
// ❌ Componente fuera de Route con parámetro
// AppRouter.jsx:
<Route path="/detalle" element={<DetalleScreen />} /> // Sin :id

// DetalleScreen.jsx:
const { id } = useParams(); // undefined

// ✅ Route con parámetro definido
// AppRouter.jsx:
<Route path="/detalle/:id" element={<DetalleScreen />} /> // Con :id

// DetalleScreen.jsx:
const { id } = useParams(); // "123" ✅

// ✅ Con fallback
const { id } = useParams();
if (!id) {
  navigate('/lista'); // Redirigir si no hay ID
  return null;
}
```

**Lección:** Verificar que Route define TODOS los parámetros que usa useParams.

**Tags:** `[#router]` `[#params]` `[#rutas]` `[#navegación]`

---

### S012 - Navigate no funciona

**Síntoma:**
`navigate('/ruta')` no navega o da error.

**Causa:** Componente no está dentro de Router, o uso incorrecto de navigate.

**Solución:**
```javascript
// ✅ Uso correcto con useNavigate
import { useNavigate } from 'react-router-dom';

function MyComponent() {
  const navigate = useNavigate();
  
  const handleGoBack = () => {
    navigate(-1); // Ir atrás
  };
  
  const handleGoTo = () => {
    navigate('/ruta'); // Navegar a ruta
  };
  
  const handleNavigateWithState = () => {
    navigate('/detalle', { 
      state: { id: 123, from: 'lista' } // Pasar estado
    });
  };
}

// ❌ No funciona - fuera de Router
// MyComponent debe estar dentro de <BrowserRouter> o dentro de AppRouter
```

**Verificación:**
- [ ] Componente dentro de BrowserRouter
- [ ] useNavigate llamado dentro de componente funcional
- [ ] Ruta destino existe en AppRouter

**Tags:** `[#router]` `[#navegación]` `[#navigate]`

---

## 🔍 BÚSQUEDA RÁPIDA

| Si veo este error... | Ir a solución... |
|---------------------|------------------|
| Estado no cambia | [S001](#s001---estado-no-se-actualiza-en-ui) |
| Too many re-renders | [S002](#s002---demasiados-re-renders) |
| UI no se actualiza | [S003](#s003---componente-no-se-re-renderiza-con-objetos) |
| Cannot find module | [S004](#s004---cannot-find-module) |
| Import falla | [S005](#s005---imports-relativos-incorrectos) |
| Estilos diferentes | [S006](#s006---estilos-inconsistentes-entre-pantallas) |
| No usa Design System | [S007](#s007---no-usar-design-system) |
| Network Error | [S008](#s008---network-error-en-api) |
| 401 Unauthorized | [S009](#s009---401-unauthorized) |
| Errores API | [S010](#s010---manejo-de-errores-en-api) |
| useParams undefined | [S011](#s011---useparams-undefined) |
| Navigate no va | [S012](#s012---navigate-no-funciona) |

---

## 📝 CÓMO AGREGAR NUEVA SOLUCIÓN

```markdown
### S[XXX] - Título Descriptivo

**Síntoma:**
[Descripción o mensaje de error]

**Causa:**
[Explicación de la causa raíz]

**Solución:**
```javascript
// Código ejemplo
```

**Lección:**
[Qué aprender]

**Tags:** `[#tag1]` `[#tag2]` `[#tag3]`
```

---

> **Última actualización:** 2026-04-11
> **Mantener actualizado después de cada error nuevo resuelto**
> **Regla:** Si un error se repite 2 veces, documentar aquí
