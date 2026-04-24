import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  namespace: '/email',
  cors: {
    origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:5173'],
    credentials: true,
  },
})
export class EmailGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(EmailGateway.name);

  handleConnection(client: Socket) {
    this.logger.log(`Email WS conectado: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Email WS desconectado: ${client.id}`);
  }

  // El cliente se suscribe a su bandeja personal
  @SubscribeMessage('join_inbox')
  handleJoinInbox(
    @MessageBody() data: { userId: string },
    @ConnectedSocket() client: Socket,
  ) {
    client.join(`inbox:${data.userId}`);
    this.logger.log(`Usuario ${data.userId} unido a su inbox`);
    return { ok: true };
  }

  // Notificar a un usuario que tiene un correo nuevo
  notifyNewEmail(userId: string, emailData: object) {
    this.server.to(`inbox:${userId}`).emit('new_email', emailData);
  }

  // Notificar que un correo fue enviado exitosamente
  notifyEmailSent(userId: string, result: object) {
    this.server.to(`inbox:${userId}`).emit('email_sent', result);
  }

  // Notificar error al enviar
  notifyEmailError(userId: string, error: string) {
    this.server.to(`inbox:${userId}`).emit('email_error', { error });
  }
}
