import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { PositionController } from './position.controller';
import { PositionService } from './position.service';
import { PositionEntity } from 'src/entities/position.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([PositionEntity]),
    AuthModule,
  ],
  controllers: [PositionController],
  providers: [PositionService],
})
export class PositionModule {}
