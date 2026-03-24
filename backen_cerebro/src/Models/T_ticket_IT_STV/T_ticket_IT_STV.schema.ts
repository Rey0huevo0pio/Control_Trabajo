import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type TicketITDocument = TicketIT & Document;

export enum TipoTicket {
  INCIDENTE = 'incidente',
  SOLICITUD = 'solicitud',
}

export enum CategoriaTicket {
  CORREO = 'correo',
  CAMARAS = 'cámaras',
  PROGRAMAS = 'programas',
  EQUIPO = 'equipo',
  RED = 'red',
  OTRO = 'otro',
}

export enum EstadoTicket {
  ABIERTO = 'abierto',
  EN_PROCESO = 'en_proceso',
  EN_ESPERA = 'en_espera',
  RESUELTO = 'resuelto',
  CANCELADO = 'cancelado',
}

export enum PrioridadTicket {
  BAJA = 'baja',
  MEDIA = 'media',
  ALTA = 'alta',
  CRITICA = 'crítica',
}

@Schema({ _id: false })
export class ContactoUsuario {
  @Prop({ required: true, lowercase: true, trim: true })
  email: string;

  @Prop({ trim: true })
  telefono?: string;
}

export const ContactoUsuarioSchema =
  SchemaFactory.createForClass(ContactoUsuario);

@Schema({
  timestamps: true,
  collection: 'T_ticket_IT_STV',
})
export class TicketIT {
  @Prop({ required: true, unique: true, trim: true })
  numero_ticket: string;

  @Prop({ type: Types.ObjectId, ref: 'Usuario', required: true })
  usuario_solicitante: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Instalacion', required: true })
  id_instalacion: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'AreaInstalacion', required: true })
  id_area: Types.ObjectId;

  @Prop({ type: ContactoUsuarioSchema, required: true })
  contacto_usuario: ContactoUsuario;

  @Prop({ type: String, enum: TipoTicket, required: true })
  tipo: TipoTicket;

  @Prop({ type: String, enum: CategoriaTicket, required: true })
  categoria: CategoriaTicket;

  @Prop({ required: true, trim: true })
  descripcion: string;

  @Prop({ required: true, min: 1, max: 10 })
  nivel_afectacion: number;

  @Prop({
    type: String,
    enum: PrioridadTicket,
    default: PrioridadTicket.MEDIA,
  })
  prioridad: PrioridadTicket;

  @Prop({
    type: String,
    enum: EstadoTicket,
    default: EstadoTicket.ABIERTO,
  })
  estado: EstadoTicket;

  @Prop({ type: Types.ObjectId, ref: 'Usuario' })
  asignado_a?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Usuario', required: true })
  creado_por: Types.ObjectId;

  @Prop()
  fecha_cierre?: Date;
}

export const TicketITSchema = SchemaFactory.createForClass(TicketIT);

// Índices para mejorar búsquedas
TicketITSchema.index({ numero_ticket: 1 });
TicketITSchema.index({ usuario_solicitante: 1 });
TicketITSchema.index({ estado: 1 });
TicketITSchema.index({ prioridad: 1 });
TicketITSchema.index({ categoria: 1 });
TicketITSchema.index({ tipo: 1 });
TicketITSchema.index({ creado_por: 1 });
TicketITSchema.index({ asignado_a: 1 });
