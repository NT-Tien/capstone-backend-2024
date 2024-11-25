import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationEntity } from 'src/entities/notification.entity';
import { HeadStaffNotificationGateway } from 'src/modules/notifications/gateways/head-staff.gateway';
import { HeadNotificationGateway } from 'src/modules/notifications/gateways/head.gateway';
import { StaffNotificationGateway } from 'src/modules/notifications/gateways/staff.gateway';

@Module({
  imports: [TypeOrmModule.forFeature([NotificationEntity])],
  controllers: [],
  providers: [
    HeadStaffNotificationGateway,
    HeadNotificationGateway,
    StaffNotificationGateway,
  ],
  exports: [
    HeadStaffNotificationGateway,
    HeadNotificationGateway,
    StaffNotificationGateway,
  ],
})
export class Global_NotificationsModule {}
