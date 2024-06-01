import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeviceService } from './device.service';
import { AuthModule } from '../auth/auth.module';
import { DeviceEntity } from 'src/entities/device.entity';
import { DeviceController } from './device.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([DeviceEntity]),
    AuthModule,
  ],
  controllers: [DeviceController],
  providers: [DeviceService],
})
export class DeviceModule {}
