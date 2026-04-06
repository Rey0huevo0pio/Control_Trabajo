import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
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
    // Servir archivos estáticos (uploads)
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'uploads'),
      serveRoot: '/uploads',
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
