import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import {
  Usuario,
  UsuarioDocument,
  RolUsuario,
  PERMISOS_POR_ROL,
} from '../../Models/Usuarios/usuario.schema';
import {
  CreateUsuarioDto,
  UpdateUsuarioDto,
  SearchUsuariosDto,
  ChangePasswordDto,
  UpdateProfileDto,
} from '../../DTOs/usuario.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(Usuario.name) private usuarioModel: Model<UsuarioDocument>,
  ) {}

  // ==========================================
  // CREAR USUARIO
  // ==========================================
  async create(createUsuarioDto: CreateUsuarioDto): Promise<any> {
    // Verificar si ya existe
    const existingUser = await this.usuarioModel
      .findOne({ Control_Usuario: createUsuarioDto.Control_Usuario })
      .exec();

    if (existingUser) {
      throw new ConflictException(
        `El Control_Usuario '${createUsuarioDto.Control_Usuario}' ya está en uso`,
      );
    }

    // Hashear password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(createUsuarioDto.password, salt);

    // Asignar permisos según rol
    const rol = createUsuarioDto.rol || RolUsuario.VIGILANTE;
    const permisos = PERMISOS_POR_ROL[rol] || [];

    // Crear usuario
    const nuevoUsuario = new this.usuarioModel({
      ...createUsuarioDto,
      password: hashedPassword,
      rol,
      permisos,
      primerLogin: true,
      activo: true,
    });

    await nuevoUsuario.save();

    return this.sanitizeUser(nuevoUsuario);
  }

  // ==========================================
  // OBTENER TODOS LOS USUARIOS
  // ==========================================
  async findAll(searchDto?: SearchUsuariosDto): Promise<any[]> {
    let query: any = {};

    if (searchDto) {
      if (searchDto.search) {
        const searchRegex = new RegExp(searchDto.search, 'i');
        query.$or = [
          { nombre: searchRegex },
          { apellido: searchRegex },
          { Control_Usuario: searchRegex },
          { email: searchRegex },
          { departamento: searchRegex },
        ];
      }

      if (searchDto.rol) {
        query.rol = searchDto.rol;
      }

      if (searchDto.activo !== undefined) {
        query.activo = searchDto.activo;
      }

      if (searchDto.departamento) {
        query.departamento = new RegExp(searchDto.departamento, 'i');
      }
    }

    const usuarios = await this.usuarioModel
      .find(query)
      .select('-password')
      .sort({ nombre: 1, apellido: 1 })
      .exec();

    return usuarios.map((usuario) => this.sanitizeUser(usuario));
  }

  // ==========================================
  // OBTENER USUARIO POR ID
  // ==========================================
  async findOne(id: string): Promise<any> {
    const usuario = await this.usuarioModel
      .findById(id)
      .select('-password')
      .exec();

    if (!usuario) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    return this.sanitizeUser(usuario);
  }

  // ==========================================
  // OBTENER USUARIO POR CONTROL_USUARIO
  // ==========================================
  async findByControl_Usuario(
    Control_Usuario: string,
  ): Promise<UsuarioDocument | null> {
    return this.usuarioModel
      .findOne({ Control_Usuario: Control_Usuario.toUpperCase() })
      .exec();
  }

  // ==========================================
  // OBTENER USUARIO POR EMAIL
  // ==========================================
  async findByEmail(email: string): Promise<UsuarioDocument | null> {
    return this.usuarioModel.findOne({ email }).exec();
  }

  // ==========================================
  // ACTUALIZAR USUARIO
  // ==========================================
  async update(id: string, updateUsuarioDto: UpdateUsuarioDto): Promise<any> {
    // Verificar si existe
    const usuario = await this.usuarioModel.findById(id).exec();
    if (!usuario) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    // Si se va a cambiar el Control_Usuario, verificar que no exista
    if (
      updateUsuarioDto.Control_Usuario &&
      updateUsuarioDto.Control_Usuario !== usuario.Control_Usuario
    ) {
      const existingUser = await this.usuarioModel
        .findOne({ Control_Usuario: updateUsuarioDto.Control_Usuario })
        .exec();

      if (existingUser) {
        throw new ConflictException(
          `El Control_Usuario '${updateUsuarioDto.Control_Usuario}' ya está en uso`,
        );
      }
    }

    // Si se va a cambiar el password, hashearlo
    if (updateUsuarioDto.password) {
      const salt = await bcrypt.genSalt(10);
      updateUsuarioDto.password = await bcrypt.hash(
        updateUsuarioDto.password,
        salt,
      );
    }

    // Si se va a cambiar el rol, actualizar los permisos
    if (updateUsuarioDto.rol) {
      (updateUsuarioDto as any).permisos =
        PERMISOS_POR_ROL[updateUsuarioDto.rol] || [];
    }

    const usuarioActualizado = await this.usuarioModel
      .findByIdAndUpdate(id, updateUsuarioDto, { new: true })
      .select('-password')
      .exec();

    return this.sanitizeUser(usuarioActualizado);
  }

  // ==========================================
  // ACTUALIZAR PERFIL (solo datos básicos)
  // ==========================================
  async updateProfile(
    id: string,
    updateProfileDto: UpdateProfileDto,
  ): Promise<any> {
    const usuario = await this.usuarioModel.findById(id).exec();
    if (!usuario) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    // Verificar email si se va a cambiar
    if (
      updateProfileDto.email &&
      updateProfileDto.email !== usuario.email
    ) {
      const existingUser = await this.findByEmail(updateProfileDto.email);
      if (existingUser) {
        throw new ConflictException(
          `El email '${updateProfileDto.email}' ya está en uso`,
        );
      }
    }

    const usuarioActualizado = await this.usuarioModel
      .findByIdAndUpdate(id, updateProfileDto, { new: true })
      .select('-password')
      .exec();

    return this.sanitizeUser(usuarioActualizado);
  }

  // ==========================================
  // CAMBIAR PASSWORD
  // ==========================================
  async changePassword(
    id: string,
    changePasswordDto: ChangePasswordDto,
  ): Promise<{ message: string }> {
    const usuario = await this.usuarioModel.findById(id).exec();
    if (!usuario) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    // Verificar password actual
    const isPasswordValid = await bcrypt.compare(
      changePasswordDto.currentPassword,
      usuario.password,
    );

    if (!isPasswordValid) {
      throw new BadRequestException('La contraseña actual es incorrecta');
    }

    // Hashear nueva password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(
      changePasswordDto.newPassword,
      salt,
    );

    await this.usuarioModel.findByIdAndUpdate(id, {
      password: hashedPassword,
      primerLogin: false,
    });

    return { message: 'Contraseña actualizada correctamente' };
  }

  // ==========================================
  // ELIMINAR USUARIO
  // ==========================================
  async remove(id: string): Promise<void> {
    const result = await this.usuarioModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }
  }

  // ==========================================
  // ACTIVAR/DESACTIVAR USUARIO
  // ==========================================
  async toggleActive(id: string): Promise<any> {
    const usuario = await this.usuarioModel.findById(id).exec();
    if (!usuario) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    usuario.activo = !usuario.activo;
    await usuario.save();

    return this.sanitizeUser(usuario);
  }

  // ==========================================
  // ACTUALIZAR ÚLTIMO ACCESO
  // ==========================================
  async updateLastAccess(id: string): Promise<void> {
    await this.usuarioModel.findByIdAndUpdate(id, {
      ultimoAcceso: new Date(),
      primerLogin: false,
    });
  }

  // ==========================================
  // CONTAR USUARIOS
  // ==========================================
  async countUsers(): Promise<number> {
    return this.usuarioModel.countDocuments().exec();
  }

  // ==========================================
  // OBTENER USUARIOS POR ROL
  // ==========================================
  async findByRol(rol: RolUsuario): Promise<any[]> {
    const usuarios = await this.usuarioModel
      .find({ rol, activo: true })
      .select('-password')
      .sort({ nombre: 1 })
      .exec();

    return usuarios.map((usuario) => this.sanitizeUser(usuario));
  }

  // ==========================================
  // SANITIZAR USUARIO (quitar datos sensibles)
  // ==========================================
  private sanitizeUser(usuario: any): object {
    return {
      id: usuario._id,
      Control_Usuario: usuario.Control_Usuario,
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      email: usuario.email,
      rol: usuario.rol,
      activo: usuario.activo,
      telefono: usuario.telefono,
      avatar: usuario.avatar,
      departamento: usuario.departamento,
      puesto: usuario.puesto,
      fechaIngreso: usuario.fechaIngreso,
      ultimoAcceso: usuario.ultimoAcceso,
      primerLogin: usuario.primerLogin,
      permisos: PERMISOS_POR_ROL[usuario.rol] || [],
      createdAt: usuario.createdAt,
      updatedAt: usuario.updatedAt,
    };
  }
}
