import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationController } from './notification.controller';
import { AuthModule } from 'src/modules/auth/auth.module';
import { NotificationService } from './notification.service';
import { TaskEntity } from 'src/entities/task.entity';
import { AccountEntity } from 'src/entities/account.entity';
import { RequestEntity } from 'src/entities/request.entity';
import { SparePartEntity } from 'src/entities/spare-part.entity';
import { IssueEntity } from 'src/entities/issue.entity';
import { ExportWareHouse } from 'src/entities/export-warehouse.entity';
import { NotificationEntity } from 'src/entities/notification.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([TaskEntity, SparePartEntity, IssueEntity, ExportWareHouse,NotificationEntity, AccountEntity,RequestEntity]),
    AuthModule,
  ],
  controllers: [NotificationController],
  providers: [NotificationService],
})
export class NotificationModule {}
