import { Module } from '@nestjs/common';
import { SimulationController } from './simulation.controller';
import { SimulationService } from './simulation.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RequestEntity } from 'src/entities/request.entity';
import { DeviceEntity } from 'src/entities/device.entity';

@Module({
  controllers: [SimulationController],
  providers: [SimulationService],
  imports: [TypeOrmModule.forFeature([RequestEntity, DeviceEntity])],
})
export class SimulationModule {}
