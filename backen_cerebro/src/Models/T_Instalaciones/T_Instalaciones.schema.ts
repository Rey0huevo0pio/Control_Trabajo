import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type InstalacionDocument = Instalacion & Document;

@Schema({ _id: false })
export class Coordenadas {
  @Prop({ type: Number, min: -90, max: 90 })
  lat: number;

  @Prop({ type: Number, min: -180, max: 180 })
  lng: number;
}

export const CoordenadasSchema = SchemaFactory.createForClass(Coordenadas);

@Schema({ _id: false })
export class Ubicacion {
  @Prop({ required: true, trim: true })
  direccion: string;

  @Prop({ type: CoordenadasSchema })
  coordenadas?: Coordenadas;
}

export const UbicacionSchema = SchemaFactory.createForClass(Ubicacion);

@Schema({
  timestamps: true,
  collection: 'T_Instalaciones',
})
export class Instalacion {
  @Prop({ required: true, trim: true })
  nombre_instalacion: string;

  @Prop({ required: true, trim: true })
  nombre_registrador: string;

  @Prop({ type: UbicacionSchema, required: true })
  ubicacion: Ubicacion;

  @Prop({ trim: true })
  descripcion: string;

  @Prop({ trim: true })
  foto: string;

  @Prop({ required: true, trim: true })
  responsable: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Usuario' }], default: [] })
  personal_asignado: Types.ObjectId[];

  @Prop({ default: true })
  activa: boolean;

  @Prop({ type: Types.ObjectId, ref: 'Usuario', required: true })
  creado_por: Types.ObjectId;
}

export const InstalacionSchema = SchemaFactory.createForClass(Instalacion);

// Índices para mejorar búsquedas
InstalacionSchema.index({ nombre_instalacion: 1 });
InstalacionSchema.index({ activa: 1 });
InstalacionSchema.index({ responsable: 1 });
