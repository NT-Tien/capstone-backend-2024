import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MachineModelController } from './machine-model.controller';
import { MachineModelService } from './machine-model.service';
import { MachineModelEntity } from 'src/entities/machine-model.entity';
import { DeviceEntity } from 'src/entities/device.entity';
import { AuthModule } from 'src/modules/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([MachineModelEntity]), AuthModule],
  controllers: [MachineModelController],
  providers: [MachineModelService],
})
export class MachineModelModule {}
