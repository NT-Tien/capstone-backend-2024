import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountEntity } from 'src/entities/account.entity';
import { DeviceEntity } from 'src/entities/device.entity';
import { RequestEntity } from 'src/entities/request.entity';
import { AuthModule } from 'src/modules/auth/auth.module';
import { Global_NotificationsModule } from 'src/modules/notifications/notifications.module';
import { FeedbackEntity } from '../../../entities/feedback.entity';
import { RequestController } from './request.controller';
import { RequestService } from './request.service';
import { SequenceModule } from 'src/common/sequence/sequence.module';
import { RequestTimeline } from 'src/entities/request-timeline.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      RequestEntity,
      AccountEntity,
      DeviceEntity,
      FeedbackEntity,
      RequestTimeline
    ]),
    AuthModule,
    Global_NotificationsModule,
    SequenceModule,
    // NotifyModule,
  ],
  controllers: [RequestController],
  providers: [RequestService],
})
export class RequestModule {}
