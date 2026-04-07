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
    console.log('\n🔐 [JWT Strategy] Validando token...');
    console.log('📋 Payload:', JSON.stringify(payload, null, 2));

    const usuario = await this.usuarioModel
      .findById(payload.sub)
      .select('-password');

    if (!usuario) {
      console.log(
        '❌ [JWT Strategy] Usuario NO encontrado con ID:',
        payload.sub,
      );
      throw new UnauthorizedException('Usuario no encontrado');
    }

    if (!usuario.activo) {
      console.log('❌ [JWT Strategy] Usuario está INACTIVO');
      throw new UnauthorizedException('Usuario inactivo');
    }

    console.log('✅ [JWT Strategy] Usuario validado:', usuario.Control_Usuario);

    return {
      userId: payload.sub,
      Control_Usuario: payload.Control_Usuario,
      rol: payload.rol,
      nombre: usuario.nombre,
      apellido: usuario.apellido,
    };
  }
}
