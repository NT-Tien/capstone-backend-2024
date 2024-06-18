import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AreaService } from './area.service';
import { AreaEntity } from 'src/entities/area.entity';
import { AreaController } from './area.controller';
import { AuthModule } from 'src/modules/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([AreaEntity]), AuthModule],
  controllers: [AreaController],
  providers: [AreaService],
})
export class AreaModule {}
