import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IssueEntity } from 'src/entities/issue.entity';
import { SparePartEntity } from 'src/entities/spare-part.entity';
import { TaskEntity } from 'src/entities/task.entity';
import { ExportWareHouseController } from './export.controller';
import { ExportWareHouseService } from './export.service';
import { ExportWareHouse } from 'src/entities/export-warehouse.entity';
import { MachineModelEntity } from 'src/entities/machine-model.entity';
import { DeviceEntity } from 'src/entities/device.entity';
import { Global_NotificationsModule } from 'src/modules/notifications/notifications.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TaskEntity,
      SparePartEntity,
      IssueEntity,
      ExportWareHouse,
      MachineModelEntity,
      DeviceEntity,
    ]),
    Global_NotificationsModule,
  ],
  controllers: [ExportWareHouseController],
  providers: [ExportWareHouseService],
})
export class ExportWareHouseModule {}
