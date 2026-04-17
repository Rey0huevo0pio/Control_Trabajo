/**
 * ============================================================================
 * 📝 CONSTANTES - Configuración Global de la Aplicación Web
 * ============================================================================
 * 
 * QUÉ HACE ESTE ARCHIVO:
 * - Define constantes globales de la app
 * - URL del backend API
 * - Roles y permisos (mismos que el móvil)
 * - Configuración general
 * 
 * CONEXIONES:
 * - Backend: backen_cerebro/ (API_URL apunta aquí)
 * - Mobile: C_Ticket_Apk_STV/src/constants/index.ts (mismos roles)
 * - Services: Usa API_URL para configurar Axios
 * 
 * PARA MODIFICAR:
 * - Cambiar API_URL → actualizar URL del backend
 * - Agregar constante → agregar aquí y exportar
 * 
 * ============================================================================
 */

// ============================================================================
// API CONFIGURATION
// ============================================================================
export const API_URL = import.meta.env.VITE_API_URL || 'https://guru-lit-handed-pork.trycloudflare.com/api';
export const API_TIMEOUT = 30000; // 30 segundos - necesario para IMAP

// ============================================================================
// ROLES (Mismos que el móvil)
// ============================================================================
export const ROLES = {
  VIGILANTE: 'vigilante',
  SUPERVISOR: 'supervisor',
  RH: 'rh',
  IT: 'it',
  ADMIN: 'admin',
};

// ============================================================================
// PERMISOS (Mismos que el móvil)
// ============================================================================
export const PERMISSIONS = {
  // Usuarios
  USUARIOS_VER: 'usuarios_ver',
  USUARIOS_CREAR: 'usuarios_crear',
  USUARIOS_EDITAR: 'usuarios_editar',
  USUARIOS_ELIMINAR: 'usuarios_eliminar',
  
  // Dashboard
  DASHBOARD_VER: 'dashboard_ver',
  
  // Reportes
  REPORTES_VER: 'reportes_ver',
  REPORTES_CREAR: 'reportes_crear',
  REPORTES_EXPORTAR: 'reportes_exportar',
  
  // Chat
  CHAT_VER: 'chat_ver',
  CHAT_ENVIAR: 'chat_enviar',
  CHAT_CREAR_GRUPO: 'chat_crear_grupo',
  
  // Tickets
  TICKETS_VER: 'tickets_ver',
  TICKETS_CREAR: 'tickets_crear',
  TICKETS_EDITAR: 'tickets_editar',
  TICKETS_ASIGNAR: 'tickets_asignar',
  
  // Archivero
  ARCHIVERO_VER: 'archivero_ver',
  ARCHIVERO_CREAR: 'archivero_crear',
  ARCHIVERO_SUBIR: 'archivero_subir',
  
  // Instalaciones
  INSTALACIONES_VER: 'instalaciones_ver',
  INSTALACIONES_CREAR: 'instalaciones_crear',
  INSTALACIONES_EDITAR: 'instalaciones_editar',
};

// ============================================================================
// MAPEO DE ROLES A PERMISOS (Mismo que el móvil)
// ============================================================================
const _vigilantePerms = [
  PERMISSIONS.DASHBOARD_VER,
  PERMISSIONS.CHAT_VER,
  PERMISSIONS.CHAT_ENVIAR,
  PERMISSIONS.TICKETS_VER,
  PERMISSIONS.TICKETS_CREAR,
  PERMISSIONS.ARCHIVERO_VER,
];

export const ROLE_PERMISSIONS = {
  [ROLES.VIGILANTE]: _vigilantePerms,
  [ROLES.SUPERVISOR]: [
    ..._vigilantePerms,
    PERMISSIONS.REPORTES_VER,
    PERMISSIONS.CHAT_CREAR_GRUPO,
    PERMISSIONS.TICKETS_ASIGNAR,
    PERMISSIONS.ARCHIVERO_CREAR,
    PERMISSIONS.ARCHIVERO_SUBIR,
    PERMISSIONS.INSTALACIONES_VER,
  ],
  [ROLES.RH]: [
    PERMISSIONS.USUARIOS_VER,
    PERMISSIONS.USUARIOS_CREAR,
    PERMISSIONS.USUARIOS_EDITAR,
    PERMISSIONS.DASHBOARD_VER,
    PERMISSIONS.REPORTES_VER,
    PERMISSIONS.REPORTES_EXPORTAR,
    PERMISSIONS.CHAT_VER,
    PERMISSIONS.CHAT_ENVIAR,
    PERMISSIONS.CHAT_CREAR_GRUPO,
    PERMISSIONS.TICKETS_VER,
    PERMISSIONS.TICKETS_CREAR,
    PERMISSIONS.TICKETS_EDITAR,
    PERMISSIONS.TICKETS_ASIGNAR,
    PERMISSIONS.ARCHIVERO_VER,
    PERMISSIONS.ARCHIVERO_CREAR,
    PERMISSIONS.ARCHIVERO_SUBIR,
    PERMISSIONS.INSTALACIONES_VER,
  ],
  [ROLES.IT]: Object.values(PERMISSIONS), // IT tiene todos los permisos
  [ROLES.ADMIN]: Object.values(PERMISSIONS), // Admin tiene todos los permisos
};

// ============================================================================
// CRUD PERMISSIONS
// ============================================================================
export const CRUD_PERMISSIONS = {
  create: 'create',
  read: 'read',
  update: 'update',
  delete: 'delete',
};

// ============================================================================
// RUTAS DE NAVEGACIÓN
// ============================================================================
export const ROUTES = {
  LOGIN: '/login',
  HOME: '/',
  USUARIOS: '/usuarios',
  INSTALACIONES: '/instalaciones',
  TICKETS: '/tickets',
  CHAT: '/chat',
  ARCHIVERO: '/archivero',
  REPORTES: '/reportes',
  CONFIGURACION: '/configuracion',
};
