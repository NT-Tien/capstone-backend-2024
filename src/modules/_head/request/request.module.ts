import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RequestService } from './request.service';
import { RequestEntity } from 'src/entities/request.entity';
import { RequestController } from './request.controller';
import { AccountEntity } from 'src/entities/account.entity';
import { DeviceEntity } from 'src/entities/device.entity';
import { AuthModule } from 'src/modules/auth/auth.module';
import { NotifyModule } from 'src/modules/notify/notify.module';
import { FeedbackEntity } from '../../../entities/feedback.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      RequestEntity,
      AccountEntity,
      DeviceEntity,
      FeedbackEntity,
    ]),
    AuthModule,
    NotifyModule,
  ],
  controllers: [RequestController],
  providers: [RequestService],
})
export class RequestModule {}
