import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import {
  CreateUsuarioDto,
  UpdateUsuarioDto,
  LoginUsuarioDto,
} from './dto/usuario.dto';

@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  // ==================== USUARIOS ====================

  @Post()
  async createUsuario(@Body() createDto: CreateUsuarioDto) {
    return this.usuariosService.createUsuario(createDto);
  }

  @Get()
  async findAllUsuarios() {
    return this.usuariosService.findAllUsuarios();
  }

  @Get(':id')
  async findOneUsuario(@Param('id', ParseUUIDPipe) id: string) {
    return this.usuariosService.findOneUsuario(id);
  }

  @Get('numero-control/:numeroControl')
  async findByNumeroControl(@Param('numeroControl') numeroControl: string) {
    return this.usuariosService.findByNumeroControl(numeroControl);
  }

  @Put(':id')
  async updateUsuario(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDto: UpdateUsuarioDto,
  ) {
    return this.usuariosService.updateUsuario(id, updateDto);
  }

  @Delete(':id')
  async deleteUsuario(@Param('id', ParseUUIDPipe) id: string) {
    await this.usuariosService.deleteUsuario(id);
    return { message: 'Usuario eliminado correctamente' };
  }

  // ==================== BÚSQUEDAS ESPECÍFICAS ====================

  @Get('instalacion/:instalacionId')
  async findUsuariosByInstalacion(
    @Param('instalacionId', ParseUUIDPipe) instalacionId: string,
  ) {
    return this.usuariosService.findUsuariosByInstalacion(instalacionId);
  }

  @Get('area/:areaId')
  async findUsuariosByArea(@Param('areaId', ParseUUIDPipe) areaId: string) {
    return this.usuariosService.findUsuariosByArea(areaId);
  }

  @Get('soporte-it')
  async findSoporteIT() {
    return this.usuariosService.findSoporteIT();
  }

  // ==================== AUTENTICACIÓN ====================

  @Post('login')
  async login(@Body() loginDto: LoginUsuarioDto) {
    const usuario = await this.usuariosService.validateUser(loginDto);
    if (!usuario) {
      return { message: 'Credenciales inválidas' };
    }
    return { usuario };
  }
}
