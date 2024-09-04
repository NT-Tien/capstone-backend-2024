import { Module } from '@nestjs/common';
import { MachineModelModule } from './machine-model/machine-model.module';
import { SparePartModule } from './spare-part/spare-part.module';
import { TaskModule } from './task/task.module';

@Module({
  imports: [MachineModelModule, SparePartModule, TaskModule],
})
export class StockkeeperModule {}
