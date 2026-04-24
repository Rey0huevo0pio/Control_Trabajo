import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EmailController } from '../../Controllers/Email/email.controller';
import { EmailService } from './email.service';
import {
  EmailConfig,
  EmailConfigSchema,
} from '../../Models/Usuarios/email-config.schema';
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
import { EmailGateway } from './Gateway/email.gateway';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: EmailConfig.name, schema: EmailConfigSchema },
    ]),
  ],
  controllers: [EmailController],
  providers: [
    EmailService,
    EmailGateway,
    EmailCryptoService,
    EmailConnectionService,
    EmailConfigService,
    EmailCacheService,
    EmailAttachmentService,
    EmailParserService,
    EmailFetcherService,
    EmailSenderService,
  ],
  exports: [EmailService, EmailGateway],
})
export class EmailModule {}
