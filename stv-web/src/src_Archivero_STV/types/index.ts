/**
 * Tipos para el módulo de Archivero y Gestión Documental (Web)
 * Adaptado de: C_Ticket_Apk_STV/src_Archivero_STV/types/index.ts
 */

export const ArchivoTipo = {
  IMAGEN: 'imagen',
  VIDEO: 'video',
  DOCUMENTO: 'documento',
  OTRO: 'otro',
} as const;

export type ArchivoTipoValue = typeof ArchivoTipo[keyof typeof ArchivoTipo];

export const Visibilidad = {
  PUBLICO: 'publico',
  PRIVADO: 'privado',
} as const;

export type VisibilidadValue = typeof Visibilidad[keyof typeof Visibilidad];

export const RolMiembro = {
  DUENO: 'dueño',
  EDITOR: 'editor',
  VISOR: 'visor',
} as const;

export type RolMiembroValue = typeof RolMiembro[keyof typeof RolMiembro];

export const FuenteEscaneo = {
  CAMARA: 'camara',
  GALERIA: 'galeria',
} as const;

export type FuenteEscaneoValue = typeof FuenteEscaneo[keyof typeof FuenteEscaneo];

export const ArchiveroRoutes = {
  ArchiveroHome: '/archivero',
  CrearArchivero: '/archivero/crear',
  ArchiveroDetalle: (archiveroId: string) => `/archivero/${archiveroId}`,
  CrearCarpeta: (archiveroId: string) => `/archivero/${archiveroId}/carpeta/nueva`,
  CarpetaDetalle: (archiveroId: string, carpetaId: string) => `/archivero/${archiveroId}/carpeta/${carpetaId}`,
  GestionarMiembros: (archiveroId: string) => `/archivero/${archiveroId}/miembros`,
  SubirArchivo: (archiveroId: string) => `/archivero/${archiveroId}/subir`,
  EscanearDocumento: (archiveroId: string) => `/archivero/${archiveroId}/escanear`,
  ArchivoDetalle: (archivoId: string) => `/archivero/archivo/${archivoId}`,
  ConfiguracionArchivero: (archiveroId: string) => `/archivero/${archiveroId}/config`,
  ConfiguracionCarpeta: (carpetaId: string) => `/archivero/carpeta/${carpetaId}/config`,
};

export type ArchiveroRouteKey = keyof typeof ArchiveroRoutes;