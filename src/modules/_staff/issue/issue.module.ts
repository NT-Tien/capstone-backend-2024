import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IssueEntity } from '../../../entities/issue.entity';
import { IssueController } from './issue.controller';
import { IssueService } from './issue.service';

@Module({
  imports: [TypeOrmModule.forFeature([IssueEntity])],
  controllers: [IssueController],
  providers: [IssueService],
})
export class IssueModule {}
