import { Module } from '@nestjs/common';
import { ImageController } from './image.controller';
import { AuthModule } from 'src/modules/auth/auth.module';

@Module({
  controllers: [ImageController],
})
export class ImageModule {}
