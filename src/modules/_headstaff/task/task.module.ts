import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountEntity } from 'src/entities/account.entity';
import { DeviceEntity } from 'src/entities/device.entity';
import { ExportWareHouse } from 'src/entities/export-warehouse.entity';
import { IssueEntity } from 'src/entities/issue.entity';
import { RequestEntity } from 'src/entities/request.entity';
import { SparePartEntity } from 'src/entities/spare-part.entity';
import { TaskEntity } from 'src/entities/task.entity';
import { AuthModule } from 'src/modules/auth/auth.module';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { Global_NotificationsModule } from 'src/modules/notifications/notifications.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TaskEntity,
      AccountEntity,
      RequestEntity,
      SparePartEntity,
      DeviceEntity,
      IssueEntity,
      ExportWareHouse,
    ]),
    AuthModule,
    Global_NotificationsModule,
  ],
  controllers: [TaskController],
  providers: [TaskService],
  exports: [TaskService],
})
export class TaskModule {}
