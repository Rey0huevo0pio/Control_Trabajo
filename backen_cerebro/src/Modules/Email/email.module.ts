import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EmailController } from '../../Controllers/Email/email.controller';
import { EmailService } from './email.service';
import {
  EmailConfig,
  EmailConfigSchema,
} from '../../Models/Usuarios/email-config.schema';
// Importar servicios de Components_Service
import {
  EmailCryptoService,
  EmailConnectionService,
  EmailConfigService,
  EmailCacheService,
  EmailAttachmentService,
  EmailParserService,
  EmailFetcherService,
  EmailSenderService,
} from './Components_Service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: EmailConfig.name, schema: EmailConfigSchema },
    ]),
  ],
  controllers: [EmailController],
  providers: [
    EmailService,
    // Servicios de Components_Service
    EmailCryptoService,
    EmailConnectionService,
    EmailConfigService,
    EmailCacheService,
    EmailAttachmentService,
    EmailParserService,
    EmailFetcherService,
    EmailSenderService,
  ],
  exports: [EmailService],
})
export class EmailModule {}
