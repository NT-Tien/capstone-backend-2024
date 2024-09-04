import { Module } from '@nestjs/common';
import { TaskModule } from '../_staff/task/task.module';
import { DeviceModule } from './device/device.module';
import { IssueModule } from './issue/issue.module';

@Module({
  imports: [TaskModule, DeviceModule, IssueModule],
})
export class StaffModule {}
