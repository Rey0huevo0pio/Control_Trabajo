import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Prefijo global para la API
  app.setGlobalPrefix('api');

  // Obtener configuración
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') || 3000;

  // Habilitar validación de clases
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Habilitar CORS para todas las conexiones
  app.enableCors({
    origin: true, // Permitir todas las origins (para desarrollo)
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  await app.listen(port, '0.0.0.0');
  console.log(`🚀 Servidor corriendo en puerto: ${port}`);
  console.log(
    `🌐 Escuchando en: http://localhost:${port} y http://<tu-ip>:${port}`,
  );
  console.log(`📚 Endpoints de autenticación:`);
  console.log(`   POST /auth/register - Registrar usuario`);
  console.log(`   POST /auth/login - Iniciar sesión`);
  console.log(`📚 Endpoints de usuarios (requieren autenticación):`);
  console.log(`   GET /users - Listar usuarios`);
  console.log(`   GET /users/:id - Obtener usuario por ID`);
  console.log(`   PATCH /users/:id - Actualizar usuario`);
  console.log(`   DELETE /users/:id - Eliminar usuario`);
}

void bootstrap();
