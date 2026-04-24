import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TicketITController } from './ticket-it.controller';
import { TicketITService } from './ticket-it.service';
import { TicketIT } from '../../Models/PG/ticket-it.entity';
import { EstadoTicketHistorial } from '../../Models/PG/estado-ticket-historial.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TicketIT, EstadoTicketHistorial])],
  controllers: [TicketITController],
  providers: [TicketITService],
  exports: [TicketITService],
})
export class TicketITModule {}
