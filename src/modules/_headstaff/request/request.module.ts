import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountEntity } from 'src/entities/account.entity';
import { DeviceEntity } from 'src/entities/device.entity';
import { IssueSparePartEntity } from 'src/entities/issue-spare-part.entity';
import { IssueEntity } from 'src/entities/issue.entity';
import { RequestEntity } from 'src/entities/request.entity';
import { SparePartEntity } from 'src/entities/spare-part.entity';
import { TaskEntity } from 'src/entities/task.entity';
import { TypeErrorEntity } from 'src/entities/type-error.entity';
import { AuthModule } from 'src/modules/auth/auth.module';
import { RequestController } from './request.controller';
import { RequestService } from './request.service';
import { Global_NotificationsModule } from 'src/modules/notifications/notifications.module';
import { ExportWareHouse } from 'src/entities/export-warehouse.entity';
import { MachineModelEntity } from 'src/entities/machine-model.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      RequestEntity,
      AccountEntity,
      DeviceEntity,
      IssueEntity,
      TaskEntity,
      SparePartEntity,
      TypeErrorEntity,
      IssueSparePartEntity,
      ExportWareHouse,
      MachineModelEntity
    ]),
    AuthModule,
    Global_NotificationsModule,
    // NotifyModule,
  ],
  controllers: [RequestController],
  providers: [RequestService],
  exports: [RequestService],
})
export class RequestModule {}
