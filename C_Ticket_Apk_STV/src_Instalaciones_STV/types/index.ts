// Tipos para Instalaciones y Áreas

export interface Instalacion {
  _id: string
  nombre_instalacion: string
  nombre_registrador: string
  ubicacion: Ubicacion
  descripcion?: string
  foto?: string
  responsable: string
  personal_asignado?: string[]
  activa: boolean
  creado_por: string
  fecha_creacion?: string
  fecha_actualizacion?: string
}

export interface Ubicacion {
  direccion: string
  coordenadas?: {
    lat: number
    lng: number
  }
}

export interface AreaInstalacion {
  _id: string
  nombre_area: string
  descripcion?: string
  id_instalacion: string | Instalacion
  creado_por: string
  fecha_creacion?: string
}

// DTOs para creación
export interface CreateInstalacionDto {
  nombre_instalacion: string
  nombre_registrador: string
  ubicacion: {
    direccion: string
    coordenadas?: {
      lat: number
      lng: number
    }
  }
  descripcion?: string
  foto?: string
  responsable: string
  personal_asignado?: string[]
  activa?: boolean
  creado_por: string
}

export interface CreateAreaInstalacionDto {
  nombre_area: string
  descripcion?: string
  id_instalacion: string
  creado_por: string
}

// Navegación
export type InstalacionStackParamList = {
  InstalacionesHome: undefined
  RegistroInstalacion: undefined
  DetalleInstalacion: { instalacionId: string }
  RegistroArea: { instalacionId: string; instalacionNombre: string }
}
