/**
 * ============================================================================
 * 🔐 AUTH SERVICE - Lógica de Autenticación
 * ============================================================================
 * 
 * QUÉ HACE ESTE ARCHIVO:
 * - Registro de usuarios con hash de contraseña
 * - Login y validación de credenciales
 * - Generación de tokens JWT
 * - Validación de usuarios para guards
 * 
 * CONEXIONES:
 * - Models: Usuario, UsuarioDocument (../../Models/Usuarios/usuario.schema.ts)
 * - DTOs: CreateUsuarioDto, LoginDto (../../DTOs/usuario.dto.ts)
 * - Enums: RolUsuario, PERMISOS_POR_ROL (usuario.schema.ts)
 * - Frontend: C_Ticket_Apk_STV/src/services/auth.service.ts
 * 
 * ENDPOINTS QUE GENERA (vía AuthController):
 * - POST /api/auth/register → Registro de usuario
 * - POST /api/auth/login → Login de usuario
 * 
 * FLUJO DE REGISTRO:
 * 1. Verifica que Control_Usuario no exista
 * 2. Hashea la contraseña con bcrypt
 * 3. Asigna rol por defecto (VIGILANTE) si no se especifica
 * 4. Asigna permisos según el rol (PERMISOS_POR_ROL)
 * 5. Genera token JWT
 * 6. Retorna usuario sanitizado (sin password)
 * 
 * FLUJO DE LOGIN:
 * 1. Busca usuario por Control_Usuario
 * 2. Verifica que esté activo
 * 3. Compara contraseña con bcrypt
 * 4. Genera token JWT
 * 5. Retorna usuario sanitizado + token
 * 
 * PARA MODIFICAR:
 * - Cambiar rol por defecto: línea 41
 * - Cambiar algoritmo de hash: modificar bcrypt.genSalt y bcrypt.hash
 * - Agregar campos al token: modificar generateToken()
 * 
 * ============================================================================
 */
import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import {
  Usuario,
  UsuarioDocument,
  RolUsuario,
  PERMISOS_POR_ROL,
} from '../../Models/Usuarios/usuario.schema';
import { CreateUsuarioDto, LoginDto } from '../../DTOs/usuario.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Usuario.name) private usuarioModel: Model<UsuarioDocument>,
    private jwtService: JwtService,
  ) {}

  async register(createUsuarioDto: CreateUsuarioDto) {
    // Verificar si el Control_Usuario ya existe
    const existingUser = await this.usuarioModel.findOne({
      Control_Usuario: createUsuarioDto.Control_Usuario,
    });
    if (existingUser) {
      throw new ConflictException('El Control_Usuario ya está registrado');
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
    const usuario = await this.usuarioModel.findOne({
      Control_Usuario: loginDto.Control_Usuario,
    });

    if (!usuario) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    if (!usuario.activo) {
      throw new UnauthorizedException('Usuario inactivo');
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      usuario.password,
    );

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
    const usuario = await this.usuarioModel
      .findById(userId)
      .select('-password');
    if (usuario && usuario.activo) {
      return usuario;
    }
    return null;
  }

  private generateToken(usuario: any): string {
    const payload = {
      sub: usuario._id,
      Control_Usuario: usuario.Control_Usuario,
      rol: usuario.rol,
    };

    return this.jwtService.sign(payload);
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
    };
  }
}
