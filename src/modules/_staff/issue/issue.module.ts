import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IssueEntity } from '../../../entities/issue.entity';
import { IssueController } from './issue.controller';
import { IssueService } from './issue.service';
import { TaskEntity } from 'src/entities/task.entity';
import { ExportWareHouse } from 'src/entities/export-warehouse.entity';
import { AccountEntity } from 'src/entities/account.entity';
import { RequestEntity } from 'src/entities/request.entity';
import { DeviceEntity } from 'src/entities/device.entity';
import { DeviceWarrantyCardEntity } from 'src/entities/device-warranty-card.entity';
import { Global_NotificationsModule } from 'src/modules/notifications/notifications.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      IssueEntity,
      TaskEntity,
      ExportWareHouse,
      AccountEntity,
      RequestEntity,
      DeviceEntity,
      DeviceWarrantyCardEntity,
    ]),
    Global_NotificationsModule,
  ],
  controllers: [IssueController],
  providers: [IssueService],
})
export class IssueModule {}
