import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { MensajeGrupo } from './mensaje-grupo.entity';

@Entity('chat_grupos')
export class ChatGrupo {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nombre_grupo: string;

  @Column({ nullable: true })
  descripcion: string;

  @Column()
  creador_id: string;

  @Column('text', { array: true, default: [] })
  miembros: string[];

  @Column({ nullable: true })
  foto_grupo: string;

  @Column({ default: true })
  activo: boolean;

  @OneToMany(() => MensajeGrupo, (m) => m.grupo, { cascade: true })
  mensajes: MensajeGrupo[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
