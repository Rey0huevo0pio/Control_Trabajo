import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  Query,
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
  // CREAR CONFIGURACIÓN DE CORREO
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
    return this.emailService.getConfigByUsuario(userId);
  }

  // ==========================================
  // ACTUALIZAR CONFIGURACIÓN
  // ==========================================
  @Patch('config')
  updateConfig(
    @Req() req: any,
    @Body() updateDto: UpdateEmailConfigDto,
  ) {
    return this.emailService.updateConfig(req.user.userId, updateDto);
  }

  // ==========================================
  // PROBAR CONEXIÓN
  // ==========================================
  @Post('config/test')
  testConnection(
    @Req() req: any,
    @Body() testDto: TestEmailConnectionDto,
  ) {
    return this.emailService.testConnection(req.user.userId, testDto);
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
