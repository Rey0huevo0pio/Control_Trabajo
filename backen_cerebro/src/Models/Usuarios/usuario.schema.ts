import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UsuarioDocument = Usuario & Document;

// ==========================================
// ROLES DEL SISTEMA
// ==========================================
export enum RolUsuario {
  VIGILANTE = 'vigilante',
  SUPERVISOR = 'supervisor',
  RH = 'rh',
  IT = 'it',
  ADMIN = 'admin', // Nuevo rol administrador
}

// ==========================================
// PERMISOS DEL SISTEMA (Expandidos)
// ==========================================
export enum Permiso {
  // ===== USUARIOS =====
  USUARIOS_VER = 'usuarios_ver',
  USUARIOS_CREAR = 'usuarios_crear',
  USUARIOS_EDITAR = 'usuarios_editar',
  USUARIOS_ELIMINAR = 'usuarios_eliminar',

  // ===== DASHBOARD =====
  DASHBOARD_VER = 'dashboard_ver',

  // ===== REPORTES =====
  REPORTES_VER = 'reportes_ver',
  REPORTES_CREAR = 'reportes_crear',
  REPORTES_EXPORTAR = 'reportes_exportar',

  // ===== INVENTARIO =====
  INVENTARIO_VER = 'inventario_ver',
  INVENTARIO_CREAR = 'inventario_crear',
  INVENTARIO_EDITAR = 'inventario_editar',
  INVENTARIO_ELIMINAR = 'inventario_eliminar',

  // ===== RONDINES =====
  RONDINES_VER = 'rondines_ver',
  RONDINES_CREAR = 'rondines_crear',
  RONDINES_EDITAR = 'rondines_editar',
  RONDINES_ELIMINAR = 'rondines_eliminar',

  // ===== CHAT (Nuevos) =====
  CHAT_VER = 'chat_ver',
  CHAT_ENVIAR = 'chat_enviar',
  CHAT_CREAR_GRUPO = 'chat_crear_grupo',
  CHAT_ELIMINAR_MSG = 'chat_eliminar_msg',
  CHAT_ADMIN = 'chat_admin',

  // ===== TICKETS (Nuevos) =====
  TICKETS_VER = 'tickets_ver',
  TICKETS_CREAR = 'tickets_crear',
  TICKETS_EDITAR = 'tickets_editar',
  TICKETS_ELIMINAR = 'tickets_eliminar',
  TICKETS_ASIGNAR = 'tickets_asignar',
  TICKETS_ADMIN = 'tickets_admin',

  // ===== ARCHIVERO/DOCUMENTOS (Nuevos) =====
  ARCHIVERO_VER = 'archivero_ver',
  ARCHIVERO_CREAR = 'archivero_crear',
  ARCHIVERO_SUBIR = 'archivero_subir',
  ARCHIVERO_ELIMINAR = 'archivero_eliminar',
  ARCHIVERO_COMPARTIR = 'archivero_compartir',
  ARCHIVERO_ADMIN = 'archivero_admin',

  // ===== INSTALACIONES =====
  INSTALACIONES_VER = 'instalaciones_ver',
  INSTALACIONES_CREAR = 'instalaciones_crear',
  INSTALACIONES_EDITAR = 'instalaciones_editar',
  INSTALACIONES_ELIMINAR = 'instalaciones_eliminar',

  // ===== NOTICIAS =====
  NOTICIAS_VER = 'noticias_ver',
  NOTICIAS_CREAR = 'noticias_crear',
  NOTICIAS_EDITAR = 'noticias_editar',
  NOTICIAS_ELIMINAR = 'noticias_eliminar',
}

