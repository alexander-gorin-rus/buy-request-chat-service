import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { HttpModule } from '@nestjs/axios';
import { TokenService } from './token.service';

@Module({
  imports: [HttpModule],
  providers: [TokenService, AuthService],
  exports: [AuthService],
})
export class AuthModule {}
