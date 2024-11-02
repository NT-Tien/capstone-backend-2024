import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RequestService } from './request.service';
import { RequestEntity } from 'src/entities/request.entity';
import { RequestController } from './request.controller';
import { AccountEntity } from 'src/entities/account.entity';
import { DeviceEntity } from 'src/entities/device.entity';
import { AuthModule } from 'src/modules/auth/auth.module';
import { NotifyEntity } from 'src/entities/notify.entity';
import { NotifyModule } from 'src/modules/notify/notify.module';
import { IssueEntity } from 'src/entities/issue.entity';
import { TaskEntity } from 'src/entities/task.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      RequestEntity,
      AccountEntity,
      DeviceEntity,
      IssueEntity,
      TaskEntity,
      NotifyEntity,
    ]),
    AuthModule,
    NotifyModule
  ],
  controllers: [RequestController],
  providers: [RequestService],
  exports: [RequestService],
})
export class RequestModule {}
