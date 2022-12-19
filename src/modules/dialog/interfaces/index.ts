import {
  BaseDB,
  CommonFail,
  CommonSuccess,
  IPageInfo,
} from '../../../common/types';
import { ChatMessage } from '../../message/interfaces';

export type DialogNew = {
  userIds: string[];
  dealId: string;
  page?: number;
  perPage?: number;
};

export type Dialog = DialogNew & BaseDB;

export type DialogMessages =
  | {
      dialogId: string;
      chatMessages: ChatMessage[];
      pageInfo: IPageInfo;
    }
  | {
      chatMessages: [];
      dialogId: string;
      pageInfo: IPageInfo;
    };

export type IFetchDialogMessage = {
  dialogId: string;
  page?: number;
  perPage?: number;
};

export type openDialog = Partial<DialogNew> & Partial<IFetchDialogMessage>;

export type DialogResponse =
  | ({ dialog: Dialog } & CommonSuccess)
  | ({ dialog: null } & CommonFail);
