import { Inject, Injectable } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import { HeadStaffNotificationGateway } from '../notifications/gateways/head-staff.gateway';
import { NotificationType } from 'src/entities/notification.entity';

@Injectable()
export class CronJobService {
  constructor(
    private readonly headStaffGateway: HeadStaffNotificationGateway,
  ) {}

  @Interval(60 * 60 * 1000) // Every 60 * 60 seconds
  async checkPayment() {
    // this.headStaffGateway.emit(NotificationType.HM_ASSIGN_TASK)({
    //     receiverId: fixer.id,
    //     taskType: returnValue.type,
    //     fixerDate: returnValue.fixerDate,
    //     taskId: returnValue.id,
    //   }) 
  }
}
