import { Module } from '@nestjs/common';
import { TaskModule } from '../_staff/task/task.module';
import { DeviceModule } from './device/device.module';
import { IssueModule } from './issue/issue.module';
import { StaffRequestChangeSparePartModule } from './staff-request-change-spare-part/staff-request-change-spare-part.module';
import { RequestModule } from './request/request.module';
import { ExportWareHouseModule } from './export-warehouse/export.module';
import { NotificationsModule } from 'src/modules/_staff/notifications/notifications.module';

@Module({
  imports: [
    TaskModule,
    DeviceModule,
    IssueModule,
    StaffRequestChangeSparePartModule,
    RequestModule,
    ExportWareHouseModule,
    NotificationsModule,
  ],
})
export class StaffModule {}
