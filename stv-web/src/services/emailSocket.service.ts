/**
 * emailSocket.service.ts
 *
 * Conexión WebSocket directa Next.js ↔ NestJS para notificaciones de correo.
 * Flujo: NestJS recibe correo → emite evento WS → Next.js lo muestra al instante.
 * NO usa Phoenix. Solo socket.io entre Next.js y NestJS.
 */
import { io, Socket } from 'socket.io-client';
import { API_URL } from '../constants';

type EmailHandler = (data: any) => void;

class EmailSocketService {
  private socket: Socket | null = null;
  private handlers: Map<string, EmailHandler[]> = new Map();

  connect(userId: string): void {
    if (this.socket?.connected) return;

    const wsUrl = API_URL.replace('/api', '');

    this.socket = io(`${wsUrl}/email`, {
      transports: ['websocket'],
      autoConnect: true,
    });

    this.socket.on('connect', () => {
      console.log('[EmailWS] Conectado');
      this.socket!.emit('join_inbox', { userId });
    });

    this.socket.on('disconnect', () => {
      console.log('[EmailWS] Desconectado');
    });

    // Escuchar eventos del servidor
    this.socket.on('new_email', (data) => this.emit('new_email', data));
    this.socket.on('email_sent', (data) => this.emit('email_sent', data));
    this.socket.on('email_error', (data) => this.emit('email_error', data));
  }

  disconnect(): void {
    this.socket?.disconnect();
    this.socket = null;
    this.handlers.clear();
  }

  on(event: 'new_email' | 'email_sent' | 'email_error', handler: EmailHandler): void {
    if (!this.handlers.has(event)) this.handlers.set(event, []);
    this.handlers.get(event)!.push(handler);
  }

  off(event: string, handler: EmailHandler): void {
    const list = this.handlers.get(event) ?? [];
    this.handlers.set(event, list.filter((h) => h !== handler));
  }

  private emit(event: string, data: any): void {
    this.handlers.get(event)?.forEach((h) => h(data));
  }

  isConnected(): boolean {
    return this.socket?.connected ?? false;
  }
}

export const emailSocketService = new EmailSocketService();
export default emailSocketService;
