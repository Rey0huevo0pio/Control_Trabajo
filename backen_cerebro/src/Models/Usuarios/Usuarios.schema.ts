import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UsuarioDocument = Usuario & Document;

export enum RolUsuario {
  ADMIN = 'admin',
  USUARIO = 'usuario',
  SOPORTE_IT = 'soporte_it',
}

@Schema({
  timestamps: true,
  collection: 'Usuarios',
})
export class Usuario {
  @Prop({ required: true, unique: true, trim: true })
  numero_control: string;

  @Prop({ required: true, trim: true })
  nombre: string;

  @Prop({ required: true, trim: true })
  apellido: string;

  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email: string;

  @Prop({ trim: true })
  telefono?: string;

  @Prop({ required: true })
  password: string;

  @Prop({
    type: String,
    enum: RolUsuario,
    default: RolUsuario.USUARIO,
  })
  rol: RolUsuario;

  @Prop({ type: Types.ObjectId, ref: 'Instalacion' })
  id_instalacion: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'AreaInstalacion' })
  id_area: Types.ObjectId;

  @Prop({ trim: true })
  foto_perfil: string;

  @Prop({ default: true })
  activo: boolean;
}

export const UsuarioSchema = SchemaFactory.createForClass(Usuario);

// Índices para mejorar búsquedas
UsuarioSchema.index({ numero_control: 1 });
UsuarioSchema.index({ email: 1 });
UsuarioSchema.index({ rol: 1 });
UsuarioSchema.index({ activo: 1 });
UsuarioSchema.index({ id_instalacion: 1 });
UsuarioSchema.index({ id_area: 1 });
