import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ChatGrupo } from './chat-grupo.entity';

@Entity('mensajes_grupo')
export class MensajeGrupo {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  grupo_id: string;

  @ManyToOne(() => ChatGrupo, (g) => g.mensajes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'grupo_id' })
  grupo: ChatGrupo;

  @Column()
  id_usuario: string;

  @Column()
  numero_control: string;

  @Column('text')
  mensaje: string;

  @Column('jsonb', { default: { fotos: [], videos: [], documentos: [] } })
  archivos: { fotos: string[]; videos: string[]; documentos: string[] };

  @Column({ default: false })
  editado: boolean;

  @Column({ default: false })
  eliminado: boolean;

  @CreateDateColumn()
  fecha_envio: Date;
}
