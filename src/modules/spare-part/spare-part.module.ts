import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { SparePartController } from './spare-part.controller';
import { SparePartEntity } from 'src/entities/spare-part.entity';
import { SparePartService } from './spare-part.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([SparePartEntity]),
    AuthModule,
  ],
  controllers: [SparePartController],
  providers: [SparePartService],
})
export class SparePartModule {}
