import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ArchivosSchema } from './T_Chat_STV.schema';

export type ChatGrupoDocument = ChatGrupo & Document;

@Schema({ _id: false })
export class MensajeGrupo {
  @Prop({ type: Types.ObjectId, ref: 'Usuario' })
  id_usuario: Types.ObjectId;

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
}

export const MensajeGrupoSchema = SchemaFactory.createForClass(MensajeGrupo);

@Schema({
  timestamps: true,
  collection: 'T_Chat_Grupo',
})
export class ChatGrupo {
  @Prop({ required: true, trim: true })
  nombre_grupo: string;

  @Prop({ trim: true })
  descripcion: string;

  @Prop({ type: Types.ObjectId, ref: 'Usuario', required: true })
  creador: Types.ObjectId;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Usuario' }], required: true })
  miembros: Types.ObjectId[];

  @Prop({ trim: true })
  foto_grupo: string;

  @Prop({ type: [MensajeGrupoSchema], default: [] })
  mensajes: MensajeGrupo[];

  @Prop({ default: true })
  activo: boolean;
}

export const ChatGrupoSchema = SchemaFactory.createForClass(ChatGrupo);

// Índices para mejorar búsquedas
ChatGrupoSchema.index({ nombre_grupo: 1 });
ChatGrupoSchema.index({ creador: 1 });
ChatGrupoSchema.index({ miembros: 1 });
