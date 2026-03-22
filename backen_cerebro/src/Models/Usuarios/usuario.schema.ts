import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { IsString } from 'class-validator';

export type UsuarioDocument = Usuario & Document;

// Definición de roles del sistema
export enum RolUsuario {
  VIGILANTE = 'vigilante',
  SUPERVISOR = 'supervisor',
  RH = 'rh',
  IT = 'it',
}

// Permisos del sistema
export enum Permiso {
  // Usuarios
  USUARIOS_VER = 'usuarios_ver',
  USUARIOS_CREAR = 'usuarios_crear',
  USUARIOS_EDITAR = 'usuarios_editar',
  USUARIOS_ELIMINAR = 'usuarios_eliminar',
  
  // Dashboard
  DASHBOARD_VER = 'dashboard_ver',
  
  // Reportes
  REPORTES_VER = 'reportes_ver',
  REPORTES_CREAR = 'reportes_crear',
  
  // Inventario
  INVENTARIO_VER = 'inventario_ver',
  INVENTARIO_CREAR = 'inventario_crear',
  INVENTARIO_EDITAR = 'inventario_editar',
  INVENTARIO_ELIMINAR = 'inventario_eliminar',
  
  // Rondines
  RONDINES_VER = 'rondines_ver',
  RONDINES_CREAR = 'rondines_crear',
  RONDINES_EDITAR = 'rondines_editar',
  RONDINES_ELIMINAR = 'rondines_eliminar',
  
  // Chat
  CHAT_VER = 'chat_ver',
  CHAT_ENVIAR = 'chat_enviar',
}

// Mapeo de roles a permisos
export const PERMISOS_POR_ROL: Record<RolUsuario, Permiso[]> = {
  [RolUsuario.VIGILANTE]: [
    Permiso.DASHBOARD_VER,
    Permiso.CHAT_VER,
    Permiso.CHAT_ENVIAR,
  ],
  [RolUsuario.SUPERVISOR]: [
    Permiso.DASHBOARD_VER,
    Permiso.REPORTES_VER,
    Permiso.RONDINES_VER,
    Permiso.CHAT_VER,
    Permiso.CHAT_ENVIAR,
  ],
  [RolUsuario.RH]: [
    Permiso.USUARIOS_VER,
    Permiso.USUARIOS_CREAR,
    Permiso.USUARIOS_EDITAR,
    Permiso.DASHBOARD_VER,
    Permiso.REPORTES_VER,
    Permiso.CHAT_VER,
    Permiso.CHAT_ENVIAR,
  ],
  [RolUsuario.IT]: [
    Permiso.USUARIOS_VER,
    Permiso.USUARIOS_CREAR,
    Permiso.USUARIOS_EDITAR,
    Permiso.USUARIOS_ELIMINAR,
    Permiso.DASHBOARD_VER,
    Permiso.REPORTES_VER,
    Permiso.REPORTES_CREAR,
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
  ],
};

@Schema({ timestamps: true })
export class Usuario {
  @Prop({ required: true, unique: true })
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
    default: RolUsuario.VIGILANTE 
  })
  rol: RolUsuario;

  @Prop({ default: true })
  activo: boolean;

  @Prop()
  telefono: string;

  @Prop()
  fechaIngreso: Date;

  @Prop({ type: [String], default: [] })
  permisos: string[];
}

export const UsuarioSchema = SchemaFactory.createForClass(Usuario);
