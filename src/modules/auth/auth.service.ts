import { Injectable } from '@nestjs/common';
import { map } from 'rxjs/operators';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import configuration from '../../config/configuration';
import { HttpException } from '@nestjs/common/exceptions/http.exception';
import { jwtTokenDecode, userInfo } from './interfaces';
import { ConfigService } from '@nestjs/config';
import { TokenService } from './token.service';

@Injectable()
export class AuthService {
  private readonly authUrl: string;
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly tokenService: TokenService,
  ) {
    this.authUrl = configuration().authUrl;
  }

  async getUserInfo(token: string): Promise<userInfo> {
    const userData = this.tokenService.decodeToken(token);
    const isValid = await this.getAuthExist(userData);
    return { userData, isValid };
  }

  private async getAuthExist(
    userData: jwtTokenDecode,
  ): Promise<boolean> | never {
    try {
      return await lastValueFrom(
        this.httpService.post(this.authUrl + '/auth/user-exist', userData).pipe(
          map((response) => {
            return response.data;
          }),
        ),
      );
    } catch (err) {
      throw new HttpException(
        err.response.data.message,
        err.response.data.statusCode,
      );
    }
  }
}
