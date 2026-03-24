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
import { InstalacionesService } from './instalaciones.service';
import {
  CreateInstalacionDto,
  UpdateInstalacionDto,
  CreateAreaInstalacionDto,
  UpdateAreaInstalacionDto,
} from './dto/instalacion.dto';

@Controller('instalaciones')
export class InstalacionesController {
  constructor(private readonly instalacionesService: InstalacionesService) {}

  // ==================== INSTALACIONES ====================

  @Post()
  async createInstalacion(@Body() createDto: CreateInstalacionDto) {
    return this.instalacionesService.createInstalacion(createDto);
  }

  @Get()
  async findAllInstalaciones() {
    return this.instalacionesService.findAllInstalaciones();
  }

  @Get('activas')
  async findActivas() {
    return this.instalacionesService.findActivas();
  }

  @Get(':id')
  async findOneInstalacion(@Param('id', ParseUUIDPipe) id: string) {
    return this.instalacionesService.findOneInstalacion(id);
  }

  @Put(':id')
  async updateInstalacion(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDto: UpdateInstalacionDto,
  ) {
    return this.instalacionesService.updateInstalacion(id, updateDto);
  }

  @Delete(':id')
  async deleteInstalacion(@Param('id', ParseUUIDPipe) id: string) {
    await this.instalacionesService.deleteInstalacion(id);
    return { message: 'Instalación eliminada correctamente' };
  }

  // ==================== ÁREAS DE INSTALACIÓN ====================

  @Post('areas')
  async createAreaInstalacion(@Body() createDto: CreateAreaInstalacionDto) {
    return this.instalacionesService.createAreaInstalacion(createDto);
  }

  @Get('areas')
  async findAllAreas() {
    return this.instalacionesService.findAllAreas();
  }

  @Get('areas/:id')
  async findOneArea(@Param('id', ParseUUIDPipe) id: string) {
    return this.instalacionesService.findOneArea(id);
  }

  @Put('areas/:id')
  async updateArea(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDto: UpdateAreaInstalacionDto,
  ) {
    return this.instalacionesService.updateArea(id, updateDto);
  }

  @Delete('areas/:id')
  async deleteArea(@Param('id', ParseUUIDPipe) id: string) {
    await this.instalacionesService.deleteArea(id);
    return { message: 'Área eliminada correctamente' };
  }

  @Get('instalacion/:instalacionId/areas')
  async findAreasByInstalacion(
    @Param('instalacionId', ParseUUIDPipe) instalacionId: string,
  ) {
    return this.instalacionesService.findAreasByInstalacion(instalacionId);
  }
}
