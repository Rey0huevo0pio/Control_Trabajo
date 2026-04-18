import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GoogleSheetsController } from './google-sheets.controller';
import { GoogleSheetsService } from './google-sheets.service';
import {
  GoogleConnection,
  GoogleConnectionSchema,
} from '../../Models/T_A_Compras/google-connection.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: GoogleConnection.name, schema: GoogleConnectionSchema },
    ]),
  ],
  controllers: [GoogleSheetsController],
  providers: [GoogleSheetsService],
  exports: [GoogleSheetsService],
})
export class A_ComprasModule {}
