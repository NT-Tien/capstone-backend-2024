import { Module } from '@nestjs/common';
import { ExportWareHouseModule } from './export-warehouse/export.module';
import { IssueModule } from './issue/issue.module';
import { MachineModelModule } from './machine-model/machine-model.module';
import { SparePartModule } from './spare-part/spare-part.module';
import { StaffRequestChangeSparePartModule } from './staff-request-change-spare-part/staff-request-change-spare-part.module';
import { TaskModule } from './task/task.module';
import { DeviceModule } from 'src/modules/_stockkeeper/device/device.module';
import { NotificationModule } from './notification/notification.module';

@Module({
  imports: [
    MachineModelModule,
    SparePartModule,
    TaskModule,
    StaffRequestChangeSparePartModule,
    IssueModule,
    ExportWareHouseModule,
    DeviceModule,
    NotificationModule
  ],
})
export class StockkeeperModule {}
