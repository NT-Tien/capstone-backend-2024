import { Module } from '@nestjs/common';
import { MachineModelModule } from './machine-model/machine-model.module';
import { DeviceModule } from './device/device.module';
import { SparePartModule } from './spare-part/spare-part.module';
import { TypeErrorModule } from './type-error/type-error.module';
import { AreaModule } from './area/area.module';
import { TypeErrorHeadModule } from './type-error-head/type-error-head.module';

@Module({
  imports: [
    AreaModule,
    MachineModelModule,
    DeviceModule,
    SparePartModule,
    TypeErrorModule,
    TypeErrorHeadModule,
  ],
})
export class AdminModule {}
