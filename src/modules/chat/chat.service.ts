import { Injectable } from '@nestjs/common';
import { MessageService } from '../message/message.service';
import { DialogService } from '../dialog/dialog.service';
import {
  ChatMessage,
  ChatMessageNew,
  MessageResponse,
} from '../message/interfaces';
import { DialogMessages, DialogNew } from '../dialog/interfaces';
import { WsException } from '@nestjs/websockets';
import { CommonFail, CommonSuccess } from '../../common/types';

@Injectable()
export class ChatService {
  constructor(
    private readonly messageService: MessageService,
    private readonly dialogService: DialogService,
  ) {}

  async sendMessage(request: ChatMessageNew): Promise<MessageResponse> {
    const { isSuccess } = await this.dialogService.getDialog(request.dialogId);
    if (isSuccess) {
      return await this.messageService.createMessage(request);
    }
    throw new WsException('CREATE DIALOG');
  }

  async openDialog(request: DialogNew): Promise<DialogMessages> {
    const { userIds, dealId } = request;
    const dialog = await this.dialogService.getDialogByDeal(dealId);
    if (dialog.isSuccess) {
      return await this.messageService.fetchDialogMessage({
        ...request,
        dialogId: dialog.dialog.id,
      });
    }
    return await this.createDialog({ userIds, dealId });
  }

  private async createDialog(request: DialogNew): Promise<DialogMessages> {
    const newDialog = await this.dialogService.createDialog(request);
    if (newDialog.isSuccess) {
      return await this.messageService.fetchDialogMessage({
        dialogId: newDialog.dialog.id,
      });
    }
  }

  async updateMessage(request: ChatMessage): Promise<MessageResponse> {
    return await this.messageService.updateMessage(request);
  }

  async deleteMessage(
    request: ChatMessage,
  ): Promise<CommonSuccess | CommonFail> {
    return await this.messageService.deleteMessage(request);
  }
}
