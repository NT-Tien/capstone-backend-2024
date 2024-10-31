import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AccountEntity, Role } from 'src/entities/account.entity';
import { NotifyEntity } from 'src/entities/notify.entity';
import { RequestEntity } from 'src/entities/request.entity';
import { Repository } from 'typeorm';

@Injectable()
export class HeadNotifySevice {
  constructor(
    @InjectRepository(NotifyEntity)
    private readonly notifyRepository: Repository<NotifyEntity>,
    @InjectRepository(AccountEntity)
    private readonly accountRepository: Repository<AccountEntity>,
  ) {}

  async requestApproved(request: RequestEntity, sender: AccountEntity, receiver: AccountEntity, identifier: string) {
    return this.notifyRepository.save({
        type: "request",
        roleReceiver: Role.head,
        receiver,
        fromUser: sender,
        subjectId: request.id,
        identifier,
        content: {
            deviceName: request?.device?.machineModel?.name,
            areaName: request?.device?.area?.name,
        }
    })
  }

  async requestRejected(request: RequestEntity, sender: AccountEntity, receiver: AccountEntity, identifier: string) {
    return this.notifyRepository.save({
        type: "request",
        roleReceiver: Role.head,
        receiver,
        fromUser: sender,
        subjectId: request.id,
        identifier,
        content: {
            deviceName: request?.device?.machineModel?.name,
            areaName: request?.device?.area?.name,
        }
    })
  }
}
