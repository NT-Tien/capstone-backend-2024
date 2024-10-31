import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskController } from './task.controller';
import { AuthModule } from 'src/modules/auth/auth.module';
import { TaskService } from './task.service';
import { TaskEntity } from 'src/entities/task.entity';
import { AccountEntity } from 'src/entities/account.entity';
import { RequestEntity } from 'src/entities/request.entity';
import { SparePartEntity } from 'src/entities/spare-part.entity';
import { DeviceEntity } from 'src/entities/device.entity';
import { IssueEntity } from 'src/entities/issue.entity';
import { StaffGateway } from 'src/modules/notify/roles/notify.staff';
import { NotifyModule } from 'src/modules/notify/notify.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TaskEntity,
      AccountEntity,
      RequestEntity,
      SparePartEntity,
      DeviceEntity,
      IssueEntity,
    ]),
    AuthModule,
    NotifyModule
  ],
  controllers: [TaskController],
  providers: [TaskService],
  exports: [TaskService],
})
export class TaskModule {}
