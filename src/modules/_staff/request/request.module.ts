import { Module } from '@nestjs/common';
import { RequestController } from './request.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RequestEntity } from 'src/entities/request.entity';
import { AuthModule } from 'src/modules/auth/auth.module';
import { NotifyModule } from 'src/modules/notify/notify.module';
import { TaskEntity } from 'src/entities/task.entity';

@Module({
  controllers: [RequestController],
  imports: [
    TypeOrmModule.forFeature([RequestEntity, TaskEntity]),
    AuthModule,
    // NotifyModule,
  ],
})
export class RequestModule {}
