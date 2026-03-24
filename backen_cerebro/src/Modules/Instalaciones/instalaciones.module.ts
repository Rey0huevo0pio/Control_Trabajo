import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { InstalacionesController } from './instalaciones.controller';
import { InstalacionesService } from './instalaciones.service';
import {
  Instalacion,
  InstalacionSchema,
  AreaInstalacion,
  AreaInstalacionSchema,
} from '../../Models/T_Instalaciones';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Instalacion.name, schema: InstalacionSchema },
      { name: AreaInstalacion.name, schema: AreaInstalacionSchema },
    ]),
  ],
  controllers: [InstalacionesController],
  providers: [InstalacionesService],
  exports: [InstalacionesService, MongooseModule],
})
export class InstalacionesModule {}
