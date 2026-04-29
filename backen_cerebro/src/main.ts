/**
 * ============================================================================
 * 🚀 ENTRY POINT - Servidor Principal de la API STV Global
 * ============================================================================
 *
 * QUÉ HACE ESTE ARCHIVO:
 * - Inicializa el servidor NestJS
 * - Configura CORS para comunicación con el frontend (C_Ticket_Apk_STV)
 * - Habilita validación automática de requests
 * - Sirve archivos estáticos de uploads
 * - Define el prefijo global /api para todos los endpoints
 *
 * CONEXIONES:
 * - Frontend: C_Ticket_Apk_STV/src/constants/index.ts (API_URL)
 * - Base de datos: MongoDB (configurado en app.module.ts)
 * - Puerto por defecto: 3000 (configurable en .env)
 *
 * RUTAS RELACIONADAS:
 * - app.module.ts → Configuración de módulos y conexión a MongoDB
 * - .env → Variables de entorno (PORT, MONGODB_URI, JWT_SECRET)
 *
 * PARA MODIFICAR:
 * - Cambiar puerto: editar .env o el default en la línea 20
 * - Cambiar CORS: modificar app.enableCors() para producción
 * - Agregar middleware: antes de app.listen()
 *
 * ============================================================================
 */
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import * as express from 'express';
import { join } from 'path';

async function bootstrap() {
  // Crear instancia de la aplicación NestJS
  const app = await NestFactory.create(AppModule);

  // ==========================================================================
  // ARCHIVOS ESTÁTICOS - Uploads
  // ==========================================================================
  // Los archivos subidos por usuarios se sirven públicamente en /uploads
  // Acceso: http://192.168.68.115:3000uploads/[nombre-archivo]
  // Usado por: Módulo Uploads (backen_cerebro/src/Modules/Uploads/)
  app.use('/uploads', express.static(join(process.cwd(), 'uploads')));

  // ==========================================================================
  // PREFIJO GLOBAL DE API
  // ==========================================================================
  // Todos los endpoints tendrán prefijo /api
  // Ejemplo: /api/auth/login, /api/users, /api/ticket-it
  app.setGlobalPrefix('api');

  // ==========================================================================
  // CONFIGURACIÓN DEL SERVIDOR
  // ==========================================================================
  // Obtiene el puerto desde variables de entorno (.env)
  // Default: 3000 si no está configurado
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') || 3000;

  // ==========================================================================
  // VALIDACIÓN AUTOMÁTICA DE REQUESTS
  // ==========================================================================
  // Valida automáticamente los DTOs con decoradores class-validator
  // - whitelist: true → Ignora propiedades no definidas en DTO
  // - forbidNonWhitelisted: true → Rechaza requests con propiedades extra
  // - transform: true → Transforma tipos automáticamente (string → number, etc.)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // ==========================================================================
  // CORS - Comunicación con Frontend
  // ==========================================================================
  // Configuración para permitir el dominio de Cloudflared del frontend
  app.enableCors({
    origin: [
      'https://pressing-shaped-alleged-plastics.trycloudflare.com',
      'http://localhost:5173',
      'http://localhost:3000',
      'http://localhost:3001',
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  // ==========================================================================
  // INICIAR SERVIDOR
  // ==========================================================================
  // Escucha en todas las interfaces de red (0.0.0.0) para acceso desde móvil
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
