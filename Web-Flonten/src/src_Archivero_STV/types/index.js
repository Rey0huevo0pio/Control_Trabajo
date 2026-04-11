/**
 * Tipos para el módulo de Archivero y Gestión Documental (Web)
 * Adaptado de: C_Ticket_Apk_STV/src_Archivero_STV/types/index.ts
 */

export const ArchivoTipo = {
  IMAGEN: 'imagen',
  VIDEO: 'video',
  DOCUMENTO: 'documento',
  OTRO: 'otro',
};

export const Visibilidad = {
  PUBLICO: 'publico',
  PRIVADO: 'privado',
};

export const RolMiembro = {
  DUENO: 'dueño',
  EDITOR: 'editor',
  VISOR: 'visor',
};

export const FuenteEscaneo = {
  CAMARA: 'camara',
  GALERIA: 'galeria',
};

/**
 * ArchiveroStackParamList - Rutas del módulo Archivero
 */
export const ArchiveroRoutes = {
  ArchiveroHome: '/archivero',
  CrearArchivero: '/archivero/crear',
  ArchiveroDetalle: (archiveroId) => `/archivero/${archiveroId}`,
  CrearCarpeta: (archiveroId) => `/archivero/${archiveroId}/carpeta/nueva`,
  CarpetaDetalle: (archiveroId, carpetaId) => `/archivero/${archiveroId}/carpeta/${carpetaId}`,
  GestionarMiembros: (archiveroId) => `/archivero/${archiveroId}/miembros`,
  SubirArchivo: (archiveroId) => `/archivero/${archiveroId}/subir`,
  EscanearDocumento: (archiveroId) => `/archivero/${archiveroId}/escanear`,
  ArchivoDetalle: (archivoId) => `/archivero/archivo/${archivoId}`,
  ConfiguracionArchivero: (archiveroId) => `/archivero/${archiveroId}/config`,
  ConfiguracionCarpeta: (carpetaId) => `/archivero/carpeta/${carpetaId}/config`,
};
