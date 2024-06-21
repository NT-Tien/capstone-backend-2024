import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AreaEntity } from 'src/entities/area.entity';
import { AuthModule } from 'src/modules/auth/auth.module';
import { IssueService } from './issue.service';
import { IssueEntity } from 'src/entities/issue.entity';
import { IssueController } from './issue.controller';

@Module({
  imports: [TypeOrmModule.forFeature([IssueEntity]), AuthModule],
  controllers: [IssueController],
  providers: [IssueService],
})
export class IssueModule {}
