import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('google_connections')
export class GoogleConnection {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  usuarioId: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  nombre: string;

  @Column('text')
  accessToken: string;

  @Column({ nullable: true })
  refreshToken: string;

  @Column({ nullable: true })
  tokenExpiry: Date;

  @Column({ default: true })
  activo: boolean;

  @Column({ nullable: true })
  ultimoAcceso: Date;

  @Column({ default: 'compras' })
  scope: string;

  @Column('text', { array: true, default: [] })
  areasAsignadas: string[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
