import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationEntity } from 'src/entities/notification.entity';
import { HeadStaffNotificationGateway } from 'src/modules/notifications/gateways/head-staff.gateway';
import { HeadNotificationGateway } from 'src/modules/notifications/gateways/head.gateway';
import { StaffNotificationGateway } from 'src/modules/notifications/gateways/staff.gateway';
import { NotificationsController } from 'src/modules/notifications/notifications.controller';
import { NotificationsService } from 'src/modules/notifications/notifications.service';

@Module({
  imports: [TypeOrmModule.forFeature([NotificationEntity])],
  controllers: [NotificationsController],
  providers: [
    HeadStaffNotificationGateway,
    HeadNotificationGateway,
    StaffNotificationGateway,
    NotificationsService,
  ],
  exports: [
    HeadStaffNotificationGateway,
    HeadNotificationGateway,
    StaffNotificationGateway,
  ],
})
export class Global_NotificationsModule {}
