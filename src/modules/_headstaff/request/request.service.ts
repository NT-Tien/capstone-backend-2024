import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/base/service.base';
import { RequestEntity, RequestStatus } from 'src/entities/request.entity';
import { Repository } from 'typeorm';
import { RequestRequestDto } from './dto/request.dto';
import { AccountEntity, Role } from 'src/entities/account.entity';
import { DeviceEntity } from 'src/entities/device.entity';
import { NotifyEntity } from 'src/entities/notify.entity';

@Injectable()
export class RequestService extends BaseService<RequestEntity> {
  constructor(
    @InjectRepository(RequestEntity)
    private readonly requestRepository: Repository<RequestEntity>,
    @InjectRepository(AccountEntity)
    private readonly accountRepository: Repository<AccountEntity>,
    @InjectRepository(DeviceEntity)
    private readonly deviceRepository: Repository<DeviceEntity>,
    @InjectRepository(NotifyEntity)
    private readonly notifyRepository: Repository<NotifyEntity>,
  ) {
    super(requestRepository);
  }

  async customHeadStaffGetAllRequest(userId: string, page: number, limit: number, status: RequestStatus): Promise<[RequestEntity[], number]> {
    var account = await this.accountRepository.findOne({
      where: { id: userId },
    });
    if (!account || account.deletedAt || account.role !== Role.headstaff) {
      throw new HttpException('Account is not valid', HttpStatus.BAD_REQUEST);
    }
    return this.requestRepository.findAndCount({
      where: {
        status: status ? status : undefined,
      },
      relations: ['device', 'device.area', 'tasks', 'tasks.fixer', 'requester'],
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  async customHeadStaffGetOneRequest(userId: string, id: string): Promise<RequestEntity> {
    var account = await this.accountRepository.findOne({
      where: { id: userId },
    });
    if (!account || account.deletedAt || account.role !== Role.head) {
      throw new HttpException('Account is not valid', HttpStatus.BAD_REQUEST);
    }

    // update status notify
    await this.notifyRepository.update({
      requestId: id,
    }, {
      status: true,
    });
    return this.requestRepository.findOne({
      where: { id, requester: account },
      relations: ['device', 'device.area', 'tasks', 'tasks.fixer', 'requester'],
    });
  }

  async updateStatus(userId: string, id: string, status: RequestStatus): Promise<RequestEntity> {
    const account = await this.accountRepository.findOne({where: {id: userId}});
    return await this.requestRepository.save({ id, status, checker: account });
  }
}
