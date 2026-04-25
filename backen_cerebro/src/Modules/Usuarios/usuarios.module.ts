import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from '../../Controllers/Usuarios/users.controller';
import { UsersService } from '../Users/users.service';
import { Usuario } from '../../Models/PG/usuario.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Usuario])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsuariosModule {}
