import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/modules/auth/auth.module';
import { IssueService } from './issue.service';
import { IssueEntity } from 'src/entities/issue.entity';
import { IssueController } from './issue.controller';
import { IssueSparePartEntity } from 'src/entities/issue-spare-part.entity';
import { IssueSparePartController } from './issue-spare-part.controller';
import { IssueSparePartService } from './issue-spare-part.service';

@Module({
  imports: [TypeOrmModule.forFeature([IssueEntity, IssueSparePartEntity]), AuthModule],
  controllers: [IssueController, IssueSparePartController],
  providers: [IssueService, IssueSparePartService],
})
export class IssueModule {}
