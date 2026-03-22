import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { UsersService } from '../../Modules/Users/users.service';
import { UpdateUsuarioDto } from '../../DTOs/usuario.dto';
import { JwtAuthGuard } from '../../Guards/jwt-auth.guard';
import { RolesGuard } from '../../Guards/roles.guard';
import { PermissionsGuard } from '../../Guards/permissions.guard';
import { Roles } from '../../Guards/decorators';
import { RolUsuario } from '../../Models/Usuarios/usuario.schema';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles(RolUsuario.IT, RolUsuario.RH)
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @Roles(RolUsuario.IT, RolUsuario.RH, RolUsuario.SUPERVISOR)
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @Roles(RolUsuario.IT, RolUsuario.RH)
  update(
    @Param('id') id: string,
    @Body() updateUsuarioDto: UpdateUsuarioDto,
  ) {
    return this.usersService.update(id, updateUsuarioDto);
  }

  @Delete(':id')
  @Roles(RolUsuario.IT)
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
