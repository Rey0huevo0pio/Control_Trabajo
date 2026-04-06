import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  Query,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
  Req,
} from '@nestjs/common';
import { EmailService } from '../../Modules/Email/email.service';
import {
  CreateEmailConfigDto,
  UpdateEmailConfigDto,
  TestEmailConnectionDto,
  SendEmailDto,
  GetEmailsDto,
} from '../../DTOs/email.dto';
import { JwtAuthGuard } from '../../Guards/jwt-auth.guard';

@Controller('email')
@UseGuards(JwtAuthGuard)
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  // ==========================================
  // CREAR CONFIGURACIÓN PARA OTRO USUARIO (Admin)
  // ==========================================
  @Post('config/user/:userId')
  @HttpCode(HttpStatus.CREATED)
  createConfigForUser(
    @Req() req: any,
    @Param('userId') userId: string,
    @Body() createDto: CreateEmailConfigDto,
  ) {
    console.log('\n📧 [EmailController] POST config/user/:userId');
    console.log('🔑 Admin ID:', req.user.userId);
    console.log('🎯 Target userId:', userId);
    return this.emailService.createConfig(userId, createDto);
  }

  // ==========================================
  // CREAR CONFIGURACIÓN DE CORREO (Usuario actual)
  // ==========================================
  @Post('config')
  @HttpCode(HttpStatus.CREATED)
  createConfig(@Req() req: any, @Body() createDto: CreateEmailConfigDto) {
    return this.emailService.createConfig(req.user.userId, createDto);
  }

  // ==========================================
  // OBTENER CONFIGURACIÓN
  // ==========================================
  @Get('config')
  getConfig(@Req() req: any) {
    return this.emailService.getConfigByUsuario(req.user.userId);
  }

  // ==========================================
  // OBTENER CONFIGURACIÓN POR ID DE USUARIO (Admin)
  // ==========================================
  @Get('config/user/:userId')
  getConfigByUser(@Req() req: any, @Param('userId') userId: string) {
    console.log('\n📧 [EmailController] GET config/user/:userId');
    console.log('🔑 User ID from token:', req.user.userId);
    console.log('🎯 Requested userId:', userId);
    return this.emailService.getConfigByUsuario(userId);
  }

  // ==========================================
  // LISTAR TODAS LAS CONFIGURACIONES (Admin - Debug)
  // ==========================================
  @Get('configs')
  @UseGuards(JwtAuthGuard)
  getAllConfigs(@Req() req: any) {
    console.log('\n📧 [EmailController] GET configs (todas)');
    return this.emailService.getAllConfigs();
  }

  // ==========================================
  // ACTUALIZAR CONFIGURACIÓN
  // ==========================================
  @Patch('config')
  updateConfig(@Req() req: any, @Body() updateDto: UpdateEmailConfigDto) {
    return this.emailService.updateConfig(req.user.userId, updateDto);
  }

  // ==========================================
  // PROBAR CONEXIÓN
  // ==========================================
  @Post('config/test')
  testConnection(@Req() req: any, @Body() testDto: TestEmailConnectionDto) {
    return this.emailService.testConnection(req.user.userId, testDto);
  }

  // ==========================================
  // ACTIVAR CONFIGURACIÓN SIN PROBAR (Manual)
  // ==========================================
  @Post('config/activate-force')
  @HttpCode(HttpStatus.OK)
  async activateConfigForce(@Req() req: any) {
    console.log('\n📧 [EmailController] POST config/activate-force');
    const result = await this.emailService.activateConfigForce(req.user.userId);
    return result;
  }

  // ==========================================
  // ACTIVAR CONFIGURACIÓN
  // ==========================================
  @Post('config/activate')
  activateConfig(@Req() req: any) {
    return this.emailService.activateConfig(req.user.userId);
  }

  // ==========================================
  // OBTENER CORREOS
  // ==========================================
  @Get('messages')
  getEmails(@Req() req: any, @Query() getEmailsDto: GetEmailsDto) {
    return this.emailService.getEmails(req.user.userId, getEmailsDto);
  }

  // ==========================================
  // ENVIAR CORREO
  // ==========================================
  @Post('send')
  @HttpCode(HttpStatus.OK)
  sendEmail(@Req() req: any, @Body() sendDto: SendEmailDto) {
    return this.emailService.sendEmail(req.user.userId, sendDto);
  }

  // ==========================================
  // ELIMINAR CONFIGURACIÓN
  // ==========================================
  @Delete('config')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteConfig(@Req() req: any) {
    return this.emailService.deleteConfig(req.user.userId);
  }
}
