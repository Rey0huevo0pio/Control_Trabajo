import {
  Controller,
  Post,
  Get,
  Delete,
  Patch,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { GoogleSheetsService } from './google-sheets.service';
import { AuthGuard } from '@nestjs/passport';

class SaveConnectionDto {
  email: string;
  accessToken: string;
  refreshToken?: string;
  tokenExpiry?: string;
  nombre?: string;
  scope?: string;
  areasAsignadas?: string[];
}

class ConnectionStatusResponse {
  connected: boolean;
  email?: string;
  nombre?: string;
  accessToken?: string;
  scope?: string;
  areasAsignadas?: string[];
  ultimoAcceso?: Date;
}

@Controller('api/google-sheets')
@UseGuards(AuthGuard('jwt'))
export class GoogleSheetsController {
  constructor(private readonly googleSheetsService: GoogleSheetsService) {}

  @Post('connect')
  async saveConnection(@Request() req, @Body() dto: SaveConnectionDto) {
    const usuarioId = req.user?.userId || req.user?.sub;
    return this.googleSheetsService.saveConnection(
      usuarioId,
      dto.email,
      dto.accessToken,
      dto.refreshToken,
      dto.tokenExpiry ? new Date(dto.tokenExpiry) : undefined,
      dto.nombre,
      dto.scope,
      dto.areasAsignadas,
    );
  }

  @Get('status')
  async getConnectionStatus(@Request() req): Promise<ConnectionStatusResponse> {
    const usuarioId = req.user?.userId || req.user?.sub;
    return this.googleSheetsService.getConnectionStatus(usuarioId);
  }

  @Post('token')
  async updateToken(
    @Request() req,
    @Body()
    body: { accessToken: string; refreshToken?: string; tokenExpiry?: string },
  ) {
    const usuarioId = req.user?.userId || req.user?.sub;
    return this.googleSheetsService.updateToken(
      usuarioId,
      body.accessToken,
      body.refreshToken,
      body.tokenExpiry ? new Date(body.tokenExpiry) : undefined,
    );
  }

  @Patch('areas')
  async updateAreas(
    @Request() req,
    @Body() body: { areasAsignadas: string[] },
  ) {
    const usuarioId = req.user?.userId || req.user?.sub;
    return this.googleSheetsService.updateAreas(usuarioId, body.areasAsignadas);
  }

  @Delete('disconnect')
  async deleteConnection(@Request() req) {
    const usuarioId = req.user?.userId || req.user?.sub;
    return this.googleSheetsService.deleteConnection(usuarioId);
  }
}
