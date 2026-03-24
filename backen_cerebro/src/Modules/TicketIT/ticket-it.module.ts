import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TicketITController } from './ticket-it.controller';
import { TicketITService } from './ticket-it.service';
import { TicketIT, TicketITSchema } from '../../Models/T_ticket_IT_STV';
import {
  EstadoTicketHistorial,
  EstadoTicketHistorialSchema,
} from '../../Models/T_ticket_IT_STV';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TicketIT.name, schema: TicketITSchema },
      { name: EstadoTicketHistorial.name, schema: EstadoTicketHistorialSchema },
    ]),
  ],
  controllers: [TicketITController],
  providers: [TicketITService],
  exports: [TicketITService, MongooseModule],
})
export class TicketITModule {}
