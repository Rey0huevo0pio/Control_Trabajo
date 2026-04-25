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
import { RolUsuario } from '../../Models/PG/usuario.entity';

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
  // OBTENER TODOS LOS USUARIOS (CON BÚSQUEDA)
  // ==========================================
  @Get()
  @Roles(RolUsuario.IT, RolUsuario.RH, RolUsuario.ADMIN, RolUsuario.SUPERVISOR)
  findAll(@Query() searchUsuariosDto?: SearchUsuariosDto) {
    return this.usersService.findAll(searchUsuariosDto);
  }

  // ==========================================
  // OBTENER USUARIO POR ID
  // ==========================================
  @Get(':id')
  @Roles(RolUsuario.IT, RolUsuario.RH, RolUsuario.ADMIN, RolUsuario.SUPERVISOR)
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  // ==========================================
  // ACTUALIZAR USUARIO
  // ==========================================
  @Patch(':id')
  @Roles(RolUsuario.IT, RolUsuario.RH, RolUsuario.ADMIN)
  update(@Param('id') id: string, @Body() updateUsuarioDto: UpdateUsuarioDto) {
    return this.usersService.update(id, updateUsuarioDto);
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

  // ==========================================
  // CAMBIAR CONTRASEÑA
  // ==========================================
  @Patch(':id/password')
  @Roles(RolUsuario.IT, RolUsuario.RH, RolUsuario.ADMIN, RolUsuario.SUPERVISOR)
  changePassword(
    @Param('id') id: string,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    return this.usersService.changePassword(id, changePasswordDto);
  }

  // ==========================================
  // ACTUALIZAR PERFIL PROPIO
  // ==========================================
  @Patch('profile')
  @Roles(
    RolUsuario.IT,
    RolUsuario.RH,
    RolUsuario.ADMIN,
    RolUsuario.SUPERVISOR,
    RolUsuario.VIGILANTE,
  )
  updateProfile(@Req() req: any, @Body() updateProfileDto: UpdateProfileDto) {
    return this.usersService.updateProfile(req.user.id, updateProfileDto);
  }

  // ==========================================
  // ACTUALIZAR ÚLTIMO ACCESO
  // ==========================================
  @Patch(':id/last-access')
  @HttpCode(HttpStatus.NO_CONTENT)
  updateLastAccess(@Param('id') id: string) {
    return this.usersService.updateLastAccess(id);
  }

  // ==========================================
  // CONTAR USUARIOS
  // ==========================================
  @Get('count')
  @Roles(RolUsuario.IT, RolUsuario.RH, RolUsuario.ADMIN)
  countUsers() {
    return this.usersService.countUsers();
  }

  // ==========================================
  // BUSCAR POR ROL
  // ==========================================
  @Get('role/:rol')
  @Roles(RolUsuario.IT, RolUsuario.RH, RolUsuario.ADMIN)
  findByRol(@Param('rol') rol: RolUsuario) {
    return this.usersService.findByRol(rol);
  }

  // ==========================================
  // TOGGLE ESTADO ACTIVO
  // ==========================================
  @Patch(':id/toggle-active')
  @Roles(RolUsuario.IT, RolUsuario.ADMIN)
  toggleActive(@Param('id') id: string) {
    return this.usersService.toggleActive(id);
  }
}
