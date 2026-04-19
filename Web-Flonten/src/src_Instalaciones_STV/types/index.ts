/**
 * Tipos para Instalaciones y Áreas (Web)
 * Adaptado de: C_Ticket_Apk_STV/src_Instalaciones_STV/types/index.ts
 */

export const InstalacionRoutes = {
  InstalacionesHome: '/instalaciones',
  RegistroInstalacion: '/instalaciones/nueva',
  DetalleInstalacion: (instalacionId: string) => `/instalaciones/${instalacionId}`,
  RegistroArea: (instalacionId: string) => `/instalaciones/${instalacionId}/area/nueva`,
};

export type InstalacionRouteKey = keyof typeof InstalacionRoutes;