export interface BaseDB {
  readonly id: string;
  createdAt: string;
  updatedAt: string;
}

export interface IPageInfo {
  page: number;
  perPage: number;
  totalCount: number;
  totalPageCount: number;
}

export interface CommonSuccess {
  isSuccess: true;
}

export interface CommonFail {
  isSuccess: false;
}
