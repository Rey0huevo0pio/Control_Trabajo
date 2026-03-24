import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type EstadoTicketDocument = EstadoTicket & Document;

export enum EstadoTicketTipo {
  INICIADO = 'iniciado',
  EN_PROCESO = 'en_proceso',
  RESUELTO = 'resuelto',
  CANCELADO = 'cancelado',
  EN_ESPERA = 'en_espera',
}

@Schema({
  timestamps: true,
  collection: 'T_Estado_Ticket',
})
export class EstadoTicket {
  @Prop({ type: Types.ObjectId, ref: 'TicketIT', required: true })
  id_ticket: Types.ObjectId;

  @Prop({
    type: String,
    enum: EstadoTicketTipo,
    required: true,
  })
  estado: EstadoTicketTipo;

  @Prop({ type: Types.ObjectId, ref: 'Usuario', required: true })
  id_usuario: Types.ObjectId;

  @Prop({ required: true, trim: true })
  descripcion: string;

  @Prop({ type: [String], default: [] })
  evidencia: string[];
}

export const EstadoTicketSchema = SchemaFactory.createForClass(EstadoTicket);

// Índices para mejorar búsquedas
EstadoTicketSchema.index({ id_ticket: 1 });
EstadoTicketSchema.index({ estado: 1 });
EstadoTicketSchema.index({ id_usuario: 1 });
