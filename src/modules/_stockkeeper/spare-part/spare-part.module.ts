import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SparePartController } from './spare-part.controller';
import { SparePartEntity } from 'src/entities/spare-part.entity';
import { SparePartService } from './spare-part.service';
import { AuthModule } from 'src/modules/auth/auth.module';
import { TaskEntity } from 'src/entities/task.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SparePartEntity, TaskEntity]), AuthModule],
  controllers: [SparePartController],
  providers: [SparePartService],
})
export class SparePartModule {}
