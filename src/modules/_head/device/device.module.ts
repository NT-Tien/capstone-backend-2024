import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeviceService } from './device.service';
import { DeviceEntity } from 'src/entities/device.entity';
import { AuthModule } from 'src/modules/auth/auth.module';
import { DeviceController } from './device.controller';

@Module({
  imports: [TypeOrmModule.forFeature([DeviceEntity]), AuthModule],
  controllers: [DeviceController],
  providers: [DeviceService],
})
export class DeviceModule {}
