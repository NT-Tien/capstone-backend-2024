import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/base/service.base';
import { Renew, Warranty } from 'src/common/constants';
import { AccountEntity, Role } from 'src/entities/account.entity';
import { DeviceEntity } from 'src/entities/device.entity';
import { IssueSparePartEntity } from 'src/entities/issue-spare-part.entity';
import {
  FixItemType,
  IssueEntity,
  IssueStatus,
} from 'src/entities/issue.entity';
import {
  RequestEntity,
  RequestStatus,
  RequestType,
} from 'src/entities/request.entity';
import { SparePartEntity } from 'src/entities/spare-part.entity';
import { TaskEntity, TaskStatus, TaskType } from 'src/entities/task.entity';
import { TypeErrorEntity } from 'src/entities/type-error.entity';
import TaskNameGenerator from 'src/utils/taskname-generator';
import { Repository } from 'typeorm';
import { RequestRequestDto } from './dto/request.dto';

@Injectable()
export class RequestService extends BaseService<RequestEntity> {
  constructor(
    @InjectRepository(RequestEntity)
    private readonly requestRepository: Repository<RequestEntity>,
    @InjectRepository(AccountEntity)
    private readonly accountRepository: Repository<AccountEntity>,
    @InjectRepository(DeviceEntity)
    private readonly deviceRepository: Repository<DeviceEntity>,
    @InjectRepository(IssueEntity)
    private readonly issueRepository: Repository<IssueEntity>,
    @InjectRepository(TaskEntity)
    private readonly taskRepository: Repository<TaskEntity>,
    @InjectRepository(TypeErrorEntity)
    private readonly typeErrorRepository: Repository<TypeErrorEntity>,
    @InjectRepository(SparePartEntity)
    private readonly sparePartRepository: Repository<SparePartEntity>,
    @InjectRepository(IssueSparePartEntity)
    private readonly issueSparePartRepository: Repository<IssueSparePartEntity>,
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
        'feedback',
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
    return this.requestRepository.findOne({
      where: { id },
      relations: [
        'device',
        'device.area',
        'device.machineModel',
        'tasks',
        'tasks.fixer',
        'tasks.issues',
        'tasks.device_renew',
        'tasks.device_renew.machineModel',
        'tasks.issues.typeError',
        'tasks.export_warehouse_ticket',
        'requester',
        'issues',
        'issues.task',
        'issues.task.fixer',
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

    let result = await this.requestRepository.save({
      id,
      ...data,
      checker: account,
    });

    if (!result)
      throw new HttpException('Request not found', HttpStatus.NOT_FOUND);

    const response = await this.requestRepository.findOne({
      where: {
        id: result.id,
      },
      relations: ['device', 'device.area', 'device.machineModel', 'requester'],
    });

    // // notify
    // if (data.status === RequestStatus.APPROVED) {
    //   if (data.is_warranty) {
    //     this.headGateway.emit_request_approved_warranty(response, userId);
    //   } else {
    //     this.headGateway.emit_request_approved_fix(response, userId);
    //   }
    // }
    if (data.status === RequestStatus.REJECTED) {
      // this.headGateway.emit_request_rejected(response, userId);
    }

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

    console.log(result);

    const returnValue = result.reduce(
      (acc, cur) => {
        acc[cur.status] = acc[cur.status] ? acc[cur.status] + 1 : 1;
        return acc;
      },
      {} as { [key: string]: number },
    );

    return returnValue;
  }

  async approveRequestToFix(
    id: string,
    dto: RequestRequestDto.RequestApproveToFix,
    userId: string,
    isMultiple?: boolean,
  ) {
    // create all the issues
    const request = await this.requestRepository.findOne({
      where: { id },
      relations: ['device', 'device.area', 'device.machineModel', 'requester'],
    });

    if (!request) {
      throw new HttpException('Request not found', HttpStatus.NOT_FOUND);
    }

    const issues = await Promise.all(
      dto.issues.map(async (issue) => {
        // get typeError
        const typeError = await this.typeErrorRepository.findOne({
          where: { id: issue.typeError },
        });

        if (!typeError) {
          throw new HttpException('Type error not found', HttpStatus.NOT_FOUND);
        }

        const createdIssue = await this.issueRepository.save({
          request,
          status: IssueStatus.PENDING,
          description: issue.description,
          fixType: issue.fixType as any,
          typeError,
        });

        for (const sp of issue.spareParts) {
          const sparePart = await this.sparePartRepository.findOne({
            where: { id: sp.sparePart },
          });

          if (!sparePart) {
            throw new HttpException(
              'Spare part not found',
              HttpStatus.NOT_FOUND,
            );
          }

          await this.issueSparePartRepository.save({
            issue: createdIssue,
            sparePart,
            quantity: sp.quantity,
          });
        }
      }),
    );

    request.is_rennew = false;
    request.is_warranty = false;
    request.is_fix = true;
    request.type = RequestType.FIX;
    request.status = RequestStatus.APPROVED;
    if (isMultiple) {
      request.is_multiple_types = true;
    }

    return await this.requestRepository.save(request);
  }

  async approveRequestToWarranty(
    id: string,
    dto: RequestRequestDto.RequestApproveToWarranty,
    userId: string,
    isMultiple?: boolean,
  ) {
    let request = await this.requestRepository.findOne({
      where: { id },
      relations: ['device', 'device.area', 'device.machineModel', 'requester'],
    });

    if (!request) {
      throw new HttpException('Request not found', HttpStatus.NOT_FOUND);
    }

    const disassembleIssue = await this.issueRepository.save({
      fixType: FixItemType.REPAIR,
      request: request,
      typeError: {
        id: Warranty.disassemble,
      },
      description: dto.note,
    });

    const sendIssue = await this.issueRepository.save({
      fixType: FixItemType.REPAIR,
      request: request,
      typeError: {
        id: Warranty.send,
      },
      description: dto.note,
    });

    const receiveIssue = await this.issueRepository.save({
      fixType: FixItemType.REPAIR,
      request: request,
      typeError: {
        id: Warranty.receive,
      },
      description: dto.note,
    });

    const assembleIssue = await this.issueRepository.save({
      fixType: FixItemType.REPAIR,
      request: request,
      typeError: {
        id: Warranty.assemble,
      },
      description: dto.note,
    });

    request = await this.requestRepository.findOne({
      where: { id },
      relations: [
        'device',
        'device.area',
        'device.machineModel',
        'requester',
        'issues',
      ],
    });

    const targetDate = new Date();
    if (targetDate.getHours() >= 15) {
      targetDate.setDate(targetDate.getDate() + 1);
      targetDate.setHours(0, 0, 0, 0);
    }
    const nextDate = new Date(targetDate);
    nextDate.setDate(nextDate.getDate() + 1);

    const accounts = await this.accountRepository
      .createQueryBuilder('account')
      .leftJoinAndSelect(
        'account.tasks',
        'tasks',
        'tasks.status in (:...statuses) AND tasks.fixerDate >= :date AND tasks.fixerDate < :nextDate',
        {
          statuses: [TaskStatus.ASSIGNED, TaskStatus.IN_PROGRESS],
          date: targetDate.toISOString(),
          nextDate: nextDate.toISOString(),
        },
      )
      .where('account.role = :role', { role: Role.staff })
      .getMany();

    const accountsWithFewestTasks = accounts.reduce(
      (acc, cur) => {
        if (cur.tasks.length < acc.current) {
          acc.accounts = [cur];
          acc.current = cur.tasks.length;
        } else if (cur.tasks.length === acc.current) {
          acc.accounts.push(cur);
        }
        return acc;
      },
      {
        accounts: [],
        current: Infinity,
      },
    );

    const randomAccount =
      accountsWithFewestTasks.accounts[
        Math.floor(Math.random() * accountsWithFewestTasks.accounts.length)
      ];

    request.status = RequestStatus.APPROVED;
    request.type = RequestType.WARRANTY;
    request.is_fix = false;
    request.is_rennew = false;
    request.is_warranty = true;
    if (isMultiple) {
      request.is_multiple_types = true;
    }

    await this.taskRepository.save([
      {
        request,
        issues: [receiveIssue, assembleIssue],
        operator: 0,
        device: request.device,
        totalTime: 60,
        priority: false,
        status: TaskStatus.AWAITING_FIXER,
        name: TaskNameGenerator.generateWarranty(request),
        type: TaskType.WARRANTY_SEND,
      },
      {
        request,
        issues: [disassembleIssue, sendIssue],
        operator: 0,
        device: request.device,
        totalTime: 60,
        priority: false,
        status: TaskStatus.ASSIGNED,
        name: TaskNameGenerator.generateWarranty(request),
        fixer: randomAccount,
        fixerDate: targetDate,
        type: TaskType.WARRANTY_RECEIVE,
      },
    ]);

    // this.headGateway.emit_request_approved_warranty(request, userId);

    await this.requestRepository.save(request);

    return request;
  }

  async warrantyFailed(id: string) {
    const request = await this.requestRepository.findOne({
      where: { id },
      relations: [
        'issues',
        'issues.typeError',
        'tasks',
        'tasks.issues',
        'tasks.issues.typeError',
      ],
    });

    if (!request) {
      throw new HttpException('Request not found', HttpStatus.NOT_FOUND);
    }

    request.issues.forEach((i) => {
      if (
        i.status === IssueStatus.PENDING &&
        (i.typeError.id === Warranty.assemble ||
          i.typeError.id === Warranty.receive ||
          i.typeError.id === Warranty.send ||
          i.typeError.id === Warranty.disassemble)
      ) {
        i.status = IssueStatus.CANCELLED;
      }
    });

    request.tasks.forEach((t) => {
      if (
        t.status !== TaskStatus.COMPLETED &&
        (t.type === TaskType.WARRANTY_RECEIVE ||
          t.type === TaskType.WARRANTY_SEND)
      ) {
        t.status = TaskStatus.CANCELLED;
      }
    });

    return await this.requestRepository.save(request);
  }

  // async approveRequestToRenew(
  //   id: string,
  //   dto: RequestRequestDto.RequestApproveToRenew,
  //   userId: string,
  // ) {
  //   // update request
  //   let request = await this.requestRepository.findOne({
  //     where: { id },
  //     relations: ['issues', 'issues.typeError'],
  //   });

  //   if (!request) {
  //     throw new HttpException('Request not found', HttpStatus.NOT_FOUND);
  //   }

  //   const newDevice = await this.deviceRepository.findOne({
  //     where: {
  //       id: dto.deviceId,
  //     },
  //   });

  //   if (!newDevice) {
  //     throw new HttpException('New device not found', HttpStatus.NOT_FOUND);
  //   }

  //   request.is_rennew = true;
  //   request.status = RequestStatus.APPROVED;
  //   request.type = RequestType.RENEW;

  //   await this.requestRepository.save(request);

  //   // create issues
  //   const dismantleOldDeviceIssue = await this.issueRepository.save({
  //     request,
  //     fixType: FixItemType.REPLACE,
  //     typeError: {
  //       id: Renew.dismantleOldDevice,
  //     },
  //     description: dto.note ?? '',
  //   });

  //   const installNewDeviceIssue = await this.issueRepository.save({
  //     request,
  //     fixType: FixItemType.REPLACE,
  //     typeError: {
  //       id: Renew.installNewDevice,
  //     },
  //     description: dto.note ?? '',
  //   });

  //   // create task

  //   request = await this.requestRepository.findOne({
  //     where: { id },
  //     relations: ['device', 'device.machineModel', 'issues', 'device.area'],
  //   });

  //   const task = await this.taskRepository.save({
  //     name: TaskNameGenerator.generateRenew(request),
  //     device: request.device,
  //     device_renew: newDevice,
  //     request: request,
  //     issues: [dismantleOldDeviceIssue, installNewDeviceIssue],
  //     operator: 0,
  //     status: TaskStatus.AWAITING_FIXER,
  //     totalTime: 0,
  //     type: TaskType.RENEW,
  //     priority: false,
  //   });

  //   return request;
  // }

  async approveRequestToRenew(
    id: string,
    dto: RequestRequestDto.RequestApproveToRenew,
    userId: string,
    isMultiple?: boolean,
  ) {
    // update request
    let request = await this.requestRepository.findOne({
      where: { id },
      relations: ['issues', 'issues.typeError'],
    });

    if (!request) {
      throw new HttpException('Request not found', HttpStatus.NOT_FOUND);
    }

    const newDevice = await this.deviceRepository.findOne({
      where: {
        id: dto.deviceId,
      },
    });

    if (!newDevice) {
      throw new HttpException('New device not found', HttpStatus.NOT_FOUND);
    }

    request.is_rennew = true;
    request.is_warranty = false;
    request.is_fix = false;
    request.status = RequestStatus.APPROVED;
    request.type = RequestType.RENEW;
    if (isMultiple) {
      request.is_multiple_types = true;
    }

    await this.requestRepository.save(request);

    // create issues
    const dismantleOldDeviceIssue = await this.issueRepository.save({
      request,
      fixType: FixItemType.REPLACE,
      typeError: {
        id: Renew.dismantleOldDevice,
      },
      description: dto.note ?? '',
    });

    const installNewDeviceIssue = await this.issueRepository.save({
      request,
      fixType: FixItemType.REPAIR,
      typeError: {
        id: Renew.installNewDevice,
      },
      description: dto.note ?? '',
    });

    // create task
    request = await this.requestRepository.findOne({
      where: { id },
      relations: ['device', 'device.machineModel', 'issues', 'device.area'],
    });

    await this.taskRepository.save({
      name: TaskNameGenerator.generateRenew(request),
      device: request.device,
      device_renew: newDevice,
      request: request,
      issues: [dismantleOldDeviceIssue, installNewDeviceIssue],
      operator: 0,
      status: TaskStatus.AWAITING_FIXER,
      totalTime: 0,
      type: TaskType.RENEW,
      priority: false,
    });

    return request;
  }
}
