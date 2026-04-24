import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum RolUsuario {
  VIGILANTE = 'vigilante',
  SUPERVISOR = 'supervisor',
  RH = 'rh',
  IT = 'it',
  ADMIN = 'admin',
}

export enum Permiso {
  USUARIOS_VER = 'usuarios_ver',
  USUARIOS_CREAR = 'usuarios_crear',
  USUARIOS_EDITAR = 'usuarios_editar',
  USUARIOS_ELIMINAR = 'usuarios_eliminar',
  DASHBOARD_VER = 'dashboard_ver',
  REPORTES_VER = 'reportes_ver',
  REPORTES_CREAR = 'reportes_crear',
  REPORTES_EXPORTAR = 'reportes_exportar',
  INVENTARIO_VER = 'inventario_ver',
  INVENTARIO_CREAR = 'inventario_crear',
  INVENTARIO_EDITAR = 'inventario_editar',
  INVENTARIO_ELIMINAR = 'inventario_eliminar',
  RONDINES_VER = 'rondines_ver',
  RONDINES_CREAR = 'rondines_crear',
  RONDINES_EDITAR = 'rondines_editar',
  RONDINES_ELIMINAR = 'rondines_eliminar',
  CHAT_VER = 'chat_ver',
  CHAT_ENVIAR = 'chat_enviar',
  CHAT_CREAR_GRUPO = 'chat_crear_grupo',
  CHAT_ELIMINAR_MSG = 'chat_eliminar_msg',
  CHAT_ADMIN = 'chat_admin',
  TICKETS_VER = 'tickets_ver',
  TICKETS_CREAR = 'tickets_crear',
  TICKETS_EDITAR = 'tickets_editar',
  TICKETS_ELIMINAR = 'tickets_eliminar',
  TICKETS_ASIGNAR = 'tickets_asignar',
  TICKETS_ADMIN = 'tickets_admin',
  ARCHIVERO_VER = 'archivero_ver',
  ARCHIVERO_CREAR = 'archivero_crear',
  ARCHIVERO_SUBIR = 'archivero_subir',
  ARCHIVERO_ELIMINAR = 'archivero_eliminar',
  ARCHIVERO_COMPARTIR = 'archivero_compartir',
  ARCHIVERO_ADMIN = 'archivero_admin',
  INSTALACIONES_VER = 'instalaciones_ver',
  INSTALACIONES_CREAR = 'instalaciones_crear',
  INSTALACIONES_EDITAR = 'instalaciones_editar',
  INSTALACIONES_ELIMINAR = 'instalaciones_eliminar',
  NOTICIAS_VER = 'noticias_ver',
  NOTICIAS_CREAR = 'noticias_crear',
  NOTICIAS_EDITAR = 'noticias_editar',
  NOTICIAS_ELIMINAR = 'noticias_eliminar',
}

export const PERMISOS_POR_ROL: Record<RolUsuario, Permiso[]> = {
  [RolUsuario.VIGILANTE]: [
    Permiso.DASHBOARD_VER,
    Permiso.CHAT_VER,
    Permiso.CHAT_ENVIAR,
    Permiso.TICKETS_VER,
    Permiso.TICKETS_CREAR,
    Permiso.ARCHIVERO_VER,
  ],
  [RolUsuario.SUPERVISOR]: [
    Permiso.DASHBOARD_VER,
    Permiso.REPORTES_VER,
    Permiso.RONDINES_VER,
    Permiso.CHAT_VER,
    Permiso.CHAT_ENVIAR,
    Permiso.CHAT_CREAR_GRUPO,
    Permiso.TICKETS_VER,
    Permiso.TICKETS_CREAR,
    Permiso.TICKETS_ASIGNAR,
    Permiso.ARCHIVERO_VER,
    Permiso.ARCHIVERO_CREAR,
    Permiso.ARCHIVERO_SUBIR,
    Permiso.INSTALACIONES_VER,
    Permiso.NOTICIAS_VER,
  ],
  [RolUsuario.RH]: [
    Permiso.USUARIOS_VER,
    Permiso.USUARIOS_CREAR,
    Permiso.USUARIOS_EDITAR,
    Permiso.DASHBOARD_VER,
    Permiso.REPORTES_VER,
    Permiso.REPORTES_EXPORTAR,
    Permiso.CHAT_VER,
    Permiso.CHAT_ENVIAR,
    Permiso.CHAT_CREAR_GRUPO,
    Permiso.CHAT_ADMIN,
    Permiso.TICKETS_VER,
    Permiso.TICKETS_CREAR,
    Permiso.TICKETS_EDITAR,
    Permiso.TICKETS_ASIGNAR,
    Permiso.ARCHIVERO_VER,
    Permiso.ARCHIVERO_CREAR,
    Permiso.ARCHIVERO_SUBIR,
    Permiso.ARCHIVERO_COMPARTIR,
    Permiso.INSTALACIONES_VER,
    Permiso.NOTICIAS_VER,
    Permiso.NOTICIAS_CREAR,
    Permiso.NOTICIAS_EDITAR,
  ],
  [RolUsuario.IT]: Object.values(Permiso) as Permiso[],
  [RolUsuario.ADMIN]: Object.values(Permiso) as Permiso[],
};

@Entity('usuarios')
export class Usuario {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  Control_Usuario: string;

  @Column()
  password: string;

  @Column()
  nombre: string;

  @Column()
  apellido: string;

  @Column({ type: 'enum', enum: RolUsuario, default: RolUsuario.VIGILANTE })
  rol: RolUsuario;

  @Column({ default: true })
  activo: boolean;

  @Column({ nullable: true })
  telefono: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  fechaIngreso: Date;

  @Column({ nullable: true })
  ultimoAcceso: Date;

  @Column({ default: true })
  primerLogin: boolean;

  @Column('text', { array: true, default: [] })
  permisos: string[];

  @Column({ nullable: true })
  avatar: string;

  @Column({ nullable: true })
  departamento: string;

  @Column({ nullable: true })
  puesto: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
