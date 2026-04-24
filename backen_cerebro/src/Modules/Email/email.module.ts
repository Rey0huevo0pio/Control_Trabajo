import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailController } from '../../Controllers/Email/email.controller';
import { EmailService } from './email.service';
import { EmailConfig } from '../../Models/PG/email-config.entity';
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
  imports: [TypeOrmModule.forFeature([EmailConfig])],
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
