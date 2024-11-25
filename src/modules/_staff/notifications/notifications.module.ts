import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountEntity } from 'src/entities/account.entity';
import { NotificationEntity } from 'src/entities/notification.entity';
import { NotificationsController } from 'src/modules/_staff/notifications/notifications.controller';
import { NotificationsService } from 'src/modules/_staff/notifications/notifications.service';

@Module({
  controllers: [NotificationsController],
  providers: [NotificationsService],
  imports: [TypeOrmModule.forFeature([NotificationEntity, AccountEntity])],
})
export class Staff_NotificationsModule {}
