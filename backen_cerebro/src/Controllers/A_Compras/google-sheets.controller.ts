import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  SaveGoogleConnectionDto,
  UpdateGoogleAreasDto,
  UpdateGoogleTokenDto,
} from '../../DTOs/google-sheets.dto';
import { GoogleSheetsService } from '../../Modules/A_Compras/google-sheets.service';

class ConnectionStatusResponse {
  connected: boolean;
  email?: string;
  nombre?: string;
  accessToken?: string;
  scope?: string;
  areasAsignadas?: string[];
  ultimoAcceso?: Date;
}

@Controller('google-sheets')
@UseGuards(AuthGuard('jwt'))
export class GoogleSheetsController {
  constructor(private readonly googleSheetsService: GoogleSheetsService) {}

  @Post('connect')
  async saveConnection(@Request() req, @Body() dto: SaveGoogleConnectionDto) {
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
  async updateToken(@Request() req, @Body() dto: UpdateGoogleTokenDto) {
    const usuarioId = req.user?.userId || req.user?.sub;
    return this.googleSheetsService.updateToken(
      usuarioId,
      dto.accessToken,
      dto.refreshToken,
      dto.tokenExpiry ? new Date(dto.tokenExpiry) : undefined,
    );
  }

  @Post('areas')
  async updateAreas(@Request() req, @Body() dto: UpdateGoogleAreasDto) {
    const usuarioId = req.user?.userId || req.user?.sub;
    return this.googleSheetsService.updateAreas(usuarioId, dto.areasAsignadas);
  }

  @Delete('disconnect')
  async deleteConnection(@Request() req) {
    const usuarioId = req.user?.userId || req.user?.sub;
    return this.googleSheetsService.deleteConnection(usuarioId);
  }
}
