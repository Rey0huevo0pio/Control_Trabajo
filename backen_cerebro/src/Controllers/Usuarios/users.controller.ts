import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
  Req,
} from '@nestjs/common';
import { UsersService } from '../../Modules/Users/users.service';
import {
  CreateUsuarioDto,
  UpdateUsuarioDto,
  SearchUsuariosDto,
  ChangePasswordDto,
  UpdateProfileDto,
} from '../../DTOs/usuario.dto';
import { JwtAuthGuard } from '../../Guards/jwt-auth.guard';
import { RolesGuard } from '../../Guards/roles.guard';
import { Roles } from '../../Guards/decorators';
import { RolUsuario } from '../../Models/Usuarios/usuario.schema';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // ==========================================
  // CREAR USUARIO
  // ==========================================
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Roles(RolUsuario.IT, RolUsuario.RH, RolUsuario.ADMIN)
  create(@Body() createUsuarioDto: CreateUsuarioDto) {
    return this.usersService.create(createUsuarioDto);
  }

  // ==========================================
  // OBTENER TODOS LOS USUARIOS (con filtros)
  // ==========================================
  @Get()
  @Roles(
    RolUsuario.IT,
    RolUsuario.RH,
    RolUsuario.ADMIN,
    RolUsuario.SUPERVISOR,
  )
  findAll(@Query() searchDto: SearchUsuariosDto, @Req() req: any) {
    console.log('\n📥 [UsersController] GET /api/users');
    console.log('🔑 Authorization header:', req.headers['authorization'] ? '✅ PRESENTE' : '❌ AUSENTE');
    console.log('🔍 Filtros:', searchDto);
    return this.usersService.findAll(searchDto);
  }

  // ==========================================
  // CONTAR USUARIOS
  // ==========================================
  @Get('stats/count')
  @Roles(RolUsuario.IT, RolUsuario.RH, RolUsuario.ADMIN)
  countUsers() {
    return this.usersService.countUsers();
  }

  // ==========================================
  // OBTENER USUARIOS POR ROL
  // ==========================================
  @Get('by-role/:rol')
  @Roles(RolUsuario.IT, RolUsuario.RH, RolUsuario.ADMIN)
  findByRol(@Param('rol') rol: RolUsuario) {
    return this.usersService.findByRol(rol);
  }

  // ==========================================
  // OBTENER USUARIO POR ID
  // ==========================================
  @Get(':id')
  @Roles(
    RolUsuario.IT,
    RolUsuario.RH,
    RolUsuario.ADMIN,
    RolUsuario.SUPERVISOR,
  )
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  // ==========================================
  // ACTUALIZAR USUARIO COMPLETO
  // ==========================================
  @Patch(':id')
  @Roles(RolUsuario.IT, RolUsuario.RH, RolUsuario.ADMIN)
  update(
    @Param('id') id: string,
    @Body() updateUsuarioDto: UpdateUsuarioDto,
  ) {
    return this.usersService.update(id, updateUsuarioDto);
  }

  // ==========================================
  // ACTUALIZAR PERFIL (datos básicos)
  // ==========================================
  @Patch(':id/profile')
  @HttpCode(HttpStatus.OK)
  @Roles(
    RolUsuario.IT,
    RolUsuario.RH,
    RolUsuario.ADMIN,
    RolUsuario.SUPERVISOR,
    RolUsuario.VIGILANTE,
  )
  updateProfile(
    @Param('id') id: string,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    return this.usersService.updateProfile(id, updateProfileDto);
  }

  // ==========================================
  // CAMBIAR PASSWORD
  // ==========================================
  @Post(':id/change-password')
  @HttpCode(HttpStatus.OK)
  @Roles(
    RolUsuario.IT,
    RolUsuario.RH,
    RolUsuario.ADMIN,
    RolUsuario.SUPERVISOR,
    RolUsuario.VIGILANTE,
  )
  changePassword(
    @Param('id') id: string,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    return this.usersService.changePassword(id, changePasswordDto);
  }

  // ==========================================
  // ACTIVAR/DESACTIVAR USUARIO
  // ==========================================
  @Patch(':id/toggle-active')
  @HttpCode(HttpStatus.OK)
  @Roles(RolUsuario.IT, RolUsuario.RH, RolUsuario.ADMIN)
  toggleActive(@Param('id') id: string) {
    return this.usersService.toggleActive(id);
  }

  // ==========================================
  // ACTUALIZAR ÚLTIMO ACCESO
  // ==========================================
  @Post(':id/last-access')
  @HttpCode(HttpStatus.OK)
  updateLastAccess(@Param('id') id: string) {
    return this.usersService.updateLastAccess(id);
  }

  // ==========================================
  // ELIMINAR USUARIO
  // ==========================================
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles(RolUsuario.IT, RolUsuario.ADMIN)
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
