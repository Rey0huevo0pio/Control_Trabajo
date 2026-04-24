import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatGrupo } from '../../Models/T_Chat_PG/chat-grupo.entity';
import { MensajeGrupo } from '../../Models/T_Chat_PG/mensaje-grupo.entity';
import { MensajePrivado } from '../../Models/T_Chat_PG/mensaje-privado.entity';
import { RedisPublisherService } from '../Redis/redis-publisher.service';
import {
  CreateChatGrupoDto,
  UpdateChatGrupoDto,
  MensajeGrupoDto,
  CreateChatPrivadoDto,
  MensajePrivadoDto,
} from './dto/chat.dto';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(ChatGrupo) private grupoRepo: Repository<ChatGrupo>,
    @InjectRepository(MensajeGrupo) private mensajeGrupoRepo: Repository<MensajeGrupo>,
    @InjectRepository(MensajePrivado) private mensajePrivadoRepo: Repository<MensajePrivado>,
    private redis: RedisPublisherService,
  ) {}

  // ==================== GRUPOS ====================

  async createGrupo(dto: CreateChatGrupoDto): Promise<ChatGrupo> {
    const grupo = this.grupoRepo.create({ ...dto, creador_id: dto.creador });
    return this.grupoRepo.save(grupo);
  }

  async findAllGrupos(): Promise<ChatGrupo[]> {
    return this.grupoRepo.find({ order: { created_at: 'DESC' } });
  }

  async findOneGrupo(id: string): Promise<ChatGrupo> {
    const grupo = await this.grupoRepo.findOne({ where: { id }, relations: ['mensajes'] });
    if (!grupo) throw new NotFoundException(`Grupo ${id} no encontrado`);
    return grupo;
  }

  async findGruposByUsuario(usuarioId: string): Promise<ChatGrupo[]> {
    return this.grupoRepo
      .createQueryBuilder('g')
      .where(':uid = ANY(g.miembros)', { uid: usuarioId })
      .getMany();
  }

  async updateGrupo(id: string, dto: UpdateChatGrupoDto): Promise<ChatGrupo> {
    await this.grupoRepo.update(id, dto);
    return this.findOneGrupo(id);
  }

  async deleteGrupo(id: string): Promise<void> {
    const result = await this.grupoRepo.delete(id);
    if (!result.affected) throw new NotFoundException(`Grupo ${id} no encontrado`);
  }

  // ==================== MENSAJES GRUPO ====================

  async addMensajeGrupo(grupoId: string, dto: MensajeGrupoDto): Promise<MensajeGrupo> {
    const grupo = await this.grupoRepo.findOne({ where: { id: grupoId } });
    if (!grupo) throw new NotFoundException(`Grupo ${grupoId} no encontrado`);

    const mensaje = this.mensajeGrupoRepo.create({
      grupo_id: grupoId,
      id_usuario: dto.id_usuario,
      numero_control: dto.numero_control ?? '',
      mensaje: dto.mensaje,
      archivos: dto.archivos ?? { fotos: [], videos: [], documentos: [] },
    });

    const saved = await this.mensajeGrupoRepo.save(mensaje);

    // Publicar a Redis → Phoenix lo recibe y hace broadcast WebSocket
    await this.redis.publish('chat:grupo', {
      tipo: 'nuevo_mensaje',
      grupo_id: grupoId,
      mensaje: saved,
    });

    return saved;
  }

  async getMensajesGrupo(grupoId: string): Promise<MensajeGrupo[]> {
    return this.mensajeGrupoRepo.find({
      where: { grupo_id: grupoId, eliminado: false },
      order: { fecha_envio: 'ASC' },
    });
  }

  // ==================== MENSAJES PRIVADOS ====================

  async createChatPrivado(dto: CreateChatPrivadoDto): Promise<{ ok: boolean }> {
    const existe = await this.mensajePrivadoRepo.findOne({
      where: [
        { id_emisor: dto.usuario_a, id_receptor: dto.usuario_b },
        { id_emisor: dto.usuario_b, id_receptor: dto.usuario_a },
      ],
    });
    if (existe) throw new BadRequestException('Ya existe chat entre estos usuarios');
    return { ok: true };
  }

  async addMensajePrivado(dto: MensajePrivadoDto): Promise<MensajePrivado> {
    const mensaje = this.mensajePrivadoRepo.create({
      id_emisor: dto.id_emisor,
      id_receptor: dto.id_receptor,
      mensaje: dto.mensaje,
      archivos: dto.archivos ?? { fotos: [], videos: [], documentos: [] },
    });

    const saved = await this.mensajePrivadoRepo.save(mensaje);

    // Publicar a Redis → Phoenix hace broadcast al receptor
    await this.redis.publish('chat:privado', {
      tipo: 'nuevo_mensaje',
      receptor_id: dto.id_receptor,
      mensaje: saved,
    });

    return saved;
  }

  async getMensajesPrivados(emisorId: string, receptorId: string): Promise<MensajePrivado[]> {
    return this.mensajePrivadoRepo
      .createQueryBuilder('m')
      .where(
        '(m.id_emisor = :a AND m.id_receptor = :b) OR (m.id_emisor = :b AND m.id_receptor = :a)',
        { a: emisorId, b: receptorId },
      )
      .andWhere('m.eliminado = false')
      .orderBy('m.fecha_envio', 'ASC')
      .getMany();
  }

  async markLeidos(emisorId: string, receptorId: string): Promise<void> {
    await this.mensajePrivadoRepo
      .createQueryBuilder()
      .update()
      .set({ leido: true })
      .where('id_emisor = :emisorId AND id_receptor = :receptorId', { emisorId, receptorId })
      .execute();
  }
}
