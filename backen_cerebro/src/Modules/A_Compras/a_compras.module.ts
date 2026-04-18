import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GoogleSheetsService } from './google-sheets.service';
import { GoogleSheetsController } from '../../Controllers/A_Compras/google-sheets.controller';
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
