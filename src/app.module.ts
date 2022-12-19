import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  WinstonModule,
  utilities as nestWinstonModuleUtilities,
} from 'nest-winston';
import * as winston from 'winston';
import configuration from './config/configuration';
import { ChatModule } from './modules/chat/chat.module';
import { CommonModule } from './common/common.module';
import { DialogModule } from './modules/dialog/dialog.module';

const { databaseDefaultConfig, applicationName } = configuration();

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    TypeOrmModule.forRoot({
      ...databaseDefaultConfig,
    }),
    WinstonModule.forRoot({
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.ms(),
            nestWinstonModuleUtilities.format.nestLike(applicationName, {
              prettyPrint: true,
            }),
          ),
        }),
      ],
    }),
    CommonModule,
    ChatModule,
    DialogModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
