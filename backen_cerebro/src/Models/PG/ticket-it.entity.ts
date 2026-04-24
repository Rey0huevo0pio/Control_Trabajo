import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum TipoTicket {
  INCIDENTE = 'incidente',
  SOLICITUD = 'solicitud',
}

export enum CategoriaTicket {
  CORREO = 'correo',
  CAMARAS = 'camaras',
  PROGRAMAS = 'programas',
  EQUIPO = 'equipo',
  RED = 'red',
  OTRO = 'otro',
}

export enum EstadoTicketEnum {
  ABIERTO = 'abierto',
  EN_PROCESO = 'en_proceso',
  EN_ESPERA = 'en_espera',
  RESUELTO = 'resuelto',
  CANCELADO = 'cancelado',
}

export enum PrioridadTicket {
  BAJA = 'baja',
  MEDIA = 'media',
  ALTA = 'alta',
  CRITICA = 'critica',
}

@Entity('tickets_it')
export class TicketIT {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  numero_ticket: string;

  @Column()
  usuario_solicitante: string;

  @Column()
  id_instalacion: string;

  @Column()
  id_area: string;

  @Column()
  contacto_email: string;

  @Column({ nullable: true })
  contacto_telefono: string;

  @Column({ type: 'enum', enum: TipoTicket })
  tipo: TipoTicket;

  @Column({ type: 'enum', enum: CategoriaTicket })
  categoria: CategoriaTicket;

  @Column('text')
  descripcion: string;

  @Column()
  nivel_afectacion: number;

  @Column({
    type: 'enum',
    enum: PrioridadTicket,
    default: PrioridadTicket.MEDIA,
  })
  prioridad: PrioridadTicket;

  @Column({
    type: 'enum',
    enum: EstadoTicketEnum,
    default: EstadoTicketEnum.ABIERTO,
  })
  estado: EstadoTicketEnum;

  @Column({ nullable: true })
  asignado_a: string;

  @Column()
  creado_por: string;

  @Column({ nullable: true })
  fecha_cierre: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
