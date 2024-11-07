import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IssueEntity } from '../../../entities/issue.entity';
import { IssueController } from './issue.controller';
import { IssueService } from './issue.service';
import { TaskEntity } from 'src/entities/task.entity';

@Module({
  imports: [TypeOrmModule.forFeature([IssueEntity, TaskEntity])],
  controllers: [IssueController],
  providers: [IssueService],
})
export class IssueModule {}
