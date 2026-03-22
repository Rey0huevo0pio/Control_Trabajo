import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { Usuario, UsuarioDocument, RolUsuario, PERMISOS_POR_ROL } from '../../Models/Usuarios/usuario.schema';
import { CreateUsuarioDto, UpdateUsuarioDto } from '../../DTOs/usuario.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(Usuario.name) private usuarioModel: Model<UsuarioDocument>,
  ) {}

  async findAll(): Promise<any[]> {
    const usuarios = await this.usuarioModel.find().select('-password').exec();
    return usuarios.map(usuario => this.sanitizeUser(usuario));
  }

  async findOne(id: string): Promise<any> {
    const usuario = await this.usuarioModel.findById(id).select('-password').exec();
    if (!usuario) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }
    return this.sanitizeUser(usuario);
  }

  async findByControl_Usuario(Control_Usuario: string): Promise<UsuarioDocument | null> {
    return this.usuarioModel.findOne({ Control_Usuario }).exec();
  }

  async update(id: string, updateUsuarioDto: UpdateUsuarioDto): Promise<any> {
    // Si se va a cambiar el password, hashearlo
    if (updateUsuarioDto.password) {
      const salt = await bcrypt.genSalt(10);
      updateUsuarioDto.password = await bcrypt.hash(updateUsuarioDto.password, salt);
    }

    // Si se va a cambiar el rol, actualizar los permisos
    if (updateUsuarioDto.rol) {
      (updateUsuarioDto as any).permisos = PERMISOS_POR_ROL[updateUsuarioDto.rol] || [];
    }

    const usuario = await this.usuarioModel
      .findByIdAndUpdate(id, updateUsuarioDto, { new: true })
      .select('-password')
      .exec();

    if (!usuario) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    return this.sanitizeUser(usuario);
  }

  async remove(id: string): Promise<void> {
    const result = await this.usuarioModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }
  }

  private sanitizeUser(usuario: any): object {
    return {
      id: usuario._id,
      Control_Usuario: usuario.Control_Usuario,
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      rol: usuario.rol,
      activo: usuario.activo,
      telefono: usuario.telefono,
      fechaIngreso: usuario.fechaIngreso,
      permisos: PERMISOS_POR_ROL[usuario.rol] || [],
      createdAt: usuario.createdAt,
      updatedAt: usuario.updatedAt,
    };
  }
}
