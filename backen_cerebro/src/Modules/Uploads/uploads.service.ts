import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { existsSync, mkdirSync, renameSync } from 'fs';
import { join, resolve } from 'path';
import { UploadFileDto, TipoArchivo } from './dto/upload.dto';

export interface MulterFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  filename: string;
  path: string;
  size: number;
}

@Injectable()
export class UploadsService {
  private readonly uploadsDir = resolve(process.cwd(), 'uploads');

  // ==================== MÉTODOS AUXILIARES ====================

  private ensureDirectoryExists(dirPath: string): void {
    if (!existsSync(dirPath)) {
      mkdirSync(dirPath, { recursive: true });
    }
  }

  private getRutaBase(numeroControl: string, fecha: string): string {
    return join(this.uploadsDir, numeroControl, fecha);
  }

  private getRutaPorTipo(
    rutaBase: string,
    tipo: TipoArchivo,
    subcategoria?: string,
  ): string {
    let ruta = rutaBase;

    switch (tipo) {
      case TipoArchivo.INSTALACION:
        ruta = join(ruta, 'instalaciones', 'imagen_instalacion');
        break;
      case TipoArchivo.AREA:
        ruta = join(ruta, 'instalaciones', 'imagen_areas');
        break;
      case TipoArchivo.CHAT_GRUPO:
        if (!subcategoria) {
          throw new BadRequestException(
            'La subcategoria (nombre del grupo) es requerida para chat de grupos',
          );
        }
        ruta = join(ruta, 'chat', 'imagen_grupos', subcategoria);
        break;
      case TipoArchivo.CHAT_PRIVADO:
        if (!subcategoria) {
          throw new BadRequestException(
            'La subcategoria (nombre del usuario) es requerida para chat privado',
          );
        }
        ruta = join(ruta, 'chat', 'imagen_privados', subcategoria);
        break;
      case TipoArchivo.PERFIL:
        ruta = join(ruta, 'usuario', 'imagen_perfil');
        break;
      case TipoArchivo.TICKET_EVIDENCIA:
        ruta = join(ruta, 'Tickets_IT', 'Tickets_evidencia_solucionado');
        break;
      case TipoArchivo.TICKET_PROBLEMA:
        ruta = join(ruta, 'Tickets_IT', 'Tickets_plobrema_solucionar');
        break;
      default:
        throw new BadRequestException(
          `Tipo de archivo no válido: ${String(tipo)}`,
        );
    }

    return ruta;
  }

  private getURLPublica(rutaRelativa: string, filename: string): string {
    return `/uploads/${rutaRelativa}/${filename}`;
  }

  // ==================== SUBIR ARCHIVOS ====================

  async uploadFile(
    file: MulterFile,
    uploadDto: UploadFileDto,
  ): Promise<{ url: string; ruta: string; filename: string }> {
    try {
      const fecha = new Date().toISOString().split('T')[0]; // Formato: YYYY-MM-DD
      const rutaBase = this.getRutaBase(uploadDto.numero_control, fecha);
      const rutaDestino = this.getRutaPorTipo(
        rutaBase,
        uploadDto.tipo,
        uploadDto.subcategoria,
      );

      // Asegurar que el directorio existe
      this.ensureDirectoryExists(rutaDestino);

      // Mover el archivo a la ruta de destino
      const rutaFinal = join(rutaDestino, file.filename);
      renameSync(file.path, rutaFinal);

      // Generar URL relativa desde la carpeta uploads
      const rutaRelativa = join(
        uploadDto.numero_control,
        fecha,
        this.getRutaRelativaPorTipo(uploadDto.tipo, uploadDto.subcategoria),
      );

      return {
        url: this.getURLPublica(rutaRelativa, file.filename),
        ruta: rutaFinal,
        filename: file.filename,
      };
    } catch (error) {
      throw new BadRequestException(`Error al subir archivo: ${error.message}`);
    }
  }

  private getRutaRelativaPorTipo(
    tipo: TipoArchivo,
    subcategoria?: string,
  ): string {
    switch (tipo) {
      case TipoArchivo.INSTALACION:
        return join('instalaciones', 'imagen_instalacion');
      case TipoArchivo.AREA:
        return join('instalaciones', 'imagen_areas');
      case TipoArchivo.CHAT_GRUPO:
        if (!subcategoria) {
          throw new BadRequestException(
            'La subcategoria (nombre del grupo) es requerida para chat de grupos',
          );
        }
        return join('chat', 'imagen_grupos', subcategoria);
      case TipoArchivo.CHAT_PRIVADO:
        if (!subcategoria) {
          throw new BadRequestException(
            'La subcategoria (nombre del usuario) es requerida para chat privado',
          );
        }
        return join('chat', 'imagen_privados', subcategoria);
      case TipoArchivo.PERFIL:
        return join('usuario', 'imagen_perfil');
      case TipoArchivo.TICKET_EVIDENCIA:
        return join('Tickets_IT', 'Tickets_evidencia_solucionado');
      case TipoArchivo.TICKET_PROBLEMA:
        return join('Tickets_IT', 'Tickets_plobrema_solucionar');
      default:
        throw new BadRequestException(
          `Tipo de archivo no válido: ${String(tipo)}`,
        );
    }
  }

  async uploadMultipleFiles(
    files: MulterFile[],
    uploadDto: UploadFileDto,
  ): Promise<{ url: string; ruta: string; filename: string }[]> {
    const results: { url: string; ruta: string; filename: string }[] = [];
    for (const file of files) {
      const result = await this.uploadFile(file, uploadDto);
      results.push(result);
    }
    return results;
  }

  // ==================== ELIMINAR ARCHIVOS ====================

  async deleteFile(rutaRelativa: string, filename: string): Promise<void> {
    try {
      const rutaCompleta = join(this.uploadsDir, rutaRelativa, filename);

      // Verificar si el archivo existe
      if (!existsSync(rutaCompleta)) {
        throw new NotFoundException(`Archivo no encontrado: ${rutaCompleta}`);
      }

      // Eliminar el archivo (fs.unlink se usa en el controller)
      // Aquí solo validamos que exista
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(
        `Error al eliminar archivo: ${error.message}`,
      );
    }
  }

  // ==================== OBTENER ARCHIVOS ====================

  async getFilesByUsuario(numeroControl: string): Promise<string[]> {
    const usuarioDir = join(this.uploadsDir, numeroControl);

    if (!existsSync(usuarioDir)) {
      return [];
    }

    // Implementar lógica para listar archivos recursivamente
    // Por ahora retornamos un array vacío
    return [];
  }

  async getFilesByFecha(
    numeroControl: string,
    fecha: string,
  ): Promise<string[]> {
    const fechaDir = join(this.uploadsDir, numeroControl, fecha);

    if (!existsSync(fechaDir)) {
      return [];
    }

    // Implementar lógica para listar archivos
    return [];
  }
}
