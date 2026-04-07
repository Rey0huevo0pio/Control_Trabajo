/**
 * ============================================================================
 * 🔐 AUTH CONTROLLER - Endpoints de Autenticación
 * ============================================================================
 * 
 * QUÉ HACE ESTE ARCHIVO:
 * - Expone endpoints de registro y login
 * - No requiere autenticación (endpoints públicos)
 * - Delega toda la lógica a AuthService
 * 
 * CONEXIONES:
 * - Service: AuthService (../../Modules/Auth/auth.service.ts)
 * - DTOs: CreateUsuarioDto, LoginDto (../../DTOs/usuario.dto.ts)
 * - Frontend: C_Ticket_Apk_STV/src/services/auth.service.ts
 * 
 * ENDPOINTS:
 * - POST /api/auth/register → Registro de usuario (201)
 * - POST /api/auth/login → Login de usuario (200)
 * 
 * GUARDS: Ninguno (endpoints públicos)
 * 
 * ============================================================================
 */
import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from '../../Modules/Auth/auth.service';
import { CreateUsuarioDto, LoginDto } from '../../DTOs/usuario.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() createUsuarioDto: CreateUsuarioDto) {
    return this.authService.register(createUsuarioDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}
