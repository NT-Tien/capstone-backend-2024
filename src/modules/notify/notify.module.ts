import { Module } from '@nestjs/common';
import { HeadStaffGateway } from './roles/notify.head-staff';
import { HeadGateway } from './roles/notify.head';
import { StaffGateway } from './roles/notify.staff';
import { StockKeeperGateway } from './roles/notify.stockkeeper';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  providers: [HeadStaffGateway, HeadGateway, StaffGateway, StockKeeperGateway],
  exports: [HeadStaffGateway, HeadGateway, StaffGateway, StockKeeperGateway],
})
export class NotifyModule {}
// this.zalopayGateway.server.emit('new-payment', { message: req.body });
