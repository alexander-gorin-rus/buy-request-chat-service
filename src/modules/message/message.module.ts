import { CacheModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageService } from './message.service';
import Message from './message.entity';
import configuration from '../../config/configuration';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { AmqpModule } from '../../amqp/amqp.module';
import { AmqpService } from '../../amqp/amqp.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DialogService } from '../dialog/dialog.service';
import { DialogModule } from '../dialog/dialog.module';

const { amqp, getCacheConfig } = configuration();

@Module({
  imports: [
    TypeOrmModule.forFeature([Message]),
    RabbitMQModule.forRoot(RabbitMQModule, amqp.config),
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getCacheConfig,
    }),
    AmqpModule,
    DialogModule,
  ],
  providers: [MessageService, ConfigService, AmqpService, DialogService],
  exports: [TypeOrmModule, MessageService],
})
export class MessageModule {}
