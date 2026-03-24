import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ChatSTVDocument = ChatSTV & Document;

@Schema({ _id: false })
export class Archivos {
  @Prop({ type: [String], default: [] })
  fotos: string[];

  @Prop({ type: [String], default: [] })
  videos: string[];

  @Prop({ type: [String], default: [] })
  documentos: string[];
}

export const ArchivosSchema = SchemaFactory.createForClass(Archivos);

@Schema({
  timestamps: true,
  collection: 'T_Chat_STV',
})
export class ChatSTV {
  @Prop({ type: Types.ObjectId, ref: 'Usuario', required: true })
  id_usuario: Types.ObjectId;

  @Prop({ required: true, trim: true })
  numero_control: string;

  @Prop({ required: true, trim: true })
  mensaje: string;

  @Prop({ type: ArchivosSchema, default: () => ({}) })
  archivos: Archivos;

  @Prop({ type: Types.ObjectId, ref: 'ChatGrupo' })
  id_grupo?: Types.ObjectId;

  @Prop({ default: false })
  es_privado: boolean;

  @Prop({ default: false })
  editado: boolean;

  @Prop({ default: false })
  eliminado: boolean;
}

export const ChatSTVSchema = SchemaFactory.createForClass(ChatSTV);

// Índices para mejorar búsquedas
ChatSTVSchema.index({ id_usuario: 1 });
ChatSTVSchema.index({ numero_control: 1 });
ChatSTVSchema.index({ id_grupo: 1 });
ChatSTVSchema.index({ es_privado: 1 });
