/**
 * ============================================================================
 * 📝 TYPES - TypeScript Types & Interfaces
 * ============================================================================
 * 
 * QUÉ HACE ESTE ARCHIVO:
 * - Define tipos TypeScript para toda la app
 * - Mismos tipos que el móvil para consistencia
 * - Interfaces para API responses
 * 
 * CONEXIONES:
 * - Mobile: C_Ticket_Apk_STV/src/types/ (mismos tipos)
 * - Backend: backen_cerebro/src/Models/ (coincide con schemas)
 * 
 * ============================================================================
 */

// ============================================================================
// USER TYPES
// ============================================================================

/**
 * Roles disponibles (mismos que el backend)
 */
export const ROLES = ['vigilante', 'supervisor', 'rh', 'it', 'admin'];
export type Role = typeof ROLES[number];

/**
 * Usuario (mismo schema que backend)
 */
export interface User {
  id: string;
  Control_Usuario: string;
  nombre: string;
  apellido: string;
  rol: Role;
  activo: boolean;
  telefono?: string;
  email?: string;
  fechaIngreso?: string;
  departamento?: string;
  puesto?: string;
  avatar?: string;
  permisos?: string[];
}

/**
 * Login request
 */
export interface LoginRequest {
  Control_Usuario: string;
  password: string;
}

/**
 * Register request
 */
export interface RegisterRequest {
  Control_Usuario: string;
  password: string;
  nombre: string;
  apellido: string;
  rol?: Role;
  email?: string;
  telefono?: string;
}

/**
 * API Response genérica
 */
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
}

/**
 * Auth response
 */
export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
  };
}

// ============================================================================
// TICKET TYPES
// ============================================================================

export interface Ticket {
  id: string;
  titulo: string;
  descripcion: string;
  tipo?: string;
  categoria?: string;
  prioridad?: 'baja' | 'media' | 'alta' | 'urgente';
  estado?: string;
  asignadoA?: string;
  creadoPor?: string;
  instalacionId?: string;
  fechaCreacion: string;
  archivos?: string[];
}

export interface CreateTicketRequest {
  titulo: string;
  descripcion: string;
  tipo?: string;
  categoria?: string;
  prioridad?: string;
  asignadoA?: string;
  contacto?: {
    nombre: string;
    telefono: string;
    email: string;
  };
  instalacionId?: string;
  archivos?: string[];
}

// ============================================================================
// INSTALACION TYPES
// ============================================================================

export interface Instalacion {
  id: string;
  nombre: string;
  direccion: string;
  coordenadas?: {
    lat: number;
    lng: number;
  };
  ubicacion?: {
    ciudad: string;
    estado: string;
    pais: string;
  };
  descripcion?: string;
  activo: boolean;
  areas?: AreaInstalacion[];
}

export interface AreaInstalacion {
  id: string;
  nombre: string;
  descripcion?: string;
  piso?: string;
  coordenadas?: {
    x: number;
    y: number;
  };
}

// ============================================================================
// CHAT TYPES
// ============================================================================

export interface Chat {
  id: string;
  tipo: 'grupo' | 'privado';
  nombre?: string;
  descripcion?: string;
  miembros: string[];
  admin: string;
  mensajes: Mensaje[];
  fechaCreacion: string;
}

export interface Mensaje {
  id: string;
  remitente: string;
  texto: string;
  fecha: string;
  archivos?: string[];
}

// ============================================================================
// NAVIGATION TYPES
// ============================================================================

export interface RouteConfig {
  path: string;
  element: React.ComponentType;
  requiresAuth?: boolean;
  requiredRoles?: Role[];
  requiredPermissions?: string[];
}
