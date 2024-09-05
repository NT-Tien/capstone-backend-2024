import { Module } from '@nestjs/common';
import { RequestModule } from './request/request.module';
import { TaskModule } from './task/task.module';
import { AccountModule } from './account/account.module';
import { DeviceModule } from './device/device.module';
import { IssueModule } from './issue/issue.module';
import { HeadStaffDashboardController } from './headstaff.controller';

@Module({
  imports: [
    RequestModule,
    TaskModule,
    AccountModule,
    DeviceModule,
    IssueModule,
  ],
  controllers: [HeadStaffDashboardController],  
})
export class HeadstaffModule {}
