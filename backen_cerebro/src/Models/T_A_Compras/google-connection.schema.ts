import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type GoogleConnectionDocument = GoogleConnection & Document;

@Schema({ timestamps: true })
export class GoogleConnection {
  @Prop({ required: true, type: String })
  usuarioId: string;

  @Prop({ required: true })
  email: string;

  @Prop()
  nombre: string;

  @Prop({ required: true })
  accessToken: string;

  @Prop()
  refreshToken: string;

  @Prop()
  tokenExpiry: Date;

  @Prop({ default: true })
  activo: boolean;

  @Prop()
  ultimoAcceso: Date;

  @Prop({ type: String, default: 'compras' })
  scope: string;

  @Prop({ type: [String], default: [] })
  areasAsignadas: string[];
}

export const GoogleConnectionSchema =
  SchemaFactory.createForClass(GoogleConnection);

GoogleConnectionSchema.index({ usuarioId: 1 }, { unique: true });
