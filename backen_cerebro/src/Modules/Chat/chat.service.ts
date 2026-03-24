import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ChatSTV, ChatGrupo, ChatPrivado } from '../../Models/T_Chat_STV';
import {
  CreateChatSTVDto,
  UpdateChatSTVDto,
  CreateChatGrupoDto,
  UpdateChatGrupoDto,
  CreateChatPrivadoDto,
  MensajeGrupoDto,
  MensajePrivadoDto,
} from './dto/chat.dto';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(ChatSTV.name) private chatModel: Model<ChatSTV>,
    @InjectModel(ChatGrupo.name) private chatGrupoModel: Model<ChatGrupo>,
    @InjectModel(ChatPrivado.name) private chatPrivadoModel: Model<ChatPrivado>,
  ) {}

  // ==================== CHAT GENERAL (STV) ====================

  async createMensaje(createDto: CreateChatSTVDto): Promise<ChatSTV> {
    try {
      const mensaje = new this.chatModel({
        ...createDto,
        id_usuario: new Types.ObjectId(createDto.id_usuario),
        id_grupo: createDto.id_grupo
          ? new Types.ObjectId(createDto.id_grupo)
          : undefined,
      });
      return await mensaje.save();
    } catch (error: any) {
      throw new BadRequestException(`Error al crear mensaje: ${error.message}`);
    }
  }

  async findAllMensajes(): Promise<ChatSTV[]> {
    return await this.chatModel
      .find()
      .populate('id_usuario id_grupo')
      .sort({ fecha_envio: -1 })
      .limit(100);
  }

  async findMensajesByUsuario(usuarioId: string): Promise<ChatSTV[]> {
    return await this.chatModel
      .find({ id_usuario: new Types.ObjectId(usuarioId) })
      .populate('id_grupo')
      .sort({ fecha_envio: -1 });
  }

  async findMensajesByGrupo(grupoId: string): Promise<ChatSTV[]> {
    return await this.chatModel
      .find({ id_grupo: new Types.ObjectId(grupoId) })
      .populate('id_usuario')
      .sort({ fecha_envio: -1 });
  }

  async updateMensaje(
    id: string,
    updateDto: UpdateChatSTVDto,
  ): Promise<ChatSTV> {
    const mensaje = await this.chatModel.findByIdAndUpdate(
      id,
      { ...updateDto, editado: true },
      { new: true, runValidators: true },
    );
    if (!mensaje) {
      throw new NotFoundException(`Mensaje con ID ${id} no encontrado`);
    }
    return mensaje;
  }

  async deleteMensaje(id: string): Promise<void> {
    const result = await this.chatModel.findByIdAndUpdate(
      id,
      { eliminado: true },
      { new: true },
    );
    if (!result) {
      throw new NotFoundException(`Mensaje con ID ${id} no encontrado`);
    }
  }

  // ==================== CHAT GRUPAL ====================

  async createChatGrupo(createDto: CreateChatGrupoDto): Promise<ChatGrupo> {
    try {
      const grupo = new this.chatGrupoModel({
        ...createDto,
        creador: new Types.ObjectId(createDto.creador),
        miembros: createDto.miembros.map((id) => new Types.ObjectId(id)),
      });
      return await grupo.save();
    } catch (error: any) {
      throw new BadRequestException(`Error al crear grupo: ${error.message}`);
    }
  }

  async findAllGrupos(): Promise<ChatGrupo[]> {
    return await this.chatGrupoModel
      .find()
      .populate('creador miembros')
      .sort({ fecha_creacion: -1 });
  }

  async findOneGrupo(id: string): Promise<ChatGrupo> {
    const grupo = await this.chatGrupoModel
      .findById(id)
      .populate('creador miembros');
    if (!grupo) {
      throw new NotFoundException(`Grupo con ID ${id} no encontrado`);
    }
    return grupo;
  }

  async updateGrupo(
    id: string,
    updateDto: UpdateChatGrupoDto,
  ): Promise<ChatGrupo> {
    const updateData: any = { ...updateDto };
    if (updateDto.miembros) {
      updateData.miembros = updateDto.miembros.map(
        (id) => new Types.ObjectId(id),
      );
    }

    const grupo = await this.chatGrupoModel
      .findByIdAndUpdate(id, updateData, { new: true, runValidators: true })
      .populate('creador miembros');

    if (!grupo) {
      throw new NotFoundException(`Grupo con ID ${id} no encontrado`);
    }
    return grupo;
  }

  async deleteGrupo(id: string): Promise<void> {
    const result = await this.chatGrupoModel.findByIdAndDelete(id);
    if (!result) {
      throw new NotFoundException(`Grupo con ID ${id} no encontrado`);
    }
  }

  async addMensajeGrupo(
    grupoId: string,
    mensajeDto: MensajeGrupoDto,
  ): Promise<ChatGrupo> {
    const grupo = await this.chatGrupoModel.findById(grupoId);
    if (!grupo) {
      throw new NotFoundException(`Grupo con ID ${grupoId} no encontrado`);
    }

    const nuevoMensaje = {
      id_usuario: new Types.ObjectId(mensajeDto.id_usuario),
      mensaje: mensajeDto.mensaje,
      archivos: {
        fotos: mensajeDto.archivos?.fotos || [],
        videos: mensajeDto.archivos?.videos || [],
        documentos: mensajeDto.archivos?.documentos || [],
      },
      fecha_envio: new Date(),
    };

    grupo.mensajes.push(nuevoMensaje);
    return await grupo.save();
  }

  async findGruposByUsuario(usuarioId: string): Promise<ChatGrupo[]> {
    return await this.chatGrupoModel
      .find({ miembros: new Types.ObjectId(usuarioId) })
      .populate('creador miembros');
  }

  // ==================== CHAT PRIVADO ====================

  async createChatPrivado(
    createDto: CreateChatPrivadoDto,
  ): Promise<ChatPrivado> {
    try {
      // Verificar si ya existe un chat entre estos dos usuarios
      const existingChat = await this.chatPrivadoModel.findOne({
        $or: [
          {
            usuario_a: new Types.ObjectId(createDto.usuario_a),
            usuario_b: new Types.ObjectId(createDto.usuario_b),
          },
          {
            usuario_a: new Types.ObjectId(createDto.usuario_b),
            usuario_b: new Types.ObjectId(createDto.usuario_a),
          },
        ],
      });

      if (existingChat) {
        throw new BadRequestException(
          'Ya existe un chat privado entre estos usuarios',
        );
      }

      const chatPrivado = new this.chatPrivadoModel({
        usuario_a: new Types.ObjectId(createDto.usuario_a),
        usuario_b: new Types.ObjectId(createDto.usuario_b),
        fecha_ultimo_mensaje: new Date(),
      });
      return await chatPrivado.save();
    } catch (error: any) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(
        `Error al crear chat privado: ${error.message}`,
      );
    }
  }

  async findAllChatsPrivados(): Promise<ChatPrivado[]> {
    return await this.chatPrivadoModel
      .find()
      .populate('usuario_a usuario_b')
      .sort({ fecha_ultimo_mensaje: -1 });
  }

  async findChatPrivadoEntreUsuarios(
    usuarioAId: string,
    usuarioBId: string,
  ): Promise<ChatPrivado> {
    const chat = await this.chatPrivadoModel
      .findOne({
        $or: [
          {
            usuario_a: new Types.ObjectId(usuarioAId),
            usuario_b: new Types.ObjectId(usuarioBId),
          },
          {
            usuario_a: new Types.ObjectId(usuarioBId),
            usuario_b: new Types.ObjectId(usuarioAId),
          },
        ],
      })
      .populate('usuario_a usuario_b');

    if (!chat) {
      throw new NotFoundException(
        'No existe chat privado entre estos usuarios',
      );
    }
    return chat;
  }

  async addMensajePrivado(
    chatId: string,
    mensajeDto: MensajePrivadoDto,
  ): Promise<ChatPrivado> {
    const chat = await this.chatPrivadoModel.findById(chatId);
    if (!chat) {
      throw new NotFoundException(
        `Chat privado con ID ${chatId} no encontrado`,
      );
    }

    const nuevoMensaje = {
      id_emisor: new Types.ObjectId(mensajeDto.id_emisor),
      id_receptor: new Types.ObjectId(mensajeDto.id_receptor),
      mensaje: mensajeDto.mensaje,
      archivos: {
        fotos: mensajeDto.archivos?.fotos || [],
        videos: mensajeDto.archivos?.videos || [],
        documentos: mensajeDto.archivos?.documentos || [],
      },
      fecha_envio: new Date(),
      leido: mensajeDto.leido || false,
    };

    chat.mensajes.push(nuevoMensaje);
    chat.fecha_ultimo_mensaje = new Date();
    return await chat.save();
  }

  async markMensajesLeidos(
    chatId: string,
    usuarioId: string,
  ): Promise<ChatPrivado> {
    const chat = await this.chatPrivadoModel.findById(chatId);
    if (!chat) {
      throw new NotFoundException(
        `Chat privado con ID ${chatId} no encontrado`,
      );
    }

    // Marcar como leídos todos los mensajes donde el usuario es el receptor
    chat.mensajes.forEach((mensaje) => {
      if (mensaje.id_receptor.toString() === usuarioId) {
        mensaje.leido = true;
      }
    });

    return await chat.save();
  }

  async findChatsPrivadosByUsuario(usuarioId: string): Promise<ChatPrivado[]> {
    return await this.chatPrivadoModel
      .find({
        $or: [
          { usuario_a: new Types.ObjectId(usuarioId) },
          { usuario_b: new Types.ObjectId(usuarioId) },
        ],
      })
      .populate('usuario_a usuario_b')
      .sort({ fecha_ultimo_mensaje: -1 });
  }

  async deleteChatPrivado(id: string): Promise<void> {
    const result = await this.chatPrivadoModel.findByIdAndDelete(id);
    if (!result) {
      throw new NotFoundException(`Chat privado con ID ${id} no encontrado`);
    }
  }
}
