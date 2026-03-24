import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  TicketIT,
  EstadoTicketHistorial,
  PrioridadTicket,
  EstadoTicketTipoEnum,
} from '../../Models';
import {
  CreateTicketITDto,
  UpdateTicketITDto,
  CreateEstadoTicketDto,
} from './dto/ticket-it.dto';

@Injectable()
export class TicketITService {
  constructor(
    @InjectModel(TicketIT.name) private ticketModel: Model<TicketIT>,
    @InjectModel(EstadoTicketHistorial.name)
    private estadoTicketModel: Model<EstadoTicketHistorial>,
  ) {}

  // ==================== CALCULAR PRIORIDAD ====================

  private calcularPrioridad(nivelAfectacion: number): PrioridadTicket {
    if (nivelAfectacion >= 9) return PrioridadTicket.CRITICA;
    if (nivelAfectacion >= 7) return PrioridadTicket.ALTA;
    if (nivelAfectacion >= 4) return PrioridadTicket.MEDIA;
    return PrioridadTicket.BAJA;
  }

  // ==================== GENERAR NÚMERO DE TICKET ====================

  private async generarNumeroTicket(): Promise<string> {
    const year = new Date().getFullYear();
    const lastTicket = await this.ticketModel
      .findOne({ numero_ticket: new RegExp(`^TICK-${year}-`) })
      .sort({ numero_ticket: -1 })
      .exec();

    let consecutiveNumber = 1;
    if (lastTicket && lastTicket.numero_ticket) {
      const lastNumber = parseInt(lastTicket.numero_ticket.split('-')[2], 10);
      consecutiveNumber = lastNumber + 1;
    }

    return `TICK-${year}-${String(consecutiveNumber).padStart(4, '0')}`;
  }

  // ==================== TICKETS ====================

  async createTicketIT(createDto: CreateTicketITDto): Promise<TicketIT> {
    try {
      const numeroTicket = await this.generarNumeroTicket();

      const prioridad =
        createDto.prioridad ||
        this.calcularPrioridad(createDto.nivel_afectacion);

      const ticket = new this.ticketModel({
        ...createDto,
        numero_ticket: numeroTicket,
        usuario_solicitante: new Types.ObjectId(createDto.usuario_solicitante),
        id_instalacion: new Types.ObjectId(createDto.id_instalacion),
        id_area: new Types.ObjectId(createDto.id_area),
        creado_por: new Types.ObjectId(createDto.creado_por),
        asignado_a: createDto.asignado_a
          ? new Types.ObjectId(createDto.asignado_a)
          : undefined,
        prioridad,
        estado: createDto.estado || EstadoTicketTipoEnum.ABIERTO,
      });

      // Crear el primer registro de estado
      await this.createEstadoTicket({
        id_ticket: ticket._id.toString(),
        estado: 'iniciado',
        id_usuario: createDto.creado_por,
        descripcion: 'Ticket creado inicialmente',
      });

      return await ticket.save();
    } catch (error: any) {
      throw new BadRequestException(`Error al crear ticket: ${error.message}`);
    }
  }

  async findAllTickets(): Promise<TicketIT[]> {
    return await this.ticketModel
      .find()
      .populate(
        'usuario_solicitante id_instalacion id_area asignado_a creado_por',
      )
      .sort({ fecha_creacion: -1 });
  }

  async findOneTicket(id: string): Promise<TicketIT> {
    const ticket = await this.ticketModel
      .findById(id)
      .populate(
        'usuario_solicitante id_instalacion id_area asignado_a creado_por',
      );

    if (!ticket) {
      throw new NotFoundException(`Ticket con ID ${id} no encontrado`);
    }
    return ticket;
  }

