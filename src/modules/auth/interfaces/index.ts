export interface IJwtItem {
  key: string;
  value: any;
}

export type IJwtCustomParams = Array<IJwtItem>;

export enum ErrorStatusRest {
  USER_EXIST = 'USER_EXIST',
  USER_NOT_EXIST = 'USER_NOT_EXIST',
  PASSWORD_ERROR = 'PASSWORD_ERROR',
  INVALID_SIGN = 'INVALID SIGNATURE JWT',
}

export interface IUserLoginOutput {
  token?: string;
  error?: ErrorStatusRest;
}

export interface BaseAuth {
  email: string;
  password: string;
}

export type userInfo = { isValid: boolean; userData?: jwtTokenDecode };

export type jwtTokenDecode = {
  email: string;
  userId: string;
  clientAccountId: string;
};
