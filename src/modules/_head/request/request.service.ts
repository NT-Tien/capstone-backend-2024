import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/base/service.base';
import { RequestEntity, RequestStatus } from 'src/entities/request.entity';
import { Between, Repository } from 'typeorm';
import { RequestRequestDto } from './dto/request.dto';
import { AccountEntity, Role } from 'src/entities/account.entity';
import { DeviceEntity } from 'src/entities/device.entity';
import { HeadStaffGateway } from 'src/modules/notify/roles/notify.head-staff';
import { NotifyService } from 'src/modules/notify/notify.service';
import { FeedbackEntity } from '../../../entities/feedback.entity';

@Injectable()
export class RequestService extends BaseService<RequestEntity> {
  constructor(
    @InjectRepository(RequestEntity)
    private readonly requestRepository: Repository<RequestEntity>,
    @InjectRepository(AccountEntity)
    private readonly accountRepository: Repository<AccountEntity>,
    @InjectRepository(DeviceEntity)
    private readonly deviceRepository: Repository<DeviceEntity>,
    @InjectRepository(FeedbackEntity)
    private readonly feedbackRepository: Repository<FeedbackEntity>,
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
    return this.requestRepository
      .createQueryBuilder('request')
      .leftJoinAndSelect('request.requester', 'requester')
      .leftJoinAndSelect('request.device', 'device')
      .leftJoinAndSelect('device.area', 'area')
      .leftJoinAndSelect('device.machineModel', 'machineModel')
      .leftJoinAndSelect('request.tasks', 'tasks')
      .leftJoinAndSelect('request.checker', 'checker')
      .leftJoinAndSelect('request.issues', 'issues')
      .where('requester.deletedAt is null')
      .andWhere('requester.id = :id', { id: userId })
      .andWhere('request.createdAt BETWEEN :start AND :end', {
        start: new Date(new Date().setDate(new Date().getDate() - (30 * 3))),
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
    let result = await this.notifyService.create({
      roleReceiver: Role.head,
      requestId: newRequest.id,
    });
    // push notify to head-staff
    this.headStaffGateWay.server.emit('new-request', result);
    return this.requestRepository.create(newRequest);
  }

  async confirmRequest(
    requestId: string,
    dto: RequestRequestDto.RequestConfirmDto,
    userId: string,
  ) {
    const request = await this.requestRepository.findOne({
      where: {
        id: requestId,
      },
      relations: ['requester'],
    });

    if (!request) {
      throw new BadRequestException('Request not found');
    }
    if (request.requester.id !== userId) {
      throw new UnauthorizedException(
        'You are not allowed to confirm this request',
      );
    }

    request.status = RequestStatus.CLOSED;
    const result1 = await this.requestRepository.save(request);

    const feedback = new FeedbackEntity();
    feedback.request = request;
    feedback.content = dto.content;
    feedback.requester = request.requester;
    const result2 = await this.feedbackRepository.save(feedback);

    return {
      request: result1,
      feedback: result2,
    };
  }

  async cancelRequest(requestId: string, userId: string) {
    const request = await this.requestRepository.findOne({
      where: {
        id: requestId,
      },
      relations: ['requester'],
    });

    if (!request) {
      throw new BadRequestException('Request not found');
    }
    if (request.requester.id !== userId) {
      throw new UnauthorizedException(
        'You are not allowed to cancel this request',
      );
    }

    request.status = RequestStatus.HEAD_CANCEL;
    const result1 = await this.requestRepository.save(request);

    return {
      request: result1,
    };
  }
}
