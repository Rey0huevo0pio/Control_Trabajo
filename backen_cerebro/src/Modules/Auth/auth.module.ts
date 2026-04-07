/**
 * ============================================================================
 * 🔐 AUTH MODULE - Configuración de Autenticación JWT
 * ============================================================================
 * 
 * QUÉ HACE ESTE ARCHIVO:
 * - Configura Passport y JWT para autenticación
 * - Registra AuthService y JwtStrategy
 * - Define configuración de tokens (secreto, expiración)
 * 
 * CONEXIONES:
 * - Models: UsuarioSchema (../../Models/Usuarios/usuario.schema.ts)
 * - Controllers: AuthController (../../Controllers/Usuarios/auth.controller.ts)
 * - Config: JWT_SECRET desde .env
 * - Frontend: C_Ticket_Apk_STV/src/services/auth.service.ts
 * 
 * CONFIGURACIÓN JWT:
 * - Secreto: JWT_SECRET en .env o 'sotavento_secret_key_2024' por defect
 * - Expiración: 24 horas
 * - Payload: { sub: userId, Control_Usuario, rol }
 * 
 * PARA MODIFICAR:
 * - Cambiar tiempo de expiración: modificar expiresIn en línea 19
 * - Cambiar secreto: editar JWT_SECRET en .env
 * 
 * ============================================================================
 */
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from '../../Controllers/Usuarios/auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { MongooseModule } from '@nestjs/mongoose';
import { Usuario, UsuarioSchema } from '../../Models/Usuarios/usuario.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Usuario.name, schema: UsuarioSchema }]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET') || 'sotavento_secret_key_2024',
        signOptions: { expiresIn: '24h' },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService, JwtStrategy, PassportModule],
})
export class AuthModule {}
