import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AreaEntity } from 'src/entities/area.entity';
import { AuthModule } from 'src/modules/auth/auth.module';
import { StaffRequestChangeSparePartController } from './staff-request-change-spare-part.controller';
import { StaffRequestChangeSparePartSerivce } from './staff-request-change-spare-part.service';
import { StaffRequestChangeSparePartEntity } from 'src/entities/staff_request_change_spare_part.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StaffRequestChangeSparePartEntity]), AuthModule],
  controllers: [StaffRequestChangeSparePartController],
  providers: [StaffRequestChangeSparePartSerivce],
})
export class StaffRequestChangeSparePartModule {}
