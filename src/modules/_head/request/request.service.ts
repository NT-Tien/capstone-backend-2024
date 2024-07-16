import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/base/service.base';
import { RequestEntity, RequestStatus } from 'src/entities/request.entity';
import { Between, Repository } from 'typeorm';
import { RequestRequestDto } from './dto/request.dto';
import { AccountEntity, Role } from 'src/entities/account.entity';
import { DeviceEntity } from 'src/entities/device.entity';
import { HeadStaffGateway } from 'src/modules/notify/roles/notify.head-staff';
import { NotifyService } from 'src/modules/notify/notify.service';

@Injectable()
export class RequestService extends BaseService<RequestEntity> {
  constructor(
    @InjectRepository(RequestEntity)
    private readonly requestRepository: Repository<RequestEntity>,
    @InjectRepository(AccountEntity)
    private readonly accountRepository: Repository<AccountEntity>,
    @InjectRepository(DeviceEntity)
    private readonly deviceRepository: Repository<DeviceEntity>,
    private readonly headStaffGateWay: HeadStaffGateway,
    private readonly notifyService: NotifyService,
  ) {
    super(requestRepository);
  }

  async customHeadGetAllRequest(userId: string): Promise<RequestEntity[]> {
    let account = await this.accountRepository.findOne({
      where: { id: userId },
    });
    if (!account || account.deletedAt || account.role !== Role.head) {
      throw new HttpException('Account is not valid', HttpStatus.BAD_REQUEST);
    }
    return this.requestRepository.createQueryBuilder('request')
      .leftJoinAndSelect('request.requester', 'requester')
      .leftJoinAndSelect('request.device', 'device')
      .leftJoinAndSelect('device.area', 'area')
      .leftJoinAndSelect('device.machineModel', 'machineModel')
      .leftJoinAndSelect('request.tasks', 'tasks')
      .leftJoinAndSelect('request.checker', 'checker')
      .where('requester.deletedAt is null')
      .andWhere('requester.id = :id', { id: userId })
      .andWhere('request.createdAt BETWEEN :start AND :end', {
        start: new Date(new Date().setDate(new Date().getDate() - 30)),
        end: new Date(),
      })
      .getMany();
  }

  async customHeadCreateRequest(
    userId: string,
    data: RequestRequestDto.RequestCreateDto,
  ): Promise<RequestEntity> {
    // find account
    let account = await this.accountRepository.findOne({
      where: { id: userId },
    });
    if (!account || account.deletedAt || account.role !== Role.head) {
      throw new Error('Account is not valid');
    }
    // find device
    let device = await this.deviceRepository.findOne({
      where: { id: data.device },
    });
    if (!device || device.deletedAt) {
      throw new Error('Device is not valid');
    }
    // check request duplicate
    // let request = await this.requestRepository.findOne({
    //   where: { requester: account, device: device, status: RequestStatus.PENDING },
    // });
    let request = await this.requestRepository.createQueryBuilder('request')
      .leftJoinAndSelect('request.device', 'device')
      .andWhere('device.deletedAt is null')
      .andWhere('device.id = :id', { id: data.device })
      .andWhere('request.status = :status', { status: RequestStatus.PENDING })
      .getOne();
    if (request) {
      throw new Error('Request is duplicate');
    }

    // create new request
    let newRequest = await this.requestRepository.save({
      requester: account,
      device: device,
      requester_note: data.requester_note
    });

    // create new notify
    let result = await this.notifyService.create({
      roleReceiver: Role.head,
      requestId: newRequest.id,
    });
    // push notify to head-staff
    this.headStaffGateWay.server.emit('new-request', result);
    return this.requestRepository.create(newRequest);
  }
}
