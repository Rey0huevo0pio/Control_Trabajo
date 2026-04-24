import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { ChatGrupo } from '../../Models/T_Chat_PG/chat-grupo.entity';
import { MensajeGrupo } from '../../Models/T_Chat_PG/mensaje-grupo.entity';
import { MensajePrivado } from '../../Models/T_Chat_PG/mensaje-privado.entity';
import { RedisModule } from '../Redis/redis.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ChatGrupo, MensajeGrupo, MensajePrivado]),
    RedisModule,
  ],
  controllers: [ChatController],
  providers: [ChatService],
  exports: [ChatService],
})
export class ChatModule {}
