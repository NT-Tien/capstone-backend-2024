import { Module } from '@nestjs/common';
import { RequestModule } from './request/request.module';
import { TaskModule } from './task/task.module';
import { AccountModule } from './account/account.module';
import { DeviceModule } from './device/device.module';
import { IssueModule } from './issue/issue.module';
import { HeadStaffDashboardController } from './headstaff.controller';
import { TypeErrorModule } from './type-error/type-error.module';
import { RequestAddDeviceModule } from './request-add-device/request-add-device.module';
import { NotificationsModule } from 'src/modules/_headstaff/notifications/notifications.module';

@Module({
  imports: [
    RequestModule,
    TaskModule,
    AccountModule,
    DeviceModule,
    IssueModule,
    TypeErrorModule,
    RequestAddDeviceModule,
    NotificationsModule,
  ],
  controllers: [HeadStaffDashboardController],
})
export class HeadstaffModule {}
