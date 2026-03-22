import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { Usuario, UsuarioDocument, RolUsuario, PERMISOS_POR_ROL } from '../../Models/Usuarios/usuario.schema';
import { CreateUsuarioDto, LoginDto } from '../../DTOs/usuario.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Usuario.name) private usuarioModel: Model<UsuarioDocument>,
    private jwtService: JwtService,
  ) {}

  async register(createUsuarioDto: CreateUsuarioDto) {
    // Verificar si el email ya existe
    const existingUser = await this.usuarioModel.findOne({ email: createUsuarioDto.email });
    if (existingUser) {
      throw new ConflictException('El email ya está registrado');
    }

    // Hash de la contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(createUsuarioDto.password, salt);

    // Asignar rol por defecto si no se especifica
    const rol = createUsuarioDto.rol || RolUsuario.VIGILANTE;

    // Crear el usuario
    const usuario = new this.usuarioModel({
      ...createUsuarioDto,
      password: hashedPassword,
      rol,
      activo: true,
      permisos: PERMISOS_POR_ROL[rol] || [],
    });

    await usuario.save();

    // Generar token
    const token = this.generateToken(usuario);

    return {
      success: true,
      message: 'Usuario registrado correctamente',
      data: {
        user: this.sanitizeUser(usuario),
        token,
      },
    };
  }

  async login(loginDto: LoginDto) {
    const usuario = await this.usuarioModel.findOne({ email: loginDto.email });
    
    if (!usuario) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    if (!usuario.activo) {
      throw new UnauthorizedException('Usuario inactivo');
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, usuario.password);
    
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const token = this.generateToken(usuario);

    return {
      success: true,
      message: 'Login exitoso',
      data: {
        user: this.sanitizeUser(usuario),
        token,
      },
    };
  }

  async validateUser(userId: string): Promise<any> {
    const usuario = await this.usuarioModel.findById(userId).select('-password');
    if (usuario && usuario.activo) {
      return usuario;
    }
    return null;
  }

  private generateToken(usuario: any): string {
    const payload = {
      sub: usuario._id,
      email: usuario.email,
      rol: usuario.rol,
    };

    return this.jwtService.sign(payload);
  }

  private sanitizeUser(usuario: any): object {
    return {
      id: usuario._id,
      email: usuario.email,
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      rol: usuario.rol,
      activo: usuario.activo,
      telefono: usuario.telefono,
      fechaIngreso: usuario.fechaIngreso,
      permisos: PERMISOS_POR_ROL[usuario.rol] || [],
    };
  }
}
