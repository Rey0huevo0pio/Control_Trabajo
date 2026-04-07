import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersController } from '../../Controllers/Usuarios/users.controller';
import { UsersService } from '../Users/users.service';
import { Usuario, UsuarioSchema } from '../../Models/Usuarios/usuario.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Usuario.name, schema: UsuarioSchema }]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsuariosModule {}
