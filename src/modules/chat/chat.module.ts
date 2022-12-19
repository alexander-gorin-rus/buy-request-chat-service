import { CacheModule, Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { DialogService } from '../dialog/dialog.service';
import { MessageService } from '../message/message.service';
import { DialogModule } from '../dialog/dialog.module';
import { MessageModule } from '../message/message.module';
import { AmqpService } from '../../amqp/amqp.service';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { AmqpModule } from '../../amqp/amqp.module';
import configuration from '../../config/configuration';
import { AuthModule } from '../auth/auth.module';
import { AuthService } from '../auth/auth.service';
import { HttpModule } from '@nestjs/axios';
import { TokenService } from '../auth/token.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

const { amqp, getCacheConfig } = configuration();

@Module({
  imports: [
    DialogModule,
    MessageModule,
    RabbitMQModule.forRoot(RabbitMQModule, amqp.config),
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getCacheConfig,
    }),
    AmqpModule,
    AuthModule,
    HttpModule,
  ],
  providers: [
    ChatGateway,
    ChatService,
    DialogService,
    AuthService,
    TokenService,
    MessageService,
    AmqpService,
  ],
  exports: [ChatService, DialogModule, MessageModule, AuthModule],
})
export class ChatModule {}
