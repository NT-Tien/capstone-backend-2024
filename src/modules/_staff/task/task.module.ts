import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountEntity } from 'src/entities/account.entity';
import { ExportWareHouse } from 'src/entities/export-warehouse.entity';
import { IssueSparePartEntity } from 'src/entities/issue-spare-part.entity';
import { IssueEntity } from 'src/entities/issue.entity';
import { RequestEntity } from 'src/entities/request.entity';
import { SparePartEntity } from 'src/entities/spare-part.entity';
import { TaskEntity } from 'src/entities/task.entity';
import { AuthModule } from 'src/modules/auth/auth.module';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { Global_NotificationsModule } from 'src/modules/notifications/notifications.module';
import { DeviceWarrantyCardEntity } from 'src/entities/device-warranty-card.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TaskEntity,
      IssueEntity,
      IssueSparePartEntity,
      SparePartEntity,
      AccountEntity,
      RequestEntity,
      ExportWareHouse,
      DeviceWarrantyCardEntity,
    ]),
    AuthModule,
    Global_NotificationsModule,
    // NotifyModule
  ],
  controllers: [TaskController],
  providers: [TaskService],
})
export class TaskModule {}
