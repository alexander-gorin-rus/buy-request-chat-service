import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CommonService } from '../../common/common.service';
import DialogEntity from './dialog.entity';

import { Dialog, DialogNew, DialogResponse } from './interfaces';
import { CommonFail, CommonSuccess } from '../../common/types';

@Injectable()
export class DialogService extends CommonService {
  constructor(
    @InjectRepository(DialogEntity)
    private dialogRepository: Repository<DialogEntity>,
  ) {
    super(dialogRepository);
  }

  async createDialog(request: DialogNew): Promise<DialogResponse> {
    try {
      const dialog = await this.save<DialogNew, Dialog>(request);

      return {
        isSuccess: true,
        dialog,
      };
    } catch (error) {
      return {
        isSuccess: false,
        dialog: null,
      };
    }
  }

  async getDialog(id: string): Promise<DialogResponse> {
    try {
      const dialog = await this.findOne<Dialog>({
        where: {
          id,
        },
      });
      return {
        isSuccess: true,
        dialog,
      };
    } catch (error) {
      return {
        isSuccess: false,
        dialog: null,
      };
    }
  }

  async getDialogByDeal(dealId: string): Promise<DialogResponse> {
    try {
      const dialog = await this.findOne<Dialog>({
        where: {
          dealId,
        },
      });
      if (!dialog) {
        throw new Error();
      }
      return {
        isSuccess: true,
        dialog,
      };
    } catch (error) {
      return {
        isSuccess: false,
        dialog: null,
      };
    }
  }

  async deleteDialog(request: Dialog): Promise<CommonSuccess | CommonFail> {
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
}
