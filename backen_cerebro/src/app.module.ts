import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { AuthModule } from './Modules/Auth/auth.module';
import { UsersModule } from './Modules/Users/users.module';
import { InstalacionesModule } from './Modules/Instalaciones/instalaciones.module';
import { UsuariosModule } from './Modules/Usuarios/usuarios.module';
import { TicketITModule } from './Modules/TicketIT/ticket-it.module';
import { ChatModule } from './Modules/Chat/chat.module';
import { UploadsModule } from './Modules/Uploads/uploads.module';
import { EmailModule } from './Modules/Email/email.module';
import { A_ComprasModule } from './Modules/A_Compras/a_compras.module';
import { RedisModule } from './Modules/Redis/redis.module';

// Entidades PostgreSQL
import { Usuario } from './Models/PG/usuario.entity';
import { EmailConfig } from './Models/PG/email-config.entity';
import { Instalacion } from './Models/PG/instalacion.entity';
import { AreaInstalacion } from './Models/PG/area-instalacion.entity';
import { TicketIT } from './Models/PG/ticket-it.entity';
import { EstadoTicketHistorial } from './Models/PG/estado-ticket-historial.entity';
import { GoogleConnection } from './Models/PG/google-connection.entity';
import { ChatGrupo } from './Models/T_Chat_PG/chat-grupo.entity';
import { MensajeGrupo } from './Models/T_Chat_PG/mensaje-grupo.entity';
import { MensajePrivado } from './Models/T_Chat_PG/mensaje-privado.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('PG_HOST', '127.0.0.1'),
        port: configService.get<number>('PG_PORT', 5432),
        username: configService.get('PG_USER', 'postgres'),
        password: configService.get('PG_PASSWORD', 's0Tavento-2026*'),
        database: configService.get('PG_DATABASE', 'stv_global'),
        entities: [
          Usuario,
          EmailConfig,
          Instalacion,
          AreaInstalacion,
          TicketIT,
          EstadoTicketHistorial,
          GoogleConnection,
          ChatGrupo,
          MensajeGrupo,
          MensajePrivado,
        ],
        synchronize: true, // crea las tablas automáticamente en desarrollo
      }),
      inject: [ConfigService],
    }),

    RedisModule,
    AuthModule,
    UsersModule,
    InstalacionesModule,
    UsuariosModule,
    TicketITModule,
    ChatModule,
    UploadsModule,
    EmailModule,
    A_ComprasModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
