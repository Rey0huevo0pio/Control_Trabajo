import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { AreaInstalacion } from './area-instalacion.entity';

@Entity('instalaciones')
export class Instalacion {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nombre_instalacion: string;

  @Column()
  nombre_registrador: string;

  @Column()
  direccion: string;

  @Column({ type: 'float', nullable: true })
  lat: number;

  @Column({ type: 'float', nullable: true })
  lng: number;

  @Column({ nullable: true })
  descripcion: string;

  @Column({ nullable: true })
  foto: string;

  @Column()
  responsable: string;

  @Column('text', { array: true, default: [] })
  personal_asignado: string[];

  @Column({ default: true })
  activa: boolean;

  @Column()
  creado_por: string;

  @OneToMany(() => AreaInstalacion, (a) => a.instalacion, { cascade: true })
  areas: AreaInstalacion[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
