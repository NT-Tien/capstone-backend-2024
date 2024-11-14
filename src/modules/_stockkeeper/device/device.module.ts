import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeviceEntity } from 'src/entities/device.entity';
import { DeviceController } from 'src/modules/_stockkeeper/device/device.controller';
import { DeviceService } from 'src/modules/_stockkeeper/device/device.service';

@Module({
  imports: [TypeOrmModule.forFeature([DeviceEntity])],
  controllers: [DeviceController],
  providers: [DeviceService],
})
export class DeviceModule {}
