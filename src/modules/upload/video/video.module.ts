import { Module } from '@nestjs/common';
import { VideoController } from './video.controller';
import { AuthModule } from 'src/modules/auth/auth.module';

@Module({
  controllers: [VideoController],
})
export class VideoModule {}
