import { BaseDB, CommonFail, CommonSuccess } from '../../../common/types';

export type ChatMessageNew = {
  dialogId: string;
  text: string;
  userId: string;
  isChanged: boolean;
  file?: string;
  images?: string[];
};

export type ChatMessage = ChatMessageNew & BaseDB;

export type MessageResponse =
  | ({ chatMessage: ChatMessage } & CommonSuccess)
  | CommonFail;
