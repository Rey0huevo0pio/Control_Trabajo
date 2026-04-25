import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import {
  Usuario,
  RolUsuario,
  PERMISOS_POR_ROL,
} from '../../Models/PG/usuario.entity';
import { CreateUsuarioDto, LoginDto } from '../../DTOs/usuario.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Usuario) private usuarioRepo: Repository<Usuario>,
    private jwtService: JwtService,
  ) {}

  async register(dto: CreateUsuarioDto) {
    const exists = await this.usuarioRepo.findOne({
      where: { Control_Usuario: dto.Control_Usuario.toUpperCase() },
    });
    if (exists)
      throw new ConflictException('El Control_Usuario ya está registrado');

    const rol = dto.rol || RolUsuario.VIGILANTE;
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const usuario = this.usuarioRepo.create({
      ...dto,
      Control_Usuario: dto.Control_Usuario.toUpperCase(),
      password: hashedPassword,
      rol,
      permisos: PERMISOS_POR_ROL[rol],
      activo: true,
      primerLogin: true,
    });

    await this.usuarioRepo.save(usuario);

    return {
      success: true,
      message: 'Usuario registrado correctamente',
      data: {
        user: this.sanitize(usuario),
        token: this.generateToken(usuario),
      },
    };
  }

  async login(dto: LoginDto) {
    const usuario = await this.usuarioRepo.findOne({
      where: { Control_Usuario: dto.Control_Usuario.toUpperCase() },
    });

    if (!usuario) throw new UnauthorizedException('Credenciales inválidas');
    if (!usuario.activo) throw new UnauthorizedException('Usuario inactivo');

    const valid = await bcrypt.compare(dto.password, usuario.password);
    if (!valid) throw new UnauthorizedException('Credenciales inválidas');

    return {
      success: true,
      message: 'Login exitoso',
      data: {
        user: this.sanitize(usuario),
        token: this.generateToken(usuario),
      },
    };
  }

  async validateUser(userId: string): Promise<Usuario | null> {
    const usuario = await this.usuarioRepo.findOne({ where: { id: userId } });
    return usuario?.activo ? usuario : null;
  }

  private generateToken(usuario: Usuario): string {
    return this.jwtService.sign({
      sub: usuario.id,
      Control_Usuario: usuario.Control_Usuario,
      rol: usuario.rol,
    });
  }

  private sanitize(u: Usuario): Omit<Usuario, 'password'> {
    const rest = { ...u } as Record<string, unknown>;
    delete rest.password;
    return {
      ...(rest as Omit<Usuario, 'password'>),
      permisos: (PERMISOS_POR_ROL[u.rol] || []) as string[],
    };
  }
}
