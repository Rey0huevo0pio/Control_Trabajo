import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  TicketIT,
  EstadoTicketEnum,
  PrioridadTicket,
} from '../../Models/PG/ticket-it.entity';
import { EstadoTicketHistorial } from '../../Models/PG/estado-ticket-historial.entity';
import {
  CreateTicketITDto,
  UpdateTicketITDto,
  CreateEstadoTicketDto,
} from './dto/ticket-it.dto';

@Injectable()
export class TicketITService {
  constructor(
    @InjectRepository(TicketIT) private ticketRepo: Repository<TicketIT>,
    @InjectRepository(EstadoTicketHistorial)
    private historialRepo: Repository<EstadoTicketHistorial>,
  ) {}

  private calcularPrioridad(nivel: number): PrioridadTicket {
    if (nivel >= 9) return PrioridadTicket.CRITICA;
    if (nivel >= 7) return PrioridadTicket.ALTA;
    if (nivel >= 4) return PrioridadTicket.MEDIA;
    return PrioridadTicket.BAJA;
  }

  private async generarNumeroTicket(): Promise<string> {
    const year = new Date().getFullYear();
    const count = await this.ticketRepo
      .createQueryBuilder('t')
      .where('t.numero_ticket LIKE :pattern', { pattern: `TICK-${year}-%` })
      .getCount();
    return `TICK-${year}-${String(count + 1).padStart(4, '0')}`;
  }

  async createTicketIT(dto: CreateTicketITDto): Promise<TicketIT> {
    try {
      const ticket = this.ticketRepo.create({
        numero_ticket: await this.generarNumeroTicket(),
        usuario_solicitante: dto.usuario_solicitante,
        id_instalacion: dto.id_instalacion,
        id_area: dto.id_area,
        contacto_email: dto.contacto_usuario?.email ?? '',
        contacto_telefono: dto.contacto_usuario?.telefono,
        tipo: dto.tipo,
        categoria: dto.categoria,
        descripcion: dto.descripcion,
        nivel_afectacion: dto.nivel_afectacion,
        prioridad:
          dto.prioridad ?? this.calcularPrioridad(dto.nivel_afectacion),
        estado: dto.estado ?? EstadoTicketEnum.ABIERTO,
        asignado_a: dto.asignado_a,
        creado_por: dto.creado_por,
      });

      const saved = await this.ticketRepo.save(ticket);

      await this.historialRepo.save(
        this.historialRepo.create({
          id_ticket: saved.id,
          estado: 'iniciado',
          id_usuario: dto.creado_por,
          descripcion: 'Ticket creado inicialmente',
          evidencia: [],
        }),
      );

      return saved;
    } catch (e: any) {
      throw new BadRequestException(`Error al crear ticket: ${e.message}`);
    }
  }

  async findAllTickets(): Promise<TicketIT[]> {
    return this.ticketRepo.find({ order: { createdAt: 'DESC' } });
  }

  async findOneTicket(id: string): Promise<TicketIT> {
    const t = await this.ticketRepo.findOne({ where: { id } });
    if (!t) throw new NotFoundException(`Ticket ${id} no encontrado`);
    return t;
  }

  async updateTicket(id: string, dto: UpdateTicketITDto): Promise<TicketIT> {
    const ticket = await this.findOneTicket(id);

    if (dto.estado && dto.estado !== ticket.estado) {
      await this.historialRepo.save(
        this.historialRepo.create({
          id_ticket: id,
          estado: dto.estado,
          id_usuario: dto.asignado_a ?? ticket.creado_por,
          descripcion: `Estado cambiado a: ${dto.estado}`,
          evidencia: [],
        }),
      );
    }

    await this.ticketRepo.update(id, dto as any);
    return this.findOneTicket(id);
  }

  async deleteTicket(id: string): Promise<void> {
    const r = await this.ticketRepo.delete(id);
    if (!r.affected) throw new NotFoundException(`Ticket ${id} no encontrado`);
  }

  async findTicketsByUsuario(usuarioId: string): Promise<TicketIT[]> {
    return this.ticketRepo.find({
      where: { usuario_solicitante: usuarioId },
      order: { createdAt: 'DESC' },
    });
  }

  async findTicketsByAsignado(asignadoId: string): Promise<TicketIT[]> {
    return this.ticketRepo.find({
      where: { asignado_a: asignadoId },
      order: { createdAt: 'DESC' },
    });
  }

  async findTicketsByEstado(estado: string): Promise<TicketIT[]> {
    return this.ticketRepo.find({
      where: { estado: estado as EstadoTicketEnum },
      order: { createdAt: 'DESC' },
    });
  }

  async findTicketsByInstalacion(instalacionId: string): Promise<TicketIT[]> {
    return this.ticketRepo.find({
      where: { id_instalacion: instalacionId },
      order: { createdAt: 'DESC' },
    });
  }

  async findTicketsByArea(areaId: string): Promise<TicketIT[]> {
    return this.ticketRepo.find({
      where: { id_area: areaId },
      order: { createdAt: 'DESC' },
    });
  }

  async getHistorialTicket(ticketId: string): Promise<EstadoTicketHistorial[]> {
    return this.historialRepo.find({
      where: { id_ticket: ticketId },
      order: { fecha_cambio: 'ASC' },
    });
  }

  async resolveTicket(
    ticketId: string,
    userId: string,
    descripcion: string,
    evidencia?: string[],
  ): Promise<TicketIT> {
    await this.ticketRepo.update(ticketId, {
      estado: EstadoTicketEnum.RESUELTO,
      fecha_cierre: new Date(),
    });
    await this.historialRepo.save(
      this.historialRepo.create({
        id_ticket: ticketId,
        estado: 'resuelto',
        id_usuario: userId,
        descripcion,
        evidencia: evidencia ?? [],
      }),
    );
    return this.findOneTicket(ticketId);
  }

  async cancelTicket(
    ticketId: string,
    userId: string,
    descripcion: string,
  ): Promise<TicketIT> {
    await this.ticketRepo.update(ticketId, {
      estado: EstadoTicketEnum.CANCELADO,
      fecha_cierre: new Date(),
    });
    await this.historialRepo.save(
      this.historialRepo.create({
        id_ticket: ticketId,
        estado: 'cancelado',
        id_usuario: userId,
        descripcion,
        evidencia: [],
      }),
    );
    return this.findOneTicket(ticketId);
  }

  async createEstadoTicket(
    dto: CreateEstadoTicketDto,
  ): Promise<EstadoTicketHistorial> {
    return this.historialRepo.save(this.historialRepo.create(dto));
  }
}
