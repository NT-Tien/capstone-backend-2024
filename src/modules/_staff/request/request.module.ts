import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RequestEntity } from 'src/entities/request.entity';
import { TaskEntity } from 'src/entities/task.entity';
import { AuthModule } from 'src/modules/auth/auth.module';
import { RequestController } from './request.controller';

@Module({
  controllers: [RequestController],
  imports: [
    TypeOrmModule.forFeature([RequestEntity, TaskEntity]),
    AuthModule,
    // NotifyModule,
  ],
})
export class RequestModule {}
