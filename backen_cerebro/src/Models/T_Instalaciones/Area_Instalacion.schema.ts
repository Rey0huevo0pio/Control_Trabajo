import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type AreaInstalacionDocument = AreaInstalacion & Document;

@Schema({
  timestamps: true,
  collection: 'Area_Instalacion',
})
export class AreaInstalacion {
  @Prop({ required: true, trim: true })
  nombre_area: string;

  @Prop({ trim: true })
  descripcion: string;

  @Prop({ type: Types.ObjectId, ref: 'Instalacion', required: true })
  id_instalacion: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Usuario', required: true })
  creado_por: Types.ObjectId;
}

export const AreaInstalacionSchema =
  SchemaFactory.createForClass(AreaInstalacion);

// Índices para mejorar búsquedas
AreaInstalacionSchema.index({ nombre_area: 1 });
AreaInstalacionSchema.index({ id_instalacion: 1 });
