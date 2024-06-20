import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeErrorEntity } from 'src/entities/type-error.entity';
import { TypeErrorService } from './type-error.service';
import { TypeErrorController } from './type-error.controller';
import { AuthModule } from 'src/modules/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([TypeErrorEntity]), AuthModule],
  controllers: [TypeErrorController],
  providers: [TypeErrorService],
})
export class TypeErrorModule {}
