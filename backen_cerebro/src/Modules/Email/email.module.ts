import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EmailController } from '../../Controllers/Email/email.controller';
import { EmailService } from './email.service';
import {
  EmailConfig,
  EmailConfigSchema,
} from '../../Models/Usuarios/email-config.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: EmailConfig.name, schema: EmailConfigSchema },
    ]),
  ],
  controllers: [EmailController],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
