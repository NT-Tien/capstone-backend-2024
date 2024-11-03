import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AccountEntity, Role } from 'src/entities/account.entity';
import { NotifyEntity, NotifyType } from 'src/entities/notify.entity';
import { RequestEntity } from 'src/entities/request.entity';
import { TaskEntity } from 'src/entities/task.entity';
import { Repository } from 'typeorm';

@Injectable()
export class HeadStaffNotifyService {
  constructor(
    @InjectRepository(NotifyEntity)
    private readonly notifyRepository: Repository<NotifyEntity>,
    @InjectRepository(AccountEntity)
    private readonly accountRepository: Repository<AccountEntity>,
  ) {}

  async getHeadStaffAccount() {
    return this.accountRepository.findOne({
      where: {
        role: Role.headstaff,
      },
    });
  }

  async getAccountById(id: string) {
    return this.accountRepository.findOne({
      where: {
        id,
      },
    });
  }

  async requestCreated(
    request: RequestEntity,
    sender: AccountEntity,
    receiver: AccountEntity,
    identifier: string,
  ) {
    const content = {
      areaName: request?.device?.area?.name,
      deviceName: request?.device?.machineModel?.name,
    };

    return this.notifyRepository.save({
      content,
      type: NotifyType.REQUEST,
      receiver,
      fromUser: sender,
      roleReceiver: Role.headstaff,
      subjectId: request.id,
      identifier,
    });
  }

  async taskStarted(
    task: TaskEntity,
    sender: AccountEntity,
    receiver: AccountEntity,
    identifier: string,
  ) {
    const content = {
      areaName: task?.device?.area?.name,
      deviceName: task?.device?.machineModel?.name,
      requestId: task?.id,
      taskName: task?.name,
    };

    return this.notifyRepository.save({
      content,
      type: NotifyType.TASK,
      receiver,
      fromUser: sender,
      roleReceiver: Role.headstaff,
      subjectId: task.id,
      identifier,
    });
  }
}