// ==========================================
// MAPEO DE ROLES A PERMISOS (Expandido)
// ==========================================
export const PERMISOS_POR_ROL: Record<RolUsuario, Permiso[]> = {
  [RolUsuario.VIGILANTE]: [
    Permiso.DASHBOARD_VER,
    Permiso.CHAT_VER,
    Permiso.CHAT_ENVIAR,
    Permiso.TICKETS_VER,
    Permiso.TICKETS_CREAR,
    Permiso.ARCHIVERO_VER,
  ],
  [RolUsuario.SUPERVISOR]: [
    Permiso.DASHBOARD_VER,
    Permiso.REPORTES_VER,
    Permiso.RONDINES_VER,
    Permiso.CHAT_VER,
    Permiso.CHAT_ENVIAR,
    Permiso.CHAT_CREAR_GRUPO,
    Permiso.TICKETS_VER,
    Permiso.TICKETS_CREAR,
    Permiso.TICKETS_ASIGNAR,
    Permiso.ARCHIVERO_VER,
    Permiso.ARCHIVERO_CREAR,
    Permiso.ARCHIVERO_SUBIR,
    Permiso.INSTALACIONES_VER,
    Permiso.NOTICIAS_VER,
  ],
  [RolUsuario.RH]: [
    Permiso.USUARIOS_VER,
    Permiso.USUARIOS_CREAR,
    Permiso.USUARIOS_EDITAR,
    Permiso.DASHBOARD_VER,
    Permiso.REPORTES_VER,
    Permiso.REPORTES_EXPORTAR,
    Permiso.CHAT_VER,
    Permiso.CHAT_ENVIAR,
    Permiso.CHAT_CREAR_GRUPO,
    Permiso.CHAT_ADMIN,
    Permiso.TICKETS_VER,
    Permiso.TICKETS_CREAR,
    Permiso.TICKETS_EDITAR,
    Permiso.TICKETS_ASIGNAR,
    Permiso.ARCHIVERO_VER,
    Permiso.ARCHIVERO_CREAR,
    Permiso.ARCHIVERO_SUBIR,
    Permiso.ARCHIVERO_COMPARTIR,
    Permiso.INSTALACIONES_VER,
    Permiso.NOTICIAS_VER,
    Permiso.NOTICIAS_CREAR,
    Permiso.NOTICIAS_EDITAR,
  ],
  [RolUsuario.IT]: [
    Permiso.USUARIOS_VER,
    Permiso.USUARIOS_CREAR,
    Permiso.USUARIOS_EDITAR,
    Permiso.USUARIOS_ELIMINAR,
    Permiso.DASHBOARD_VER,
    Permiso.REPORTES_VER,
    Permiso.REPORTES_CREAR,
    Permiso.REPORTES_EXPORTAR,
    Permiso.INVENTARIO_VER,
    Permiso.INVENTARIO_CREAR,
    Permiso.INVENTARIO_EDITAR,
    Permiso.INVENTARIO_ELIMINAR,
    Permiso.RONDINES_VER,
    Permiso.RONDINES_CREAR,
    Permiso.RONDINES_EDITAR,
    Permiso.RONDINES_ELIMINAR,
    Permiso.CHAT_VER,
    Permiso.CHAT_ENVIAR,
    Permiso.CHAT_CREAR_GRUPO,
    Permiso.CHAT_ELIMINAR_MSG,
    Permiso.CHAT_ADMIN,
    Permiso.TICKETS_VER,
    Permiso.TICKETS_CREAR,
    Permiso.TICKETS_EDITAR,
    Permiso.TICKETS_ELIMINAR,
    Permiso.TICKETS_ASIGNAR,
    Permiso.TICKETS_ADMIN,
    Permiso.ARCHIVERO_VER,
    Permiso.ARCHIVERO_CREAR,
    Permiso.ARCHIVERO_SUBIR,
    Permiso.ARCHIVERO_ELIMINAR,
    Permiso.ARCHIVERO_COMPARTIR,
    Permiso.ARCHIVERO_ADMIN,
    Permiso.INSTALACIONES_VER,
    Permiso.INSTALACIONES_CREAR,
    Permiso.INSTALACIONES_EDITAR,
    Permiso.INSTALACIONES_ELIMINAR,
    Permiso.NOTICIAS_VER,
    Permiso.NOTICIAS_CREAR,
    Permiso.NOTICIAS_EDITAR,
    Permiso.NOTICIAS_ELIMINAR,
  ],
  [RolUsuario.ADMIN]: Object.values(Permiso), // Admin tiene todos los permisos
};

// ==========================================
// SCHEMA DE USUARIO (Mejorado)
// ==========================================
@Schema({ timestamps: true })
export class Usuario {
  @Prop({ required: true, unique: true, uppercase: true })
  Control_Usuario: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  nombre: string;

  @Prop({ required: true })
  apellido: string;

  @Prop({
    type: String,
    enum: RolUsuario,
    default: RolUsuario.VIGILANTE,
  })
  rol: RolUsuario;

  @Prop({ default: true })
  activo: boolean;

  @Prop()
  telefono: string;

  @Prop()
  email: string;

  @Prop()
  fechaIngreso: Date;

  @Prop()
  ultimoAcceso: Date;

  @Prop({ default: false })
  primerLogin: boolean;

  @Prop({ type: [String], default: [] })
  permisos: string[];

  @Prop({ type: String, default: null })
  avatar: string;

  @Prop({ type: String, default: null })
  departamento: string;

  @Prop({ type: String, default: null })
  puesto: string;
}

export const UsuarioSchema = SchemaFactory.createForClass(Usuario);

// Índice compuesto para búsquedas
UsuarioSchema.index({ nombre: 1, apellido: 1 });
UsuarioSchema.index({ Control_Usuario: 1 }, { unique: true });
