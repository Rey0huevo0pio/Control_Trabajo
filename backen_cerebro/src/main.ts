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
  
  // Habilitar CORS
  app.enableCors();
  
  await app.listen(port);
  console.log(`🚀 Servidor corriendo en puerto: ${port}`);
  console.log(`📚 Endpoints de autenticación:`);
  console.log(`   POST /auth/register - Registrar usuario`);
  console.log(`   POST /auth/login - Iniciar sesión`);
  console.log(`📚 Endpoints de usuarios (requieren autenticación):`);
  console.log(`   GET /users - Listar usuarios`);
  console.log(`   GET /users/:id - Obtener usuario por ID`);
  console.log(`   PATCH /users/:id - Actualizar usuario`);
  console.log(`   DELETE /users/:id - Eliminar usuario`);
}
bootstrap();
