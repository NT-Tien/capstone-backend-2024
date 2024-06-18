import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskController } from './task.controller';
import { AuthModule } from 'src/modules/auth/auth.module';
import { TaskService } from './task.service';
import { TaskEntity } from 'src/entities/task.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TaskEntity]), AuthModule],
  controllers: [TaskController],
  providers: [TaskService],
})
export class TaskModule {}
