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
import { AppController } from './app.controller';
import { AppService } from './app.service';

// ==========================================================================
// IMPORTS DE MÓDULOS
// ==========================================================================
// Cada módulo representa una funcionalidad independiente de la aplicación
// Ver documentación detallada en: .qwen/BACKEND_INDEX.md → Sección "MÓDULOS"

import { AuthModule } from './Modules/Auth/auth.module'; // 🔐 Autenticación JWT
import { UsersModule } from './Modules/Users/users.module'; // 👤 CRUD de usuarios
import { InstalacionesModule } from './Modules/Instalaciones/instalaciones.module'; // 🏢 Instalaciones
import { UsuariosModule } from './Modules/Usuarios/usuarios.module'; // 👥 Módulo secundario
import { TicketITModule } from './Modules/TicketIT/ticket-it.module'; // 🎫 Tickets IT
import { ChatModule } from './Modules/Chat/chat.module'; // 💬 Chat empresarial
import { UploadsModule } from './Modules/Uploads/uploads.module'; // 📁 Subida de archivos
import { EmailModule } from './Modules/Email/email.module'; // 📧 Envío de emails

@Module({
  imports: [
    // Configuración de variables de entorno
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    // Conexión a MongoDB
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri:
          configService.get('MONGODB_URI') ||
          'mongodb://127.0.0.1:27017/STV_Global',
      }),
      inject: [ConfigService],
    }),
    // Módulos de la aplicación
    AuthModule,
    UsersModule,
    InstalacionesModule,
    UsuariosModule,
    TicketITModule,
    ChatModule,
    UploadsModule,
    EmailModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
