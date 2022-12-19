import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CommonService } from '../../common/common.service';
import Message from './message.entity';
import { Cache } from 'cache-manager';
import { ChatMessage, ChatMessageNew, MessageResponse } from './interfaces';
import { CommonFail, CommonSuccess } from '../../common/types';
import { DialogMessages, IFetchDialogMessage } from '../dialog/interfaces';
import { ConfigService } from '@nestjs/config';
import { AmqpService } from '../../amqp/amqp.service';
import { DialogService } from '../dialog/dialog.service';

@Injectable()
export class MessageService extends CommonService {
  constructor(
    @InjectRepository(Message) private messageRepository: Repository<Message>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly config: ConfigService,
    private readonly dialogService: DialogService,
    private readonly amqpService: AmqpService,
  ) {
    super(messageRepository);
  }

  async createMessage(request: ChatMessageNew): Promise<MessageResponse> {
    try {
      const chatMessage = await this.save<ChatMessageNew, ChatMessage>(request);

      const { dialog } = await this.dialogService.getDialog(
        chatMessage.dialogId,
      );

      const userMessage = dialog.userIds.find(
        (item) => item !== chatMessage.userId,
      );

      const userOnline = await this.cacheManager.get(userMessage);

      if (!userOnline) {
        await this.amqpService.publish<any>(
          this.config.get('amqp').exchanges.events.name,
          'event.notification-service.newNotification.created',
          'notificationService.NewNotification',
          {
            userId: userMessage,
            type: 'NEW_MESSAGE',
            message: chatMessage.text,
            subjectId: dialog.dealId,
          },
        );
      }

      return {
        isSuccess: true,
        chatMessage,
      };
    } catch (error) {
      return {
        isSuccess: false,
      };
    }
  }

  async updateMessage(request: ChatMessage): Promise<MessageResponse> {
    try {
      const chatMessage = await this.save<ChatMessage, ChatMessage>({
        ...request,
        isChanged: true,
      });

      return {
        isSuccess: true,
        chatMessage,
      };
    } catch (error) {
      return {
        isSuccess: false,
      };
    }
  }

  async deleteMessage(
    request: ChatMessage,
  ): Promise<CommonSuccess | CommonFail> {
    try {
      const { id } = request;
      await this.remove(id);
      return {
        isSuccess: true,
      };
    } catch (error) {
      return {
        isSuccess: false,
      };
    }
  }

  async fetchDialogMessage(
    request: IFetchDialogMessage,
  ): Promise<DialogMessages> {
    const { dialogId, page, perPage } = request;
    const skip = perPage ? perPage * (page - 1) : 1;
    try {
      const [chatMessages, totalCount] =
        await this.findAndCountByCriteria<ChatMessage>({
          where: {
            dialogId,
          },
          order: {
            createdAt: 'ASC',
          },
          ...(page ? { skip } : {}),
          ...(perPage ? { take: perPage } : {}),
        });
      return {
        dialogId,
        chatMessages,
        pageInfo: {
          page,
          perPage,
          totalCount: totalCount,
          totalPageCount: Math.ceil(totalCount / (perPage ? perPage : 1)),
        },
      };
    } catch (error) {
      return {
        dialogId,
        chatMessages: [],
        pageInfo: {
          page,
          perPage,
          totalCount: 0,
          totalPageCount: 0,
        },
      };
    }
  }
}
