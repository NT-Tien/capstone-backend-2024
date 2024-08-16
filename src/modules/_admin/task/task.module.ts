import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskController } from './task.controller';
import { AuthModule } from 'src/modules/auth/auth.module';
import { TaskService } from './task.service';
import { TaskEntity } from 'src/entities/task.entity';
import { AccountEntity } from 'src/entities/account.entity';
import { RequestEntity } from 'src/entities/request.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TaskEntity, AccountEntity, RequestEntity]), AuthModule],
  controllers: [TaskController],
  providers: [TaskService],
})
export class TaskModule {}