  async updateTicket(
    id: string,
    updateDto: UpdateTicketITDto,
  ): Promise<TicketIT> {
    try {
      const updateData: any = { ...updateDto };

      if (updateDto.asignado_a) {
        updateData.asignado_a = new Types.ObjectId(updateDto.asignado_a);
      }

      // Si cambia el estado, crear un registro en el historial
      if (updateDto.estado) {
        const ticket = await this.ticketModel.findById(id);
        if (ticket && ticket.estado !== updateDto.estado) {
          await this.createEstadoTicket({
            id_ticket: id,
            estado: updateDto.estado as string,
            id_usuario: updateDto.asignado_a || ticket.creado_por.toString(),
            descripcion: `Estado cambiado a: ${updateDto.estado}`,
          });
        }
      }

      const ticket = await this.ticketModel
        .findByIdAndUpdate(id, updateData, { new: true, runValidators: true })
        .populate(
          'usuario_solicitante id_instalacion id_area asignado_a creado_por',
        );

      if (!ticket) {
        throw new NotFoundException(`Ticket con ID ${id} no encontrado`);
      }
      return ticket;
    } catch (error: any) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(
        `Error al actualizar ticket: ${error.message}`,
      );
    }
  }

  async deleteTicket(id: string): Promise<void> {
    const result = await this.ticketModel.findByIdAndDelete(id);
    if (!result) {
      throw new NotFoundException(`Ticket con ID ${id} no encontrado`);
    }
  }

  async findTicketsByUsuario(usuarioId: string): Promise<TicketIT[]> {
    return await this.ticketModel
      .find({ usuario_solicitante: new Types.ObjectId(usuarioId) })
      .populate('id_instalacion id_area asignado_a')
      .sort({ fecha_creacion: -1 });
  }

  async findTicketsByAsignado(asignadoId: string): Promise<TicketIT[]> {
    return await this.ticketModel
      .find({ asignado_a: new Types.ObjectId(asignadoId) })
      .populate('usuario_solicitante id_instalacion id_area')
      .sort({ fecha_creacion: -1 });
  }

  async findTicketsByEstado(estado: string): Promise<TicketIT[]> {
    return await this.ticketModel
      .find({ estado })
      .populate('usuario_solicitante id_instalacion id_area asignado_a')
      .sort({ fecha_creacion: -1 });
  }

  async findTicketsByInstalacion(instalacionId: string): Promise<TicketIT[]> {
    return await this.ticketModel
      .find({ id_instalacion: new Types.ObjectId(instalacionId) })
      .populate('usuario_solicitante id_area asignado_a')
      .sort({ fecha_creacion: -1 });
  }

  async findTicketsByArea(areaId: string): Promise<TicketIT[]> {
    return await this.ticketModel
      .find({ id_area: new Types.ObjectId(areaId) })
      .populate('usuario_solicitante id_instalacion asignado_a')
      .sort({ fecha_creacion: -1 });
  }

  // ==================== ESTADO DEL TICKET (HISTORIAL) ====================

  async createEstadoTicket(
    createDto: CreateEstadoTicketDto,
  ): Promise<EstadoTicketHistorial> {
    try {
      const estadoTicket = new this.estadoTicketModel({
        ...createDto,
        id_ticket: new Types.ObjectId(createDto.id_ticket),
        id_usuario: new Types.ObjectId(createDto.id_usuario),
      });
      return await estadoTicket.save();
    } catch (error: any) {
      throw new BadRequestException(
        `Error al crear estado de ticket: ${error.message}`,
      );
    }
  }

  async getHistorialTicket(ticketId: string): Promise<EstadoTicketHistorial[]> {
    return await this.estadoTicketModel
      .find({ id_ticket: new Types.ObjectId(ticketId) })
      .populate('id_usuario')
      .sort({ fecha_cambio: 1 });
  }

  async resolveTicket(
    ticketId: string,
    userId: string,
    descripcion: string,
    evidencia?: string[],
  ): Promise<TicketIT> {
    const ticket = await this.updateTicket(ticketId, {
      estado: EstadoTicketTipoEnum.RESUELTO,
    });

    await this.createEstadoTicket({
      id_ticket: ticketId,
      estado: 'resuelto',
      id_usuario: userId,
      descripcion,
      evidencia,
    });

    await this.ticketModel.findByIdAndUpdate(ticketId, {
      fecha_cierre: new Date(),
    });

    return ticket;
  }

  async cancelTicket(
    ticketId: string,
    userId: string,
    descripcion: string,
  ): Promise<TicketIT> {
    const ticket = await this.updateTicket(ticketId, {
      estado: EstadoTicketTipoEnum.CANCELADO,
    });

    await this.createEstadoTicket({
      id_ticket: ticketId,
      estado: 'cancelado',
      id_usuario: userId,
      descripcion,
    });

    await this.ticketModel.findByIdAndUpdate(ticketId, {
      fecha_cierre: new Date(),
    });

    return ticket;
  }
}
