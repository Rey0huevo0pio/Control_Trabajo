import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('mensajes_privados')
export class MensajePrivado {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  id_emisor: string;

  @Column()
  id_receptor: string;

  @Column('text')
  mensaje: string;

  @Column('jsonb', { default: { fotos: [], videos: [], documentos: [] } })
  archivos: { fotos: string[]; videos: string[]; documentos: string[] };

  @Column({ default: false })
  leido: boolean;

  @Column({ default: false })
  eliminado: boolean;

  @CreateDateColumn()
  fecha_envio: Date;
}
