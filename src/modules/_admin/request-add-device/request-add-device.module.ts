import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/modules/auth/auth.module';
import { RequestAddDeviceController } from './request-add-device.controller';
import { RequestAddDeviceService } from './request-add-device.service';
import { RequestAddDeviceEntity } from 'src/entities/request_add_device';

@Module({
  imports: [TypeOrmModule.forFeature([RequestAddDeviceEntity]), AuthModule],
  controllers: [RequestAddDeviceController],
  providers: [RequestAddDeviceService],
})
export class RequestAddDeviceModule {}
