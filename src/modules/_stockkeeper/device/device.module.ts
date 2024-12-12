import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AreaEntity } from 'src/entities/area.entity';
import { DeviceEntity } from 'src/entities/device.entity';
import { TaskEntity } from 'src/entities/task.entity';
import { DeviceController } from 'src/modules/_stockkeeper/device/device.controller';
import { DeviceService } from 'src/modules/_stockkeeper/device/device.service';

@Module({
  imports: [TypeOrmModule.forFeature([DeviceEntity, AreaEntity, TaskEntity])],
  controllers: [DeviceController],
  providers: [DeviceService],
})
export class DeviceModule {}
