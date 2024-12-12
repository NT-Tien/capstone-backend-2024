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
import { NotificationType } from 'src/entities/notification.entity';
import {
  RequestEntity,
  RequestStatus,
  RequestType,
} from 'src/entities/request.entity';
import { SparePartEntity } from 'src/entities/spare-part.entity';
import { TaskEntity, TaskStatus, TaskType } from 'src/entities/task.entity';
import { TypeErrorEntity } from 'src/entities/type-error.entity';
import { HeadNotificationGateway } from 'src/modules/notifications/gateways/head.gateway';
import { StaffNotificationGateway } from 'src/modules/notifications/gateways/staff.gateway';
import TaskNameGenerator from 'src/utils/taskname-generator';
import { IsNull, Repository } from 'typeorm';
import { RequestRequestDto } from './dto/request.dto';
import { RequestResponseDto } from './dto/response.dto';
import {
  ExportWareHouse,
  exportType,
  exportStatus,
} from 'src/entities/export-warehouse.entity';
import { UUID } from 'typeorm/driver/mongodb/bson.typings';
import { MachineModelEntity } from 'src/entities/machine-model.entity';
import {
  DeviceWarrantyCardEntity,
  DeviceWarrantyCardStatus,
} from 'src/entities/device-warranty-card.entity';
import { RequestTimeline } from 'src/entities/request-timeline.entity';
import { time } from 'console';

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
    @InjectRepository(ExportWareHouse)
    private readonly exportWareHouseRepository: Repository<ExportWareHouse>,
    @InjectRepository(MachineModelEntity)
    private readonly machineModelEntityRepository: Repository<MachineModelEntity>,
    @InjectRepository(DeviceWarrantyCardEntity)
    private readonly deviceWarrantyCardRepository: Repository<DeviceWarrantyCardEntity>,
    @InjectRepository(RequestTimeline)
    private readonly requestTimelineRepository: Repository<RequestTimeline>,

    private readonly headGateway: HeadNotificationGateway,
    private readonly staffGateway: StaffNotificationGateway,
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
        'deviceWarrantyCards',
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
    var request= await this.requestRepository.findOne({
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
        'tasks.issues.issueSpareParts',
        'tasks.issues.issueSpareParts.sparePart',
        'tasks.export_warehouse_ticket',
        'requester',
        'issues',
        'issues.task',
        'issues.task.fixer',
        'issues.typeError',
        'issues.issueSpareParts',
        'issues.issueSpareParts.sparePart',
        'feedback',
        'temporary_replacement_device',
        'temporary_replacement_device.machineModel',
        'deviceWarrantyCards',
      ],
    });

    if (request.status == RequestStatus.PENDING ){
      const timelineExisted = await this.requestTimelineRepository.findOne({
        where :{
          action : "Tổ trưởng bảo trì đã xem qua yêu cầu",
          request: {
            id: request.id
          }
        }
      }
      );
      if(timelineExisted == null){
        const timeline = new RequestTimeline();
        timeline.visible_roles = [Role.admin, Role.head];
        timeline.action = "Tổ trưởng bảo trì đã xem qua yêu cầu";
        timeline.request = request;
        await this.requestTimelineRepository.save(timeline);
      }
      
    }
    return request;
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

    if (request != null ){
        const timeline = new RequestTimeline();
        timeline.visible_roles = [Role.admin, Role.head];
        if(request.device?.machineModel.warrantyTerm > new Date){
          timeline.action = "Máy còn thời hạn bảo hành, nhưng tổ bảo trì quyết định tiến hành sửa chữa/thay thế linh kiện.";
        }else{
          timeline.action = "Yêu cầu của bạn sẽ được tổ bảo trì tiến hành sửa chữa/thay thế linh kiện.";
        }
        timeline.request = request;
        await this.requestTimelineRepository.save(timeline);
    }

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

    this.headGateway.emit(NotificationType.HM_APPROVE_REQUEST_FIX)({
      receiverId: request.requester.id,
      requestId: id,
    });

    return await this.requestRepository.save(request);
  }

  async approveRequestToWarranty(
    id: string,
    dto: RequestRequestDto.RequestApproveToWarranty,
    userId: string,
    isMultiple?: boolean,
  ) {
    // fetch request
    let request = await this.requestRepository.findOne({
      where: { id },
      relations: ['device', 'device.area', 'device.machineModel', 'requester'],
    });

    if (request != null ){
      const timeline = new RequestTimeline();
      timeline.visible_roles = [Role.admin, Role.head];
      timeline.action = "Yêu cầu của bạn sẽ được tổ bảo trì đem bảo hành tại trung tâm";
      timeline.request = request;
      await this.requestTimelineRepository.save(timeline);
  }

    if (!request) {
      throw new HttpException('Request not found', HttpStatus.NOT_FOUND);
    }

    // create issues
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

    // find fixer and fixerDate
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

    if (!!dto.replacement_device_id) {
      const replacement_device = await this.deviceRepository.findOneOrFail({
        where: {
          id: dto.replacement_device_id,
        },
      });

      request.is_replacement_device = true;
      request.temporary_replacement_device = replacement_device;
    }

    if (isMultiple) {
      request.is_multiple_types = true;
    }

    const task = await this.taskRepository.save({
      request,
      issues: [disassembleIssue, sendIssue],
      operator: 0,
      device: request.device,
      totalTime: 60,
      priority: false,
      status: TaskStatus.ASSIGNED,
      device_static: request.device,
      name: TaskNameGenerator.generateWarranty(request),
      fixer: randomAccount,
      fixerDate: targetDate,
      type: TaskType.WARRANTY_SEND,
    });

    // create device warranty card
    this.deviceWarrantyCardRepository.save({
      device: {
        id: request.device.id,
      },
      request: {
        id: request.id,
      },
      initial_images: dto.initial_images,
      initial_video: dto.initial_video,
      initial_note: dto.note,
      status: DeviceWarrantyCardStatus.UNSENT,
    });

    // this.headGateway.emit_request_approved_warranty(request, userId);
    this.headGateway.emit(NotificationType.HM_APPROVE_REQUEST_WARRANTY)({
      receiverId: request.requester.id,
      requestId: id,
      sendWarrantyDate: targetDate,
    });

    await this.requestRepository.save(request);

    return request;
  }

  async addReplacementDeviceForWarranty(
    id: string,
    userId: string,
    dto: RequestRequestDto.AddReplacementDevice,
  ) {
    // update replacement device in database
    this.requestRepository.update(
      {
        id,
      },
      {
        is_replacement_device: true,
        temporary_replacement_device: {
          id: dto.deviceId,
        },
      },
    );

    const request = await this.requestRepository.findOneOrFail({
      where: {
        id,
      },
      relations: [
        'device',
        'device.area',
        'issues',
        'tasks',
        'issues.typeError',
        'temporary_replacement_device',
        'temporary_replacement_device.machineModel',
      ],
    });

    const replacementDevice = await this.deviceRepository.findOneOrFail({
      where: {
        id: dto.deviceId,
      },
    });
    console.log('UPDATED REQUEST');

    console.log(request.device);

    // if current active device hasn't been disassembled (positionX and positionY is not null), then automatically create a new task to assemble the replacement device
    if (
      request.device.positionX === null &&
      request.device.positionY === null &&
      request.device.area === null
    ) {
      console.log('CREATING TASK');
      const installIssue = await this.issueRepository.save({
        fixType: FixItemType.REPLACE,
        typeError: {
          id: Warranty.install_replacement,
        },
        description: request.temporary_replacement_device.machineModel.name,
        status: IssueStatus.PENDING,
        request: {
          id: request.id,
        },
      });

      const targetDate = new Date();
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

      const installTask = await this.taskRepository.save({
        request: request,
        issues: [installIssue],
        operator: 0,
        device: request.device,
        device_renew: request.temporary_replacement_device,
        device_static: request.device,
        totalTime: 60,
        priority: false,
        status: TaskStatus.ASSIGNED,
        name: TaskNameGenerator.generateInstallReplacement(request),
        fixer: randomAccount,
        fixerDate: targetDate,
        type: TaskType.INSTALL_REPLACEMENT,
      });

      const exportWarehouse = new ExportWareHouse();
      exportWarehouse.task = installTask;
      exportWarehouse.export_type = exportType.DEVICE;
      exportWarehouse.detail = installTask.device_renew.id;
      exportWarehouse.status = exportStatus.ACCEPTED;
      await this.exportWareHouseRepository.save(exportWarehouse);
    }

    return request;
  }

  async updateWarrantyReceivalDate(
    id: string,
    userId: string,
    dto: RequestRequestDto.UpdateWarrantyReceivalDate,
  ) {
    const request = await this.requestRepository.findOneOrFail({
      where: {
        id,
      },
      relations: ['deviceWarrantyCards'],
    });

    const deviceWarrantyCards = request.deviceWarrantyCards;
    const activeDeviceWarrantyCard = deviceWarrantyCards.find(
      (d) => d.status === DeviceWarrantyCardStatus.WC_PROCESSING,
    );

    if (!activeDeviceWarrantyCard) {
      throw new HttpException(
        'No active warranty card found',
        HttpStatus.NOT_FOUND,
      );
    }

    activeDeviceWarrantyCard.receive_date = new Date(dto.receivalDate);

    await this.deviceWarrantyCardRepository.save(activeDeviceWarrantyCard);

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

  async approveRequestToRenew(
    id: string,
    dto: RequestRequestDto.RequestApproveToRenew,
    userId: string,
    isMultiple?: boolean,
  ) {
    // update request
    let request = await this.requestRepository.findOne({
      where: { id },
      relations: ['issues', 'issues.typeError', 'requester'],
    });

    if (request != null ){
      const timeline = new RequestTimeline();
      timeline.visible_roles = [Role.admin, Role.head];
      timeline.action = "Máy hư quá nặng, Thiết bị của bạn sẽ được tổ bảo trì thay thế máy mới";
      timeline.request = request;
      await this.requestTimelineRepository.save(timeline);
  }

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
      relations: [
        'device',
        'device.machineModel',
        'issues',
        'device.area',
        'requester',
      ],
    });

    const task = await this.taskRepository.save({
      name: TaskNameGenerator.generateRenew(request),
      device: request.device,
      device_renew: newDevice,
      request: request,
      issues: [dismantleOldDeviceIssue, installNewDeviceIssue],
      device_static: request.device,
      operator: 0,
      status: TaskStatus.AWAITING_FIXER,
      totalTime: 0,
      type: TaskType.RENEW,
      priority: false,
    });

    this.headGateway.emit(NotificationType.HM_APPROVE_REQUEST_RENEW)({
      receiverId: request.requester.id,
      requestId: id,
    });

    return request;
  }

  async approveRequestToRenewEmpty(
    id: string,
    dto: RequestRequestDto.RequestApproveToRenewEmpty,
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

    const newTask = new TaskEntity();
    newTask.name = TaskNameGenerator.generateRenew(request);
    newTask.device = request.device;
    newTask.request = request;
    newTask.issues = [dismantleOldDeviceIssue, installNewDeviceIssue];
    newTask.device_static = request.device;
    newTask.operator = 0;
    newTask.status = TaskStatus.AWAITING_FIXER;
    newTask.totalTime = 0;
    newTask.type = TaskType.RENEW;
    newTask.priority = false;

    await this.taskRepository.save(newTask);

    const ticket = new ExportWareHouse();
    ticket.task = newTask;
    ticket.reason_delay = dto.machineModelId;
    ticket.detail = '[]';
    ticket.export_type = exportType.DEVICE;
    ticket.status = exportStatus.WAITING_ADMIN;

    await this.exportWareHouseRepository.save(ticket);

    return request;
  }

  async RenewStatus(
    taskID: string,
  ): Promise<RequestRequestDto.RenewStatusResponse> {
    const existedTask = await this.taskRepository.findOne({
      where: { id: taskID },
    });
    if (existedTask == null) return null;

    const ticket = await this.exportWareHouseRepository.findOne({
      where: { task: { id: taskID } },
      relations: ['task'],
    });

    console.log(
      'ticket nè*--------------------------------------------------; ' + ticket,
    );
    const model = await this.machineModelEntityRepository.findOne({
      where: { id: ticket.reason_delay },
    });
    var result = new RequestRequestDto.RenewStatusResponse();
    result.exportWarehouse = ticket;
    result.model = model;

    return result;
  }

  async rejectRequest(id: string, dto: RequestRequestDto.RequestReject) {
    const request = await this.requestRepository.findOne({
      where: { id },
      relations: ['requester'],
    });

    if (!request) {
      throw new HttpException('Request not found', HttpStatus.NOT_FOUND);
    }   
    const timeline = new RequestTimeline();
        timeline.visible_roles = [Role.admin, Role.head, Role.headstaff];
        timeline.action = "Yêu cầu được hoàn tất ngay với nội dung: " + dto.checker_note;
        timeline.request = request;
        await this.requestTimelineRepository.save(timeline);   

    request.status = RequestStatus.REJECTED;
    request.checker_note = dto.checker_note;

    this.headGateway.emit(NotificationType.HM_REJECT_REQUEST)({
      receiverId: request.requester.id,
      checker_note: dto.checker_note,
      requestId: id,
    });

    return await this.requestRepository.save(request);
  }

  async seenRequest(id: string, userId: string) {
    const request = await this.requestRepository.findOne({
      where: { id },
    });

    if (!request) {
      throw new HttpException('Request not found', HttpStatus.NOT_FOUND);
    }

    return await this.requestRepository.save({
      ...request,
      is_seen: true,
      checker: {
        id: userId,
      },
      checker_date: new Date().toISOString(),
    });
  }

  async createReturnWarrantyTask(
    id: string,
    userId: string,
    dto: RequestRequestDto.RequestCreateReturnWarrantyTask,
  ) {
    const request = await this.requestRepository.findOne({
      where: {
        id,
      },
      relations: ['issues', 'device', 'device.machineModel', 'device.area'],
    });

    let dismantleReplacementIssue: IssueEntity | null;

    if (request.is_replacement_device) {
      dismantleReplacementIssue = await this.issueRepository.save({
        fixType: FixItemType.REPLACE,
        request: request,
        typeError: {
          id: Warranty.dismantle_replacement,
        },
        description: request.requester_note,
      });
    }

    const receiveIssue = await this.issueRepository.save({
      fixType: FixItemType.REPAIR,
      request: request,
      typeError: {
        id: Warranty.receive,
      },
      description: request.requester_note,
    });

    const assembleIssue = await this.issueRepository.save({
      fixType: FixItemType.REPAIR,
      request: request,
      typeError: {
        id: Warranty.assemble,
      },
      description: request.requester_note,
    });

    // find fixer and fixerDate
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

    const task = await this.taskRepository.save({
      request,
      issues: [receiveIssue, dismantleReplacementIssue, assembleIssue],
      operator: 0,
      device: request.device,
      totalTime: 60,
      priority: dto.priority ?? false,
      status: TaskStatus.ASSIGNED,
      device_static: request.device,
      name: dto.taskName ?? TaskNameGenerator.generateWarranty(request),
      type: TaskType.WARRANTY_RECEIVE,
      fixer: {
        id: randomAccount.id,
      },
      fixerDate: dto.fixerDate,
    });

    // notify staff
    this.staffGateway.emit(NotificationType.HM_CREATE_RETURN_WARRANTY_TASK)({
      receiverId: task.fixer.id,
      fixerDate: task.fixerDate,
      taskType: task.type,
      taskId: task.id,
      senderId: userId,
    });

    return task;
  }

  async requestClose(
    id: string,
    userId: string,
    dto: RequestRequestDto.RequestClose,
  ) {
    const request = await this.requestRepository.findOne({
      where: { id },
      relations: ['device', 'device.area', 'device.machineModel'],
    });

    if (!request) {
      throw new HttpException('Request not found', HttpStatus.NOT_FOUND);
    }

    request.status = RequestStatus.CLOSED;
    request.checker_note = dto.note;

    return await this.requestRepository.save(request);
  }
}
