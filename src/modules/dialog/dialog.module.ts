import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DialogService } from './dialog.service';
import Dialog from './dialog.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Dialog])],
  providers: [DialogService],
  exports: [TypeOrmModule, DialogService],
})
export class DialogModule {}
