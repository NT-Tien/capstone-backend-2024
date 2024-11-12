import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeviceService } from './device.service';
import { DeviceEntity } from 'src/entities/device.entity';
import { DeviceController } from './device.controller';
import { AuthModule } from 'src/modules/auth/auth.module';
import { MachineModelEntity } from 'src/entities/machine-model.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DeviceEntity, MachineModelEntity]), AuthModule],
  controllers: [DeviceController],
  providers: [DeviceService],
})
export class DeviceModule {}
