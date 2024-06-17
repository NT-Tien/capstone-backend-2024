import { Module } from '@nestjs/common';
import { HeadStaffGateway } from './roles/notify.head-staff';
import { HeadGateway } from './roles/notify.head';
import { StaffGateway } from './roles/notify.staff';
import { StockKeeperGateway } from './roles/notify.stockkeeper';
import { AuthModule } from '../auth/auth.module';
import { NotifyController } from './notify.controller';
import { NotifyService } from './notify.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotifyEntity } from 'src/entities/notify.entity';

@Module({
  imports: [ TypeOrmModule.forFeature([NotifyEntity]),AuthModule],
  controllers: [NotifyController],
  providers: [HeadStaffGateway, HeadGateway, StaffGateway, StockKeeperGateway, NotifyService],
  exports: [HeadStaffGateway, HeadGateway, StaffGateway, StockKeeperGateway],
})
export class NotifyModule {}
// this.zalopayGateway.server.emit('new-payment', { message: req.body });
