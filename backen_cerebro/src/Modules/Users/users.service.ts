import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Usuario, RolUsuario, PERMISOS_POR_ROL } from '../../Models/PG/usuario.entity';
import { CreateUsuarioDto, UpdateUsuarioDto, SearchUsuariosDto, ChangePasswordDto, UpdateProfileDto } from '../../DTOs/usuario.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Usuario) private usuarioRepo: Repository<Usuario>,
  ) {}

  async create(dto: CreateUsuarioDto) {
    const exists = await this.usuarioRepo.findOne({
      where: { Control_Usuario: dto.Control_Usuario.toUpperCase() },
    });
    if (exists) throw new ConflictException(`Control_Usuario '${dto.Control_Usuario}' ya en uso`);

    const rol = (dto.rol as RolUsuario) || RolUsuario.VIGILANTE;
    const usuario = this.usuarioRepo.create({
      ...dto,
      Control_Usuario: dto.Control_Usuario.toUpperCase(),
      password: await bcrypt.hash(dto.password, 10),
      rol,
      permisos: PERMISOS_POR_ROL[rol],
      activo: true,
      primerLogin: true,
    });

    await this.usuarioRepo.save(usuario);
    return this.sanitize(usuario);
  }

  async findAll(searchDto?: SearchUsuariosDto) {
    const where: any[] = [];

    if (searchDto?.search) {
      const s = ILike(`%${searchDto.search}%`);
      where.push(
        { nombre: s }, { apellido: s },
        { Control_Usuario: s }, { email: s }, { departamento: s },
      );
    }

    const usuarios = await this.usuarioRepo.find({
      where: where.length ? where : undefined,
      order: { nombre: 'ASC' },
    });

    return usuarios
      .filter((u) => {
        if (searchDto?.rol && u.rol !== searchDto.rol) return false;
        if (searchDto?.activo !== undefined && u.activo !== searchDto.activo) return false;
        return true;
      })
      .map(this.sanitize);
  }

  async findOne(id: string) {
    const u = await this.usuarioRepo.findOne({ where: { id } });
    if (!u) throw new NotFoundException(`Usuario ${id} no encontrado`);
    return this.sanitize(u);
  }

  async findByControl_Usuario(Control_Usuario: string): Promise<Usuario | null> {
    return this.usuarioRepo.findOne({ where: { Control_Usuario: Control_Usuario.toUpperCase() } });
  }

  async findByEmail(email: string): Promise<Usuario | null> {
    return this.usuarioRepo.findOne({ where: { email } });
  }

  async update(id: string, dto: UpdateUsuarioDto) {
    const usuario = await this.usuarioRepo.findOne({ where: { id } });
    if (!usuario) throw new NotFoundException(`Usuario ${id} no encontrado`);

    if (dto.Control_Usuario && dto.Control_Usuario !== usuario.Control_Usuario) {
      const exists = await this.usuarioRepo.findOne({ where: { Control_Usuario: dto.Control_Usuario.toUpperCase() } });
      if (exists) throw new ConflictException(`Control_Usuario '${dto.Control_Usuario}' ya en uso`);
      dto.Control_Usuario = dto.Control_Usuario.toUpperCase();
    }

    if (dto.password) dto.password = await bcrypt.hash(dto.password, 10);
    if (dto.rol) (dto as any).permisos = PERMISOS_POR_ROL[dto.rol as RolUsuario] || [];

    await this.usuarioRepo.update(id, dto);
    return this.sanitize(await this.usuarioRepo.findOne({ where: { id } }));
  }

  async updateProfile(id: string, dto: UpdateProfileDto) {
    const usuario = await this.usuarioRepo.findOne({ where: { id } });
    if (!usuario) throw new NotFoundException(`Usuario ${id} no encontrado`);

    if (dto.email && dto.email !== usuario.email) {
      const exists = await this.findByEmail(dto.email);
      if (exists) throw new ConflictException(`Email '${dto.email}' ya en uso`);
    }

    await this.usuarioRepo.update(id, dto);
    return this.sanitize(await this.usuarioRepo.findOne({ where: { id } }));
  }

  async changePassword(id: string, dto: ChangePasswordDto) {
    const usuario = await this.usuarioRepo.findOne({ where: { id } });
    if (!usuario) throw new NotFoundException(`Usuario ${id} no encontrado`);

    const valid = await bcrypt.compare(dto.currentPassword, usuario.password);
    if (!valid) throw new BadRequestException('Contraseña actual incorrecta');

    await this.usuarioRepo.update(id, {
      password: await bcrypt.hash(dto.newPassword, 10),
      primerLogin: false,
    });
    return { message: 'Contraseña actualizada correctamente' };
  }

  async remove(id: string) {
    const result = await this.usuarioRepo.delete(id);
    if (!result.affected) throw new NotFoundException(`Usuario ${id} no encontrado`);
  }

  async toggleActive(id: string) {
    const usuario = await this.usuarioRepo.findOne({ where: { id } });
    if (!usuario) throw new NotFoundException(`Usuario ${id} no encontrado`);
    await this.usuarioRepo.update(id, { activo: !usuario.activo });
    return this.sanitize(await this.usuarioRepo.findOne({ where: { id } }));
  }

  async updateLastAccess(id: string) {
    await this.usuarioRepo.update(id, { ultimoAcceso: new Date(), primerLogin: false });
  }

  async countUsers(): Promise<number> {
    return this.usuarioRepo.count();
  }

  async findByRol(rol: RolUsuario) {
    const usuarios = await this.usuarioRepo.find({ where: { rol, activo: true }, order: { nombre: 'ASC' } });
    return usuarios.map(this.sanitize);
  }

  private sanitize(u: Usuario) {
    if (!u) return null;
    const { password, ...rest } = u as any;
    return { ...rest, permisos: PERMISOS_POR_ROL[u.rol] || [] };
  }
}
