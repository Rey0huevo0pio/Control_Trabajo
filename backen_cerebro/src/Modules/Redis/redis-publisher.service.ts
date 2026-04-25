import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisPublisherService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RedisPublisherService.name);
  private client: Redis;
  private isConnected = false;
  private errorLogged = false;

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    this.client = new Redis({
      host: this.configService.get('REDIS_HOST', 'localhost'),
      port: this.configService.get<number>('REDIS_PORT', 6379),
      password: this.configService.get('REDIS_PASSWORD'),
      retryStrategy: (times) => {
        if (times > 3) {
          if (!this.errorLogged) {
            this.logger.warn(
              'Redis no disponible tras 3 intentos. Funcionalidades de pub/sub desactivadas.',
            );
            this.errorLogged = true;
          }
          return null; // Stop retrying
        }
        return Math.min(times * 100, 3000);
      },
      maxRetriesPerRequest: 1,
      enableOfflineQueue: false,
      lazyConnect: true,
    });

    this.client
      .connect()
      .then(() => {
        this.isConnected = true;
        this.logger.log('Redis conectado');
      })
      .catch(() => {
        this.isConnected = false;
        if (!this.errorLogged) {
          this.logger.warn(
            'Redis no disponible. Funcionalidades de pub/sub desactivadas.',
          );
          this.errorLogged = true;
        }
      });

    this.client.on('error', () => {
      // Silenced - already handled above
    });
  }

  async publish(channel: string, payload: object): Promise<void> {
    if (!this.isConnected) return;
    await this.client.publish(channel, JSON.stringify(payload));
  }

  onModuleDestroy() {
    if (this.client) this.client.disconnect();
  }
}
