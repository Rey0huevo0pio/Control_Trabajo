import {
  Controller,
  Post,
  Delete,
  Get,
  Body,
  Param,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { UploadsService } from './uploads.service';
import { UploadFileDto, TipoArchivo } from './dto/upload.dto';
import { unlink } from 'fs/promises';
import { join } from 'path';
import type { MulterFile } from './uploads.service';

@Controller('uploads')
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  // ==================== SUBIR ARCHIVO ÚNICO ====================

  @Post('single')
  @UseInterceptors(FileInterceptor('file'))
  async uploadSingleFile(
    @UploadedFile() file: MulterFile,
    @Body() uploadDto: UploadFileDto,
  ) {
    if (!file) {
      throw new BadRequestException('No se proporcionó ningún archivo');
    }

    const result = await this.uploadsService.uploadFile(file, uploadDto);
    return {
      message: 'Archivo subido exitosamente',
      ...result,
    };
  }

  // ==================== SUBIR MÚLTIPLES ARCHIVOS ====================

  @Post('multiple')
  @UseInterceptors(FilesInterceptor('files', 10))
  async uploadMultipleFiles(
    @UploadedFiles() files: MulterFile[],
    @Body() uploadDto: UploadFileDto,
  ) {
    if (!files || files.length === 0) {
      throw new BadRequestException('No se proporcionó ningún archivo');
    }

    const results = await this.uploadsService.uploadMultipleFiles(
      files,
      uploadDto,
    );
    return {
      message: `${results.length} archivos subidos exitosamente`,
      files: results,
    };
  }

  // ==================== SUBIR IMÁGENES DE INSTALACIÓN ====================

  @Post('instalacion')
  @UseInterceptors(FilesInterceptor('imagenes', 5))
  async uploadInstalacionImagenes(
    @UploadedFiles() images: MulterFile[],
    @Body('numero_control') numeroControl: string,
  ) {
    if (!images || !Array.isArray(images) || images.length === 0) {
      throw new BadRequestException('No se proporcionó ninguna imagen');
    }

    const uploadDto: UploadFileDto = {
      numero_control: numeroControl,
      tipo: TipoArchivo.INSTALACION,
    };

    const results = await this.uploadsService.uploadMultipleFiles(
      images,
      uploadDto,
    );
    return {
      message: 'Imágenes de instalación subidas exitosamente',
      files: results,
    };
  }

  // ==================== SUBIR IMÁGENES DE ÁREAS ====================

  @Post('area')
  @UseInterceptors(FilesInterceptor('imagenes', 5))
  async uploadAreaImagenes(
    @UploadedFiles() images: MulterFile[],
    @Body('numero_control') numeroControl: string,
  ) {
    if (!images || !Array.isArray(images) || images.length === 0) {
      throw new BadRequestException('No se proporcionó ninguna imagen');
    }

    const uploadDto: UploadFileDto = {
      numero_control: numeroControl,
      tipo: TipoArchivo.AREA,
    };

    const results = await this.uploadsService.uploadMultipleFiles(
      images,
      uploadDto,
    );
    return {
      message: 'Imágenes de área subidas exitosamente',
      files: results,
    };
  }

  // ==================== SUBIR IMAGEN DE PERFIL ====================

  @Post('perfil')
  @UseInterceptors(FileInterceptor('avatar'))
  async uploadPerfilImagen(
    @UploadedFile() file: MulterFile,
    @Body('numero_control') numeroControl: string,
  ) {
    if (!file) {
      throw new BadRequestException('No se proporcionó ninguna imagen');
    }

    const uploadDto: UploadFileDto = {
      numero_control: numeroControl,
      tipo: TipoArchivo.PERFIL,
    };

    const result = await this.uploadsService.uploadFile(file, uploadDto);
    return {
      message: 'Imagen de perfil subida exitosamente',
      ...result,
    };
  }

  // ==================== SUBIR EVIDENCIA DE TICKET ====================

  @Post('ticket/evidencia')
  @UseInterceptors(FilesInterceptor('evidencia', 10))
  async uploadTicketEvidencia(
    @UploadedFiles() images: MulterFile[],
    @Body('numero_control') numeroControl: string,
  ) {
    if (!images || !Array.isArray(images) || images.length === 0) {
      throw new BadRequestException('No se proporcionó ninguna evidencia');
    }

    const uploadDto: UploadFileDto = {
      numero_control: numeroControl,
      tipo: TipoArchivo.TICKET_EVIDENCIA,
    };

    const results = await this.uploadsService.uploadMultipleFiles(
      images,
      uploadDto,
    );
    return {
      message: 'Evidencia de ticket subida exitosamente',
      files: results,
    };
  }

  // ==================== SUBIR FOTO DE PROBLEMA DE TICKET ====================

  @Post('ticket/problema')
  @UseInterceptors(FilesInterceptor('fotos', 10))
  async uploadTicketProblema(
    @UploadedFiles() images: MulterFile[],
    @Body('numero_control') numeroControl: string,
  ) {
    if (!images || !Array.isArray(images) || images.length === 0) {
      throw new BadRequestException('No se proporcionó ninguna foto');
    }

    const uploadDto: UploadFileDto = {
      numero_control: numeroControl,
      tipo: TipoArchivo.TICKET_PROBLEMA,
    };

    const results = await this.uploadsService.uploadMultipleFiles(
      images,
      uploadDto,
    );
    return {
      message: 'Fotos del problema subidas exitosamente',
      files: results,
    };
  }

  // ==================== SUBIR ARCHIVOS DE CHAT GRUPO ====================

  @Post('chat/grupo/:nombreGrupo')
  @UseInterceptors(FilesInterceptor('archivos', 10))
  async uploadChatGrupo(
    @UploadedFiles() files: MulterFile[],
    @Body('numero_control') numeroControl: string,
    @Param('nombreGrupo') nombreGrupo: string,
  ) {
    if (!files || !Array.isArray(files) || files.length === 0) {
      throw new BadRequestException('No se proporcionó ningún archivo');
    }

    const uploadDto: UploadFileDto = {
      numero_control: numeroControl,
      tipo: TipoArchivo.CHAT_GRUPO,
      subcategoria: nombreGrupo,
    };

    const results = await this.uploadsService.uploadMultipleFiles(
      files,
      uploadDto,
    );
    return {
      message: 'Archivos de chat grupal subidos exitosamente',
      files: results,
    };
  }

  // ==================== SUBIR ARCHIVOS DE CHAT PRIVADO ====================

  @Post('chat/privado/:nombreUsuario')
  @UseInterceptors(FilesInterceptor('archivos', 10))
  async uploadChatPrivado(
    @UploadedFiles() files: MulterFile[],
    @Body('numero_control') numeroControl: string,
    @Param('nombreUsuario') nombreUsuario: string,
  ) {
    if (!files || !Array.isArray(files) || files.length === 0) {
      throw new BadRequestException('No se proporcionó ningún archivo');
    }

    const uploadDto: UploadFileDto = {
      numero_control: numeroControl,
      tipo: TipoArchivo.CHAT_PRIVADO,
      subcategoria: nombreUsuario,
    };

    const results = await this.uploadsService.uploadMultipleFiles(
      files,
      uploadDto,
    );
    return {
      message: 'Archivos de chat privado subidos exitosamente',
      files: results,
    };
  }

  // ==================== ELIMINAR ARCHIVO ====================

  @Delete(':rutaRelativa/:filename')
  async deleteFile(
    @Param('rutaRelativa') rutaRelativa: string,
    @Param('filename') filename: string,
  ) {
    await this.uploadsService.deleteFile(rutaRelativa, filename);

    const rutaCompleta = join(process.cwd(), 'uploads', rutaRelativa, filename);
    await unlink(rutaCompleta);

    return { message: 'Archivo eliminado exitosamente' };
  }

  // ==================== LISTAR ARCHIVOS POR USUARIO ====================

  @Get('usuario/:numeroControl')
  async getFilesByUsuario(@Param('numeroControl') numeroControl: string) {
    const files = await this.uploadsService.getFilesByUsuario(numeroControl);
    return { files };
  }

  // ==================== LISTAR ARCHIVOS POR FECHA ====================

  @Get('usuario/:numeroControl/fecha/:fecha')
  async getFilesByFecha(
    @Param('numeroControl') numeroControl: string,
    @Param('fecha') fecha: string,
  ) {
    const files = await this.uploadsService.getFilesByFecha(
      numeroControl,
      fecha,
    );
    return { files };
  }
}
