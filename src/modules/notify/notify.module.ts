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
import { HeadStaffNotifyService } from './services/head-staff.notify.service';
import { AccountEntity } from 'src/entities/account.entity';
import { HeadNotifySevice } from './services/head.notify.service';
import { AccountService } from '../_headstaff/account/account.service';
import { StaffNotifyService } from './services/staff.notify.service';

@Module({
  imports: [TypeOrmModule.forFeature([NotifyEntity, AccountEntity]), AuthModule],
  controllers: [NotifyController],
  providers: [
    HeadStaffGateway,
    HeadGateway,
    StaffGateway,
    StockKeeperGateway,
    NotifyService,
    HeadStaffNotifyService,
    HeadNotifySevice,
    AccountService,
    StaffNotifyService,
  ],
  exports: [
    HeadStaffGateway,
    HeadGateway,
    StaffGateway,
    StockKeeperGateway,
    NotifyService,
  ],
})
export class NotifyModule {}
// this.zalopayGateway.server.emit('new-payment', { message: req.body });
