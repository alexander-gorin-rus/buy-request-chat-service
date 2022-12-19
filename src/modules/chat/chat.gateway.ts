import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { NestGateway } from '@nestjs/websockets/interfaces/nest-gateway.interface';
import { EmitSubscribe, Errors } from './interfaces';
import { ChatService } from './chat.service';
import { ChatMessage, ChatMessageNew } from '../message/interfaces';
import { DialogNew } from '../dialog/interfaces';
import { Server, Socket } from 'socket.io';
import { AuthService } from '../auth/auth.service';
import { CACHE_MANAGER, Inject, Logger } from '@nestjs/common';
import { Cache } from 'cache-manager';
import * as cookie from 'cookie';

@WebSocketGateway({ transports: ['websocket'] })
export class ChatGateway implements NestGateway {
  private readonly logger = new Logger(ChatGateway.name);
  @WebSocketServer()
  server: Server;
  constructor(
    private readonly chatService: ChatService,
    private readonly authService: AuthService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async handleConnection(socket: any) {
    const jsonCookie = cookie.parse(socket.handshake.headers['cookie']);
    const token = jsonCookie.token;

    if (!token) {
      this.logger.log(Errors.EMPTY_TOKEN);
      socket.disconnect();
    }

    const { isValid, userData } = await this.authService.getUserInfo(token);
    await this.cacheManager.set(userData.userId, true);
    if (!isValid) {
      this.logger.log(Errors.INVAlID_AUTH);
      socket.disconnect();
    }
    this.logger.log('Connect' + socket.handshake.query);
  }

  async handleDisconnect(socket: any) {
    const jsonCookie = cookie.parse(socket.handshake.headers['cookie']);
    const token = jsonCookie.token;
    const { userData } = await this.authService.getUserInfo(token);
    await this.cacheManager.del(userData.userId);
    this.logger.log('Disconnect', socket.handshake.query);
  }

  @SubscribeMessage(EmitSubscribe.SERVER_MESSAGE)
  async handleMessage(@MessageBody() data: ChatMessageNew) {
    const { dialogId } = data;
    const request = await this.chatService.sendMessage(data);
    this.server.to(dialogId).emit(EmitSubscribe.CLIENT_MESSAGE, request);
  }

  @SubscribeMessage(EmitSubscribe.SERVER_DIALOG)
  async handleDialog(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: DialogNew,
  ) {
    const dialog = await this.chatService.openDialog(data);
    client.join(dialog.dialogId);
    this.server.to(dialog.dialogId).emit(EmitSubscribe.CLIENT_DIALOG, dialog);
  }

  @SubscribeMessage(EmitSubscribe.SERVER_MESSAGE_DELETE)
  async handleDeleteMessage(@MessageBody() data: ChatMessage) {
    const result = await this.chatService.deleteMessage(data);
    this.server
      .to(data.dialogId)
      .emit(EmitSubscribe.CLIENT_MESSAGE_DELETE, result);
  }

  @SubscribeMessage(EmitSubscribe.SERVER_MESSAGE_EDIT)
  async handleUpdateMessage(@MessageBody() data: ChatMessage) {
    const result = await this.chatService.updateMessage(data);
    this.server
      .to(data.dialogId)
      .emit(EmitSubscribe.SERVER_MESSAGE_EDIT, result);
  }

  @SubscribeMessage(EmitSubscribe.LEAVE_DIALOG)
  async handleDialogLeave(@MessageBody() dialogId: string) {
    this.server.leave(dialogId);
  }
}
