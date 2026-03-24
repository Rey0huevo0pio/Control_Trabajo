import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { Usuario, RolUsuario } from '../../Models/Usuarios';
import {
  CreateUsuarioDto,
  UpdateUsuarioDto,
  LoginUsuarioDto,
} from './dto/usuario.dto';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectModel(Usuario.name) private usuarioModel: Model<Usuario>,
  ) {}

  // ==================== MÉTODOS DE USUARIOS ====================

  async createUsuario(createDto: CreateUsuarioDto): Promise<Usuario> {
    try {
      // Verificar si el número de control ya existe
      const existingControl = await this.usuarioModel.findOne({
        numero_control: createDto.numero_control,
      });
      if (existingControl) {
        throw new ConflictException(
          `El número de control ${createDto.numero_control} ya está registrado`,
        );
      }

      // Verificar si el email ya existe
      const existingEmail = await this.usuarioModel.findOne({
        email: createDto.email,
      });
      if (existingEmail) {
        throw new ConflictException(
          `El email ${createDto.email} ya está registrado`,
        );
      }

      // Encriptar password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(createDto.password, saltRounds);

      const usuario = new this.usuarioModel({
        ...createDto,
        password: hashedPassword,
        rol: createDto.rol || RolUsuario.USUARIO,
        id_instalacion: createDto.id_instalacion
          ? new Types.ObjectId(createDto.id_instalacion)
          : undefined,
        id_area: createDto.id_area
          ? new Types.ObjectId(createDto.id_area)
          : undefined,
      });

      return await usuario.save();
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new BadRequestException(`Error al crear usuario: ${error.message}`);
    }
  }

  async findAllUsuarios(): Promise<Usuario[]> {
    return await this.usuarioModel
      .find()
      .populate('id_instalacion id_area')
      .select('-password');
  }

  async findOneUsuario(id: string): Promise<Usuario> {
    const usuario = await this.usuarioModel
      .findById(id)
      .populate('id_instalacion id_area')
      .select('-password');

    if (!usuario) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }
    return usuario;
  }

  async findByNumeroControl(numeroControl: string): Promise<Usuario> {
    const usuario = await this.usuarioModel
      .findOne({ numero_control: numeroControl })
      .populate('id_instalacion id_area')
      .select('-password');

    if (!usuario) {
      throw new NotFoundException(
        `Usuario con número de control ${numeroControl} no encontrado`,
      );
    }
    return usuario;
  }

  async findByEmail(email: string): Promise<Usuario> {
    const usuario = await this.usuarioModel
      .findOne({ email })
      .populate('id_instalacion id_area');

    if (!usuario) {
      throw new NotFoundException(`Usuario con email ${email} no encontrado`);
    }
    return usuario;
  }

  async updateUsuario(
    id: string,
    updateDto: UpdateUsuarioDto,
  ): Promise<Usuario> {
    try {
      // Si se actualiza el password, encriptarlo
      if (updateDto.password) {
        const saltRounds = 10;
        updateDto.password = await bcrypt.hash(updateDto.password, saltRounds);
      }

      // Convertir IDs a ObjectId si existen
      const updateData: any = { ...updateDto };
      if (updateDto.id_instalacion) {
        updateData.id_instalacion = new Types.ObjectId(
          updateDto.id_instalacion,
        );
      }
      if (updateDto.id_area) {
        updateData.id_area = new Types.ObjectId(updateDto.id_area);
      }

      const usuario = await this.usuarioModel
        .findByIdAndUpdate(id, updateData, { new: true, runValidators: true })
        .select('-password');

      if (!usuario) {
        throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
      }
      return usuario;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(
        `Error al actualizar usuario: ${error.message}`,
      );
    }
  }

  async deleteUsuario(id: string): Promise<void> {
    const result = await this.usuarioModel.findByIdAndDelete(id);
    if (!result) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }
  }

  async findUsuariosByInstalacion(instalacionId: string): Promise<Usuario[]> {
    return await this.usuarioModel
      .find({ id_instalacion: new Types.ObjectId(instalacionId) })
      .populate('id_area')
      .select('-password');
  }

  async findUsuariosByArea(areaId: string): Promise<Usuario[]> {
    return await this.usuarioModel
      .find({ id_area: new Types.ObjectId(areaId) })
      .select('-password');
  }

  async findSoporteIT(): Promise<Usuario[]> {
    return await this.usuarioModel
      .find({ rol: RolUsuario.SOPORTE_IT })
      .select('-password');
  }

  // ==================== AUTENTICACIÓN ====================

  async validateUser(loginDto: LoginUsuarioDto): Promise<Usuario | null> {
    const usuario = await this.findByEmail(loginDto.email);

    if (
      usuario &&
      (await bcrypt.compare(loginDto.password, usuario.password))
    ) {
      const usuarioObj = usuario as any;
      const { password, ...result } = usuarioObj;
      return result as Usuario;
    }

    return null;
  }

  async findByEmailWithPassword(email: string): Promise<Usuario | null> {
    return await this.usuarioModel.findOne({ email });
  }
}
