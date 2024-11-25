import { Module } from '@nestjs/common';
import { RequestModule } from './request/request.module';
import { DeviceModule } from './device/device.module';
import { Head_NotificationsModule } from 'src/modules/_head/notifications/notifications.module';

@Module({
  imports: [RequestModule, DeviceModule, Head_NotificationsModule],
})
export class HeadModule {}
