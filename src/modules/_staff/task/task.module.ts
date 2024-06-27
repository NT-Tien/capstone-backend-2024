import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { AuthModule } from 'src/modules/auth/auth.module';
import { TaskEntity } from 'src/entities/task.entity';
import { IssueSparePartEntity } from 'src/entities/issue-spare-part.entity';
import { AccountEntity } from 'src/entities/account.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TaskEntity, AccountEntity]), AuthModule],
  controllers: [TaskController],
  providers: [TaskService],
})
export class TaskModule {}   
