import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseUUIDPipe,
} from '@nestjs/common';
import { TicketITService } from './ticket-it.service';
import {
  CreateTicketITDto,
  UpdateTicketITDto,
  CreateEstadoTicketDto,
} from './dto/ticket-it.dto';

@Controller('tickets')
export class TicketITController {
  constructor(private readonly ticketService: TicketITService) {}

  // ==================== TICKETS ====================

  @Post()
  async createTicket(@Body() createDto: CreateTicketITDto) {
    return this.ticketService.createTicketIT(createDto);
  }

  @Get()
  async findAllTickets() {
    return this.ticketService.findAllTickets();
  }

  @Get(':id')
  async findOneTicket(@Param('id', ParseUUIDPipe) id: string) {
    return this.ticketService.findOneTicket(id);
  }

  @Put(':id')
  async updateTicket(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDto: UpdateTicketITDto,
  ) {
    return this.ticketService.updateTicket(id, updateDto);
  }

  @Delete(':id')
  async deleteTicket(@Param('id', ParseUUIDPipe) id: string) {
    await this.ticketService.deleteTicket(id);
    return { message: 'Ticket eliminado correctamente' };
  }

  // ==================== BÚSQUEDAS ESPECÍFICAS ====================

  @Get('usuario/:usuarioId')
  async findTicketsByUsuario(
    @Param('usuarioId', ParseUUIDPipe) usuarioId: string,
  ) {
    return this.ticketService.findTicketsByUsuario(usuarioId);
  }

  @Get('asignado/:asignadoId')
  async findTicketsByAsignado(
    @Param('asignadoId', ParseUUIDPipe) asignadoId: string,
  ) {
    return this.ticketService.findTicketsByAsignado(asignadoId);
  }

  @Get('estado/:estado')
  async findTicketsByEstado(@Param('estado') estado: string) {
    return this.ticketService.findTicketsByEstado(estado);
  }

  @Get('instalacion/:instalacionId')
  async findTicketsByInstalacion(
    @Param('instalacionId', ParseUUIDPipe) instalacionId: string,
  ) {
    return this.ticketService.findTicketsByInstalacion(instalacionId);
  }

  @Get('area/:areaId')
  async findTicketsByArea(@Param('areaId', ParseUUIDPipe) areaId: string) {
    return this.ticketService.findTicketsByArea(areaId);
  }

  // ==================== RESOLVER/CANCELAR TICKET ====================

  @Post(':id/resolver')
  async resolveTicket(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: { userId: string; descripcion: string; evidencia?: string[] },
  ) {
    return this.ticketService.resolveTicket(
      id,
      body.userId,
      body.descripcion,
      body.evidencia,
    );
  }

  @Post(':id/cancelar')
  async cancelTicket(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: { userId: string; descripcion: string },
  ) {
    return this.ticketService.cancelTicket(id, body.userId, body.descripcion);
  }

  // ==================== HISTORIAL DEL TICKET ====================

  @Get(':id/historial')
  async getHistorialTicket(@Param('id', ParseUUIDPipe) id: string) {
    return this.ticketService.getHistorialTicket(id);
  }

  @Post('estado')
  async createEstadoTicket(@Body() createDto: CreateEstadoTicketDto) {
    return this.ticketService.createEstadoTicket(createDto);
  }
}
