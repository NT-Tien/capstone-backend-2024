import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/base/service.base';
import { RequestEntity, RequestStatus } from 'src/entities/request.entity';
import { Repository } from 'typeorm';
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
    return this.requestRepository.find({
      where: { 
        requester: account,
        createdAt: new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000),
       },
      relations: ['device'],
      order: { createdAt: 'DESC' },
      // skip: (page - 1) * limit,
      // take: limit,
    });
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
    let request = await this.requestRepository.findOne({
      where: { requester: account, device: device, status: RequestStatus.PENDING },
    });
    if (request) {
      throw new Error('Request is duplicate');
    }
    let newRequest = new RequestEntity();
    request.requester = account;
    request.device = device;
    request.requester_note = data.requester_note;

    // create new notify
    let result = await this.notifyService.create({
      roleReceiver: Role.head,
      requestId: newRequest.id,
    });
    // push notify to head-staff
    this.headStaffGateWay.server.emit('new-request', result);

    return this.requestRepository.save(newRequest);
  }
}
