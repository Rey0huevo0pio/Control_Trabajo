/**
 * ============================================================================
 * 📦 MÓDULO RAÍZ - Configuración Central de la Aplicación
 * ============================================================================
 *
 * QUÉ HACE ESTE ARCHIVO:
 * - Importa y registra TODOS los módulos de la aplicación
 * - Configura la conexión a MongoDB
 * - Carga variables de entorno desde .env
 * - Define los controladores y servicios globales
 *
 * CONEXIONES:
 * - MongoDB: uri desde .env (MONGODB_URI) o default: mongodb://127.0.0.1:27017/STV_Global
 * - main.ts: Este módulo se importa en main.ts para iniciar la app
 * - .env: Variables de entorno (MONGODB_URI, JWT_SECRET, etc.)
 *
 * MÓDULOS REGISTRADOS:
 * - AuthModule → Autenticación JWT (login, register)
 * - UsersModule → Gestión de usuarios (CRUD)
 * - InstalacionesModule → Gestión de instalaciones y áreas
 * - UsuariosModule → Módulo secundario de usuarios
 * - TicketITModule → Sistema de tickets de soporte IT
 * - ChatModule → Chat empresarial (grupal y privado)
 * - UploadsModule → Subida de archivos
 * - EmailModule → Envío de correos electrónicos
 *
 * PARA AGREGAR NUEVO MÓDULO:
 * 1. Importar el módulo: import { NuevoModule } from './Modules/Nuevo/nuevo.module';
 * 2. Agregar al array imports: imports: [ ..., NuevoModule ]
 *
 * PARA MODIFICAR:
 * - Cambiar BD: modificar MONGODB_URI en .env o el default en línea 27
 * - Agregar módulo global: agregar exports en el módulo y poner en imports
 *
 * ============================================================================
 */
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
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
import { ChatGrupo } from './Models/T_Chat_PG/chat-grupo.entity';
import { MensajeGrupo } from './Models/T_Chat_PG/mensaje-grupo.entity';
import { MensajePrivado } from './Models/T_Chat_PG/mensaje-privado.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),

    // MongoDB — sigue usándose para Email, Usuarios, etc.
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get('MONGODB_URI') || 'mongodb://127.0.0.1:27017/STV_Global',
      }),
      inject: [ConfigService],
    }),

    // PostgreSQL — para Chat
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('PG_HOST', '127.0.0.1'),
        port: configService.get<number>('PG_PORT', 5432),
        username: configService.get('PG_USER', 'postgres'),
        password: configService.get('PG_PASSWORD', 's0Tavento-2026*'),
        database: configService.get('PG_DATABASE', 'stv_global'),
        entities: [ChatGrupo, MensajeGrupo, MensajePrivado],
        synchronize: true, // solo desarrollo
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
