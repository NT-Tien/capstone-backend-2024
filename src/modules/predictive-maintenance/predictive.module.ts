import { Module } from '@nestjs/common';
import { PredictiveService } from './predictive.service';
import { PredictiveScheduleService } from './predictive.schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeviceEntity } from 'src/entities/device.entity';
import { SparePartEntity } from 'src/entities/spare-part.entity';
import { MachineModelModule } from '../_admin/machine-model/machine-model.module';
import { RequestEntity } from 'src/entities/request.entity';
import { TaskEntity } from 'src/entities/task.entity';

@Module({
  providers: [PredictiveService, PredictiveScheduleService],
  controllers: [],
  imports: [
    TypeOrmModule.forFeature([
      DeviceEntity,
      SparePartEntity,
      MachineModelModule,
      RequestEntity,
      TaskEntity,
    ]),
  ],
  exports: [],
})
export class PredictiveModule {}
