import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { TypeErrorEntity } from 'src/entities/type-error.entity';
import { TypeErrorService } from './type-error.service';
import { TypeErrorController } from './type-error.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([TypeErrorEntity]),
    AuthModule,
  ],
  controllers: [TypeErrorController],
  providers: [TypeErrorService],
})
export class TypeErrorModule {}
