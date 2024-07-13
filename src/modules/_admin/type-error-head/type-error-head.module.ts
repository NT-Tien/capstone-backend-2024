import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeErrorHeadEntity } from 'src/entities/type-error-head.entity';
import { TypeErrorHeadController } from './type-error-head.controller';
import { TypeErrorHeadService } from './type-error-head.service';

@Module({
  imports: [TypeOrmModule.forFeature([TypeErrorHeadEntity])],
  controllers: [TypeErrorHeadController],
  providers: [TypeErrorHeadService],
})
export class TypeErrorHeadModule {}
