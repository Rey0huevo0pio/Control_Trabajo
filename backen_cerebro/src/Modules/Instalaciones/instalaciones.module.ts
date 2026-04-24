import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InstalacionesController } from './instalaciones.controller';
import { InstalacionesService } from './instalaciones.service';
import { Instalacion } from '../../Models/PG/instalacion.entity';
import { AreaInstalacion } from '../../Models/PG/area-instalacion.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Instalacion, AreaInstalacion])],
  controllers: [InstalacionesController],
  providers: [InstalacionesService],
  exports: [InstalacionesService],
})
export class InstalacionesModule {}
