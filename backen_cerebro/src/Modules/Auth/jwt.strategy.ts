import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Usuario, UsuarioDocument } from '../../Models/Usuarios/usuario.schema';

export interface JwtPayload {
  sub: string;
  Control_Usuario: string;
  rol: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectModel(Usuario.name) private usuarioModel: Model<UsuarioDocument>,
    configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey:
        configService.get('JWT_SECRET') || 'sotavento_secret_key_2024',
    });
  }

  async validate(payload: JwtPayload) {
    const usuario = await this.usuarioModel
      .findById(payload.sub)
      .select('-password');

    if (!usuario) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    if (!usuario.activo) {
      throw new UnauthorizedException('Usuario inactivo');
    }

    return {
      userId: payload.sub,
      Control_Usuario: payload.Control_Usuario,
      rol: payload.rol,
      nombre: usuario.nombre,
      apellido: usuario.apellido,
    };
  }
}
