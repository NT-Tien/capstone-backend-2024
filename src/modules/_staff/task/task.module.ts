import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { AuthModule } from 'src/modules/auth/auth.module';
import { TaskEntity } from 'src/entities/task.entity';
import { IssueSparePartEntity } from 'src/entities/issue-spare-part.entity';
import { AccountEntity } from 'src/entities/account.entity';
import { IssueEntity } from 'src/entities/issue.entity';
import { SparePartEntity } from 'src/entities/spare-part.entity';
import { RequestEntity } from 'src/entities/request.entity';
import { NotifyModule } from 'src/modules/notify/notify.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TaskEntity,
      IssueEntity,
      IssueSparePartEntity,
      SparePartEntity,
      AccountEntity,
      RequestEntity,
    ]),
    AuthModule,
    NotifyModule
  ],
  controllers: [TaskController],
  providers: [TaskService],
})
export class TaskModule {}
