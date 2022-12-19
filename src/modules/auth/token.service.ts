import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { HttpException } from '@nestjs/common/exceptions/http.exception';
import { ErrorStatusRest } from './interfaces';

@Injectable()
export class TokenService {
  constructor(private readonly configService: ConfigService) {}

  decodeToken(token: string): jwt.JwtPayload | string {
    try {
      jwt.verify(token, this.configService.get('jwtSecretKey'));
      return jwt.decode(token);
    } catch (e) {
      throw new HttpException(ErrorStatusRest.INVALID_SIGN, 401);
    }
  }
}
