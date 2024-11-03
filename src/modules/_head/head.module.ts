import { Module } from '@nestjs/common';
import { RequestModule } from './request/request.module';
import { DeviceModule } from './device/device.module';

@Module({
  imports: [RequestModule, DeviceModule],
})
export class HeadModule {}
