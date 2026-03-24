import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ArchivosSchema } from './T_Chat_STV.schema';

export type ChatPrivadoDocument = ChatPrivado & Document;

@Schema({ _id: false })
export class MensajePrivado {
  @Prop({ type: Types.ObjectId, ref: 'Usuario' })
  id_emisor: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Usuario' })
  id_receptor: Types.ObjectId;

  @Prop({ trim: true })
  mensaje: string;

  @Prop({ type: ArchivosSchema, default: () => ({}) })
  archivos: {
    fotos: string[];
    videos: string[];
    documentos: string[];
  };

  @Prop({ type: Date })
  fecha_envio: Date;

  @Prop({ default: false })
  leido: boolean;
}

export const MensajePrivadoSchema =
  SchemaFactory.createForClass(MensajePrivado);

@Schema({
  timestamps: true,
  collection: 'T_Chat_Privado',
})
export class ChatPrivado {
  @Prop({ type: Types.ObjectId, ref: 'Usuario', required: true })
  usuario_a: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Usuario', required: true })
  usuario_b: Types.ObjectId;

  @Prop({ type: [MensajePrivadoSchema], default: [] })
  mensajes: MensajePrivado[];

  @Prop()
  fecha_ultimo_mensaje: Date;
}

export const ChatPrivadoSchema = SchemaFactory.createForClass(ChatPrivado);

// Índices para mejorar búsquedas
ChatPrivadoSchema.index({ usuario_a: 1, usuario_b: 1 });
ChatPrivadoSchema.index({ 'mensajes.id_emisor': 1 });
ChatPrivadoSchema.index({ 'mensajes.id_receptor': 1 });
