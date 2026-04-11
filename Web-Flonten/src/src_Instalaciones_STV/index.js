/**
 * ============================================================================
 * 🏢 MÓDULO INSTALACIONES - Gestión de Instalaciones (Web)
 * ============================================================================
 * 
 * ADAPTADO DE: C_Ticket_Apk_STV/src_Instalaciones_STV/
 * 
 * ESTRUCTURA:
 * - screens/ → 4 pantallas
 * - navigation/ → Navegación del módulo
 * - types/ → Tipos TypeScript
 * - components/ → Components específicos
 * - lib/ → API de instalaciones
 * 
 * PANTALLAS:
 * - InstalacionesHomeScreen → Lista de instalaciones
 * - DetalleInstalacionScreen → Detalle
 * - RegistroInstalacionScreen → Form crear instalación
 * - RegistroAreaScreen → Form crear área
 * 
 * API: Mismos endpoints que el backend
 * - GET /instalaciones
 * - POST /instalaciones
 * - GET /instalaciones/:id
 * - GET /instalaciones/:id/areas
 * - POST /instalaciones/:id/areas
 * 
 * ============================================================================
 */

export { InstalacionesHomeScreen } from './screens/InstalacionesHomeScreen';
export { DetalleInstalacionScreen } from './screens/DetalleInstalacionScreen';
export { RegistroInstalacionScreen } from './screens/RegistroInstalacionScreen';
export { RegistroAreaScreen } from './screens/RegistroAreaScreen';

// Re-exportar componentes
export { InstalacionCard } from './components/InstalacionCard';

// Re-exportar API
export { instalacionApi } from './lib/instalacion.api';

// Re-exportar tipos
export { InstalacionRoutes } from './types';

export default {
  name: 'Instalaciones',
  route: '/instalaciones',
  icon: '🏢',
  color: '#007AFF',
};
