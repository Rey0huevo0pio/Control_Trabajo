import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('estado_ticket_historial')
export class EstadoTicketHistorial {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  id_ticket: string;

  @Column()
  estado: string;

  @Column()
  id_usuario: string;

  @Column('text')
  descripcion: string;

  @Column('text', { array: true, default: [] })
  evidencia: string[];

  @CreateDateColumn()
  fecha_cambio: Date;
}
