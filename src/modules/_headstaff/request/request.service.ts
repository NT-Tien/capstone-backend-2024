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

  async customHeadStaffGetAllRequestDashboard(
    userId: string,
    status: RequestStatus,
  ): Promise<[RequestEntity[], number]> {
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
    });
  }

  async customHeadStaffGetAllRequest(
    userId: string,
    page: number,
    limit: number,
    status: RequestStatus,
  ): Promise<[RequestEntity[], number]> {
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
      relations: [
        'device',
        'device.area',
        'device.machineModel',
        'device.machineModel.typeErrors',
        'tasks',
        'tasks.fixer',
        'requester',
        'issues',
      ],
      order: { createdAt: status === RequestStatus.PENDING ? 'ASC' : 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  async customHeadStaffGetOneRequest(
    userId: string,
    id: string,
  ): Promise<RequestEntity> {
    var account = await this.accountRepository.findOne({
      where: { id: userId },
    });
    if (!account || account.deletedAt || account.role !== Role.headstaff) {
      throw new HttpException('Account is not valid', HttpStatus.BAD_REQUEST);
    }
    // update status notify
    await this.notifyRepository.update(
      {
        requestId: id,
      },
      {
        status: true,
      },
    );
    return this.requestRepository.findOne({
      where: { id },
      relations: [
        'device',
        'device.area',
        'device.machineModel',
        'tasks',
        'tasks.fixer',
        'tasks.issues',
        'requester',
        'issues',
        'issues.task',
        'issues.typeError',
        'issues.issueSpareParts',
        'issues.issueSpareParts.sparePart',
        'feedback',
      ],
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
    // let request = await this.requestRepository.findOne({
    //   where: { requester: account, device: device, status: RequestStatus.PENDING },
    // });
    let request = await this.requestRepository
      .createQueryBuilder('request')
      .leftJoinAndSelect('request.device', 'device')
      .andWhere('device.deletedAt is null')
      .andWhere('device.id = :id', { id: data.device })
      .andWhere('request.status = :status', { status: RequestStatus.PENDING })
      .getOne();
    if (request) {
      throw new HttpException('Request is duplicate', HttpStatus.BAD_REQUEST);
    }

    // create new request
    let newRequest = await this.requestRepository.save({
      requester: account,
      device: device,
      requester_note: data.requester_note,
    });

    // create new notify
    // let result = await this.notifyService.create({
    //   roleReceiver: Role.head,
    //   requestId: newRequest.id,
    // });
    // push notify to head-staff
    // this.headStaffGateWay.server.emit('new-request', result);
    const createdRequest = this.requestRepository.create(newRequest);

    return this.requestRepository.findOne({
      where: {
        id: createdRequest.id,
      },
      relations: ['device', 'device.area', 'device.machineModel'],
    });
  }

  async updateStatus(
    userId: string,
    id: string,
    data: RequestRequestDto.RequestUpdateDto,
  ): Promise<RequestEntity> {
    const account = await this.accountRepository.findOne({
      where: { id: userId },
    });

    let result = await this.requestRepository.save({ id, ...data, checker: account });

    if(!result) throw new HttpException('Request not found', HttpStatus.NOT_FOUND);

    // if(
    //   // some fields changed
    //   true
    // ){
    //   // create new notify
    //   // let notify = await this.notifyService.create({
    //   //   roleReceiver: Role.head,
    //   //   requestId: id,
    //   // });
    //   // push notify to head-staff
    //   this.headStaffGateWay.server.emit('', notify);
    // }

    return result;
  }

  async getStatistics(): Promise<{
    [key in RequestStatus]: number;
  }> {
    const result = await this.requestRepository
      .createQueryBuilder('request')
      .select('status')
      .addSelect('COUNT(*) as count')
      .groupBy('request.status')
      .addGroupBy('request.createdAt')
      .getRawMany();
      
      console.log(result)

    const returnValue = result.reduce(
      (acc, cur) => {
        acc[cur.status] = acc[cur.status] ? acc[cur.status] + 1 : 1;
        return acc;
      },
      {} as { [key: string]: number },
    );

    return returnValue
  }
}
