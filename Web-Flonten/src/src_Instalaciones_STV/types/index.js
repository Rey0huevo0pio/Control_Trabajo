/**
 * Tipos para Instalaciones y Áreas (Web)
 * Adaptado de: C_Ticket_Apk_STV/src_Instalaciones_STV/types/index.ts
 */

/**
 * InstalacionRoutes - Rutas del módulo Instalaciones
 */
export const InstalacionRoutes = {
  InstalacionesHome: '/instalaciones',
  RegistroInstalacion: '/instalaciones/nueva',
  DetalleInstalacion: (instalacionId) => `/instalaciones/${instalacionId}`,
  RegistroArea: (instalacionId) => `/instalaciones/${instalacionId}/area/nueva`,
};
