import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import {
  CreateChatSTVDto,
  UpdateChatSTVDto,
  CreateChatGrupoDto,
  UpdateChatGrupoDto,
  CreateChatPrivadoDto,
  MensajeGrupoDto,
  MensajePrivadoDto,
} from './dto/chat.dto';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  // ==================== CHAT GENERAL (STV) ====================

  @Post()
  async createMensaje(@Body() createDto: CreateChatSTVDto) {
    return this.chatService.createMensaje(createDto);
  }

  @Get()
  async findAllMensajes() {
    return this.chatService.findAllMensajes();
  }

  @Get('usuario/:usuarioId')
  async findMensajesByUsuario(
    @Param('usuarioId', ParseUUIDPipe) usuarioId: string,
  ) {
    return this.chatService.findMensajesByUsuario(usuarioId);
  }

  @Get('grupo/:grupoId')
  async findMensajesByGrupo(@Param('grupoId', ParseUUIDPipe) grupoId: string) {
    return this.chatService.findMensajesByGrupo(grupoId);
  }

  @Put(':id')
  async updateMensaje(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDto: UpdateChatSTVDto,
  ) {
    return this.chatService.updateMensaje(id, updateDto);
  }

  @Delete(':id')
  async deleteMensaje(@Param('id', ParseUUIDPipe) id: string) {
    await this.chatService.deleteMensaje(id);
    return { message: 'Mensaje eliminado correctamente' };
  }

  // ==================== CHAT GRUPAL ====================

  @Post('grupo')
  async createChatGrupo(@Body() createDto: CreateChatGrupoDto) {
    return this.chatService.createChatGrupo(createDto);
  }

  @Get('grupo')
  async findAllGrupos() {
    return this.chatService.findAllGrupos();
  }

  @Get('grupo/:id')
  async findOneGrupo(@Param('id', ParseUUIDPipe) id: string) {
    return this.chatService.findOneGrupo(id);
  }

  @Get('usuario/:usuarioId/grupos')
  async findGruposByUsuario(
    @Param('usuarioId', ParseUUIDPipe) usuarioId: string,
  ) {
    return this.chatService.findGruposByUsuario(usuarioId);
  }

  @Put('grupo/:id')
  async updateGrupo(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDto: UpdateChatGrupoDto,
  ) {
    return this.chatService.updateGrupo(id, updateDto);
  }

  @Delete('grupo/:id')
  async deleteGrupo(@Param('id', ParseUUIDPipe) id: string) {
    await this.chatService.deleteGrupo(id);
    return { message: 'Grupo eliminado correctamente' };
  }

  @Post('grupo/:id/mensaje')
  async addMensajeGrupo(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() mensajeDto: MensajeGrupoDto,
  ) {
    return this.chatService.addMensajeGrupo(id, mensajeDto);
  }

  // ==================== CHAT PRIVADO ====================

  @Post('privado')
  async createChatPrivado(@Body() createDto: CreateChatPrivadoDto) {
    return this.chatService.createChatPrivado(createDto);
  }

  @Get('privado')
  async findAllChatsPrivados() {
    return this.chatService.findAllChatsPrivados();
  }

  @Get('privado/usuarios/:usuarioAId/:usuarioBId')
  async findChatPrivadoEntreUsuarios(
    @Param('usuarioAId', ParseUUIDPipe) usuarioAId: string,
    @Param('usuarioBId', ParseUUIDPipe) usuarioBId: string,
  ) {
    return this.chatService.findChatPrivadoEntreUsuarios(
      usuarioAId,
      usuarioBId,
    );
  }

  @Get('privado/usuario/:usuarioId')
  async findChatsPrivadosByUsuario(
    @Param('usuarioId', ParseUUIDPipe) usuarioId: string,
  ) {
    return this.chatService.findChatsPrivadosByUsuario(usuarioId);
  }

  @Post('privado/:id/mensaje')
  async addMensajePrivado(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() mensajeDto: MensajePrivadoDto,
  ) {
    return this.chatService.addMensajePrivado(id, mensajeDto);
  }

  @Post('privado/:id/leidos')
  async markMensajesLeidos(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: { usuarioId: string },
  ) {
    return this.chatService.markMensajesLeidos(id, body.usuarioId);
  }

  @Delete('privado/:id')
  async deleteChatPrivado(@Param('id', ParseUUIDPipe) id: string) {
    await this.chatService.deleteChatPrivado(id);
    return { message: 'Chat privado eliminado correctamente' };
  }
}
