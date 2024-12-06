import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskController } from './notification.controller';
import { AuthModule } from 'src/modules/auth/auth.module';
import { TaskService } from './notification.service';
import { TaskEntity } from 'src/entities/task.entity';
import { AccountEntity } from 'src/entities/account.entity';
import { RequestEntity } from 'src/entities/request.entity';
import { SparePartEntity } from 'src/entities/spare-part.entity';
import { IssueEntity } from 'src/entities/issue.entity';
import { ExportWareHouse } from 'src/entities/export-warehouse.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([TaskEntity, SparePartEntity, IssueEntity, ExportWareHouse]),
    AuthModule,
  ],
  controllers: [TaskController],
  providers: [TaskService],
})
export class TaskModule {}
