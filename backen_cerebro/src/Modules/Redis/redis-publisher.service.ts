import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisPublisherService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RedisPublisherService.name);
  private client: Redis;

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    this.client = new Redis({
      host: this.configService.get('REDIS_HOST', 'localhost'),
      port: this.configService.get<number>('REDIS_PORT', 6379),
      password: this.configService.get('REDIS_PASSWORD'),
    });
    this.client.on('connect', () => this.logger.log('Redis conectado'));
    this.client.on('error', (err) => this.logger.error('Redis error:', err));
  }

  async publish(channel: string, payload: object): Promise<void> {
    await this.client.publish(channel, JSON.stringify(payload));
  }

  onModuleDestroy() {
    this.client.disconnect();
  }
}
