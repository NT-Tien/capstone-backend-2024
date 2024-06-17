import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/base/service.base';
import { RequestEntity, RequestStatus } from 'src/entities/request.entity';
import { Repository } from 'typeorm';
import { RequestRequestDto } from './dto/request.dto';
import { AccountEntity, Role } from 'src/entities/account.entity';
import { DeviceEntity } from 'src/entities/device.entity';

@Injectable()
export class RequestService extends BaseService<RequestEntity> {
  constructor(
    @InjectRepository(RequestEntity)
    private readonly requestRepository: Repository<RequestEntity>,
    @InjectRepository(AccountEntity)
    private readonly accountRepository: Repository<AccountEntity>,
    @InjectRepository(DeviceEntity)
    private readonly deviceRepository: Repository<DeviceEntity>,
  ) {
    super(requestRepository);
  }

  async customHeadStaffGetAllRequest(userId: string, page: number, limit: number, status: RequestStatus): Promise<[RequestEntity[], number]> {
    var account = await this.accountRepository.findOne({
      where: { id: userId },
    });
    if (!account || account.deletedAt || account.role !== Role.head) {
      throw new HttpException('Account is not valid', HttpStatus.BAD_REQUEST);
    }
    return this.requestRepository.findAndCount({
      where: {
        requester: account,
        status,
        // createdAt: new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000),
      },
      relations: ['device', 'device.area', 'tasks', 'task.fixer', 'requester'],
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  async updateStatus(userId: string, id: string, status: RequestStatus): Promise<RequestEntity> {
    const account = await this.accountRepository.findOne({where: {id: userId}});
    return await this.requestRepository.save({ id, status, checker: account });
  }
}
