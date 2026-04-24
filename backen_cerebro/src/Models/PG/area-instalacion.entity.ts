import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Instalacion } from './instalacion.entity';

@Entity('areas_instalacion')
export class AreaInstalacion {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nombre_area: string;

  @Column({ nullable: true })
  descripcion: string;

  @Column()
  id_instalacion: string;

  @ManyToOne(() => Instalacion, (i) => i.areas, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_instalacion' })
  instalacion: Instalacion;

  @Column()
  creado_por: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
