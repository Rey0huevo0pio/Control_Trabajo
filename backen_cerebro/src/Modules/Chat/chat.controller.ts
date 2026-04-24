import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import {
  CreateChatGrupoDto,
  UpdateChatGrupoDto,
  MensajeGrupoDto,
  CreateChatPrivadoDto,
  MensajePrivadoDto,
} from './dto/chat.dto';
import { JwtAuthGuard } from '../../Guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  // ==================== GRUPOS ====================

  @Post('grupo')
  createGrupo(@Body() dto: CreateChatGrupoDto) {
    return this.chatService.createGrupo(dto);
  }

  @Get('grupo')
  findAllGrupos() {
    return this.chatService.findAllGrupos();
  }

  @Get('grupo/:id')
  findOneGrupo(@Param('id') id: string) {
    return this.chatService.findOneGrupo(id);
  }

  @Get('grupo/usuario/:usuarioId')
  findGruposByUsuario(@Param('usuarioId') usuarioId: string) {
    return this.chatService.findGruposByUsuario(usuarioId);
  }

  @Put('grupo/:id')
  updateGrupo(@Param('id') id: string, @Body() dto: UpdateChatGrupoDto) {
    return this.chatService.updateGrupo(id, dto);
  }

  @Delete('grupo/:id')
  async deleteGrupo(@Param('id') id: string) {
    await this.chatService.deleteGrupo(id);
    return { message: 'Grupo eliminado' };
  }

  // ==================== MENSAJES GRUPO ====================

  @Post('grupo/:id/mensaje')
  addMensajeGrupo(@Param('id') id: string, @Body() dto: MensajeGrupoDto) {
    return this.chatService.addMensajeGrupo(id, dto);
  }

  @Get('grupo/:id/mensajes')
  getMensajesGrupo(@Param('id') id: string) {
    return this.chatService.getMensajesGrupo(id);
  }

  // ==================== PRIVADO ====================

  @Post('privado')
  createChatPrivado(@Body() dto: CreateChatPrivadoDto) {
    return this.chatService.createChatPrivado(dto);
  }

  @Post('privado/mensaje')
  addMensajePrivado(@Body() dto: MensajePrivadoDto) {
    return this.chatService.addMensajePrivado(dto);
  }

  @Get('privado/:emisorId/:receptorId')
  getMensajesPrivados(
    @Param('emisorId') emisorId: string,
    @Param('receptorId') receptorId: string,
  ) {
    return this.chatService.getMensajesPrivados(emisorId, receptorId);
  }

  @Post('privado/:emisorId/:receptorId/leidos')
  markLeidos(
    @Param('emisorId') emisorId: string,
    @Param('receptorId') receptorId: string,
  ) {
    return this.chatService.markLeidos(emisorId, receptorId);
  }
}
