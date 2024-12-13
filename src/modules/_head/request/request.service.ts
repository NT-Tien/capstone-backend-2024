import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { format } from 'date-fns';
import { BaseService } from 'src/common/base/service.base';
import { AccountEntity, Role } from 'src/entities/account.entity';
import { DeviceEntity } from 'src/entities/device.entity';
import { NotificationType } from 'src/entities/notification.entity';
import { RequestEntity, RequestStatus } from 'src/entities/request.entity';
import { HeadStaffNotificationGateway } from 'src/modules/notifications/gateways/head-staff.gateway';
import { Repository } from 'typeorm';
import {
  FeedbackEntity,
  FeedbackRating,
} from '../../../entities/feedback.entity';
import { RequestRequestDto } from './dto/request.dto';
import { SequenceService } from 'src/common/sequence/sequence.service';
import { RequestTimeline } from 'src/entities/request-timeline.entity';

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
    @InjectRepository(RequestTimeline)
    private readonly requestTimelineRepository: Repository<RequestTimeline>,
    private readonly headstaffGateway: HeadStaffNotificationGateway,
    private readonly sequenceService: SequenceService,
  ) {
    super(requestRepository);
  }

  async customHeadGetAllRequest(userId: string): Promise<RequestEntity[]> {
    const account = await this.accountRepository.findOne({
      where: { id: userId, role: Role.head },
    });

    if (!account || account.deletedAt) {
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
        start: new Date(new Date().setDate(new Date().getDate() - 30 * 3)),
        end: new Date(),
      })
      .getMany();
  }

  async one(requestId: string, userId: string): Promise<RequestEntity> {
    const account = await this.accountRepository.findOne({
      where: { id: userId, role: Role.head },
    });

    if (!account || account.deletedAt) {
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
      .leftJoinAndSelect('request.feedback', 'feedback')
      .leftJoinAndSelect('issues.typeError', 'typeError')
      .where('requester.deletedAt is null')
      .andWhere('requester.id = :id', { id: userId })
      .andWhere('request.id = :requestId', { requestId })
      .getOne();
  }

  async customHeadCreateRequest(
    userId: string,
    data: RequestRequestDto.RequestCreateDto,
  ): Promise<RequestEntity> {
    // find account
    const account = await this.accountRepository.findOne({
      where: { id: userId, role: Role.head },
    });

    if (!account || account.deletedAt) {
      throw new HttpException('Account is not valid', HttpStatus.BAD_REQUEST);
    }
    // find device
    const device = await this.deviceRepository.findOne({
      where: { id: data.device },
      relations: ['machineModel', 'area'],
    });
    if (!device || device.deletedAt) {
      throw new HttpException('Device is not valid', HttpStatus.BAD_REQUEST);
    }

    const existsDuplicate = await this.requestRepository
      .createQueryBuilder('request')
      .leftJoinAndSelect('request.device', 'device')
      .andWhere('device.deletedAt is null')
      .andWhere('device.id = :id', { id: data.device })
      .andWhere('request.status IN (:...statuses)', {
        statuses: [
          RequestStatus.PENDING,
          RequestStatus.IN_PROGRESS,
          RequestStatus.APPROVED,
        ],
      })
      .getExists();
    if (existsDuplicate) {
      throw new HttpException('Request is duplicate', HttpStatus.BAD_REQUEST);
    }

    const currentValue = await this.sequenceService.request_get();

    // create new request
    const newRequest = await this.requestRepository.save({
      requester: account,
      device: device,
      old_device: device,
      requester_note: data.requester_note,
      area: device.area,
      code:
        format(new Date(), 'ddMMyy') +
        '_' +
        device.area.name +
        '_' +
        String(currentValue.value).padStart(4, '0'),
    });

    await this.sequenceService.request_increment();

    const result = await this.requestRepository.findOne({
      where: {
        id: newRequest.id,
      },
      relations: ['device', 'device.area', 'device.machineModel', 'requester'],
    });

    // notify head staff
    await this.headstaffGateway.emit(NotificationType.HD_CREATE_REQUEST)({
      requester: account,
      areaName: device.area.name,
      requestId: newRequest.id,
    });
    // await this.headStaffGateWay.emit_request_create(result, userId);

    return result;
  }

  async addFeedback(
    requestId: string,
    dto: RequestRequestDto.RequestAddFeedbackDto,
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
    if (request.status !== RequestStatus.HEAD_CONFIRM) {
      throw new BadRequestException('Request is not valid');
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

  async feedback(
    id: string,
    dto: RequestRequestDto.RequestFeedbackDto,
    userId: string,
  ) {
    const request = await this.requestRepository.findOne({
      where: {
        id,
        requester: {
          id: userId,
        },
        status: RequestStatus.HEAD_CONFIRM,
      },
      relations: ['requester'],
    });

    if (!request) {
      throw new HttpException('Request is not valid', HttpStatus.BAD_REQUEST);
    }

    const timeline = new RequestTimeline();
        timeline.visible_roles = [Role.admin, Role.head, Role.headstaff];        
        timeline.request = request;

    switch (dto.rating) {
      case FeedbackRating.PROBLEM_FIXED: {
        request.status = RequestStatus.CLOSED;
        await this.requestRepository.save(request);
        timeline.action = "Máy đã chạy, hoàn tất yêu cầu: " + dto.content;
        break;
      }

      case FeedbackRating.PROBLEM_NOT_FIXED: {
        request.status = RequestStatus.HM_VERIFY;
        await this.requestRepository.save(request);
        timeline.action = "Máy chưa chạy, yêu cầu đội bảo trì kiểm tra lại với nội dung: " + dto.content;
        this.headstaffGateway.emit(NotificationType.HD_FEEDBACK_BAD)({
          requestId: id,
          senderId: userId,
        });
      }
    }

    await this.requestTimelineRepository.save(timeline);   
    await this.feedbackRepository.save({
      request,
      requester: request.requester,
      rating: dto.rating,
      content: dto.content,
    });

    return request;
  }

  async cancelRequest(requestId: string, userId: string) {
    const request = await this.requestRepository.findOne({
      where: {
        id: requestId,
      },
      relations: ['requester'],
    });

    if (!request) {
      throw new HttpException('Request is not valid', HttpStatus.BAD_REQUEST);
    }

    if (request.requester.id !== userId) {
      throw new UnauthorizedException(
        'You are not allowed to cancel this request',
      );
    }

    if (request.status !== RequestStatus.PENDING || request.is_seen) {
      throw new HttpException('Request is not valid', HttpStatus.BAD_REQUEST);
    }

    request.status = RequestStatus.HEAD_CANCEL;
    const result = await this.requestRepository.save(request);

    return {
      request: result,
    };
  }
}
