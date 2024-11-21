import { Module } from '@nestjs/common';
import { RequestModule } from './request/request.module';
import { DeviceModule } from './device/device.module';
import { NotificationsModule } from 'src/modules/_head/notifications/notifications.module';

@Module({
  imports: [RequestModule, DeviceModule, NotificationsModule],
})
export class HeadModule {}
