import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GoogleSheetsService } from './google-sheets.service';
import { GoogleSheetsController } from '../../Controllers/A_Compras/google-sheets.controller';
import { GoogleConnection } from '../../Models/PG/google-connection.entity';

@Module({
  imports: [TypeOrmModule.forFeature([GoogleConnection])],
  controllers: [GoogleSheetsController],
  providers: [GoogleSheetsService],
  exports: [GoogleSheetsService],
})
export class A_ComprasModule {}
