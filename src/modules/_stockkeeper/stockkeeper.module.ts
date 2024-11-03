import { Module } from '@nestjs/common';
import { MachineModelModule } from './machine-model/machine-model.module';
import { SparePartModule } from './spare-part/spare-part.module';
import { TaskModule } from './task/task.module';
import { StaffRequestChangeSparePartModule } from './staff-request-change-spare-part/staff-request-change-spare-part.module';
import { IssueModule } from './issue/issue.module';
import { ExportWareHouseModule } from './export-warehouse/export.module';

@Module({
  imports: [
    MachineModelModule, 
    SparePartModule, 
    TaskModule, 
    StaffRequestChangeSparePartModule,
     IssueModule,
     ExportWareHouseModule,
    ],
})
export class StockkeeperModule {}
