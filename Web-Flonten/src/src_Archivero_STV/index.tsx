/**
 * ============================================================================
 * 📁 MÓDULO ARCHIVERO - Gestión Documental (Web)
 * ============================================================================
 * 
 * ADAPTADO DE: C_Ticket_Apk_STV/src_Archivero_STV/
 * 
 * ESTRUCTURA:
 * - screens/ → 6 pantallas (adaptadas del móvil)
 * - navigation/ → Navegación del módulo
 * - types/ → Tipos TypeScript
 * - components/ → Componentes específicos
 * 
 * PANTALLAS:
 * - ArchiveroHomeScreen → Lista de archiveros
 * - ArchiveroDetalleScreen → Detalle de archivero
 * - CarpetaDetalleScreen → Detalle de carpeta
 * - CrearArchiveroScreen → Formulario crear
 * - EscanearDocumentoScreen → Escanear
 * - GestionarMiembrosScreen → Miembros
 * 
 * ============================================================================
 */

export { ArchiveroHomeScreen } from './screens/ArchiveroHomeScreen';
export { ArchiveroDetalleScreen } from './screens/ArchiveroDetalleScreen';
export { CarpetaDetalleScreen } from './screens/CarpetaDetalleScreen';
export { CrearArchiveroScreen } from './screens/CrearArchiveroScreen';
export { EscanearDocumentoScreen } from './screens/EscanearDocumentoScreen';
export { GestionarMiembrosScreen } from './screens/GestionarMiembrosScreen';

export { ArchivoTipo, Visibilidad, RolMiembro, FuenteEscaneo, ArchiveroRoutes } from './types';

export default {
  name: 'Archivero',
  route: '/archivero',
  icon: '📁',
  color: '#34C759',
};