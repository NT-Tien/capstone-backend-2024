import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { MachineModelController } from './machine-model.controller';
import { MachineModelService } from './machine-model.service';
import { MachineModelEntity } from 'src/entities/machine-model.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([MachineModelEntity]),
    AuthModule,
  ],
  controllers: [MachineModelController],
  providers: [MachineModelService],
})
export class MachineModelModule {}
