import { Injectable, Logger } from '@nestjs/common';
import { AmqpConnection, RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { ConsumeMessage, Options } from 'amqplib';
import { AmqpProvider } from './amqp.provider';

@Injectable()
export class AmqpService {
  private readonly logger = new Logger();
  constructor(
    private amqpProvider: AmqpProvider,
    private amqpConnection: AmqpConnection,
  ) {}

  public async publish<D>(
    exchange: string,
    routingKey: string,
    type: string,
    message: D,
    options?: Options.Publish,
  ) {
    try {
      const { message: msg, buffer } = this.amqpProvider.encodeMessage<D>(
        type,
        message,
      );
      this.logger.log(
        `<AMQP Publish message to ${routingKey}> ${JSON.stringify(msg)}`,
      );
      await this.amqpConnection.publish(exchange, routingKey, buffer, options);
    } catch (error) {
      this.logger.error(error);
    }
  }

  @RabbitSubscribe({
    exchange: 'events',
    routingKey: 'test.event.test-service.committed',
    allowNonJsonMessages: true,
  })
  public async pubSubHandler(message: any, amqpMsg: ConsumeMessage) {
    try {
      const msg = this.amqpProvider.decodeMessage(
        'userService.TestEventUserServiceCommitted',
        amqpMsg.content,
      );
      this.logger.log(
        `<AMQP Received message> ${JSON.stringify(msg)} - <CorrelationId - ${
          amqpMsg.properties.correlationId
        }>`,
      );
    } catch (error) {
      this.logger.error(error);
    }
  }
}
