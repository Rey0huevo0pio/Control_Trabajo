// Tipos para el módulo de Archivero y Gestión Documental

export type ArchivoTipo = 'imagen' | 'video' | 'documento' | 'otro'
export type Visibilidad = 'publico' | 'privado'
export type RolMiembro = 'dueño' | 'editor' | 'visor'
export type FuenteEscaneo = 'camara' | 'galeria'

export interface Usuario {
  _id: string
  Control_Usuario: string
  nombre: string
  apellido: string
  avatar?: string
  rol: string
}

export interface Archivero {
  _id: string
  nombre: string
  descripcion?: string
  imagen_portada?: string
  creador: string | Usuario
  visibilidad: Visibilidad
  miembros: MiembroArchivero[]
  carpetas: Carpeta[]
  archivos: Archivo[]
  fecha_creacion: string
  fecha_actualizacion?: string
  totalArchivos: number
  totalCarpetas: number
  espacioUsado: number
}

export interface MiembroArchivero {
  _id: string
  usuario: string | Usuario
  rol: RolMiembro
  fecha_agregado: string
  agregado_por: string | Usuario
}

export interface Carpeta {
  _id: string
  nombre: string
  descripcion?: string
  creador: string | Usuario
  archiveroId: string
  carpetaPadreId?: string
  visibilidad: Visibilidad
  archivos: Archivo[]
  subcarpetas: string[]
  fecha_creacion: string
  fecha_actualizacion?: string
  totalArchivos: number
}

export interface Archivo {
  _id: string
  nombre: string
  descripcion?: string
  tipo: ArchivoTipo
  url: string
  thumbnail?: string
  tamaño: number
  mimeType: string
  archiveroId: string
  carpetaId?: string
  subido_por: string | Usuario
  visibilidad: Visibilidad
  etiquetas?: string[]
  fecha_subida: string
  fecha_actualizacion?: string
  descargas: number
  vistas: number
}

export interface CreateArchiveroDto {
  nombre: string
  descripcion?: string
  imagen_portada?: string
  visibilidad: Visibilidad
}

export interface CreateCarpetaDto {
  nombre: string
  descripcion?: string
  carpetaPadreId?: string
  visibilidad: Visibilidad
}

export interface SubirArchivoDto {
  nombre: string
  descripcion?: string
  tipo: ArchivoTipo
  archivo: File | Blob
  carpetaId?: string
  visibilidad: Visibilidad
  etiquetas?: string[]
}

export interface AgregarMiembroDto {
  usuarioId: string
  rol: RolMiembro
}

export interface ArchiveroFilter {
  search?: string
  visibilidad?: Visibilidad
  creador?: string
}

export type ArchiveroStackParamList = {
  ArchiveroHome: undefined
  CrearArchivero: undefined
  ArchiveroDetalle: { archiveroId: string }
  CrearCarpeta: { archiveroId: string; carpetaPadreId?: string }
  CarpetaDetalle: { carpetaId: string; archiveroId: string }
  GestionarMiembros: { archiveroId: string }
  SubirArchivo: { archiveroId: string; carpetaId?: string }
  EscanearDocumento: { archiveroId: string; carpetaId?: string }
  ArchivoDetalle: { archivoId: string }
  ArchivoPreview: { archivoUrl: string; tipo: ArchivoTipo }
  ConfiguracionArchivero: { archiveroId: string }
  ConfiguracionCarpeta: { carpetaId: string }
}
