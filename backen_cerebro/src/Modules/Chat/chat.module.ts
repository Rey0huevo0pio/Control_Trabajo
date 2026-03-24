import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import {
  ChatSTV,
  ChatSTVSchema,
  ChatGrupo,
  ChatGrupoSchema,
  ChatPrivado,
  ChatPrivadoSchema,
} from '../../Models/T_Chat_STV';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ChatSTV.name, schema: ChatSTVSchema },
      { name: ChatGrupo.name, schema: ChatGrupoSchema },
      { name: ChatPrivado.name, schema: ChatPrivadoSchema },
    ]),
  ],
  controllers: [ChatController],
  providers: [ChatService],
  exports: [ChatService, MongooseModule],
})
export class ChatModule {}
