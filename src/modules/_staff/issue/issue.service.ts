import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { BaseService } from '../../../common/base/service.base';
import {
  FixItemType,
  IssueEntity,
  IssueStatus,
  WarrantyFailedReasonsList,
} from '../../../entities/issue.entity';
import { IsNull, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { IssueRequestDto } from './dto/request.dto';
import { TaskEntity, TaskStatus, TaskType } from 'src/entities/task.entity';
import { Warranty } from 'src/common/constants';
import {
  exportStatus,
  exportType,
  ExportWareHouse,
} from 'src/entities/export-warehouse.entity';
import TaskNameGenerator from 'src/utils/taskname-generator';
import { AccountEntity, Role } from 'src/entities/account.entity';
import {
  RequestEntity,
  RequestStatus,
  RequestUtil,
} from 'src/entities/request.entity';
import { DeviceEntity } from 'src/entities/device.entity';
import {
  DeviceWarrantyCardEntity,
  DeviceWarrantyCardStatus,
} from 'src/entities/device-warranty-card.entity';
import { NotificationType } from 'src/entities/notification.entity';
import { HeadNotificationGateway } from 'src/modules/notifications/gateways/head.gateway';

@Injectable()
export class IssueService extends BaseService<IssueEntity> {
  constructor(
    @InjectRepository(IssueEntity)
    private readonly issueRepository: Repository<IssueEntity>,
    @InjectRepository(TaskEntity)
    private readonly taskRepository: Repository<TaskEntity>,
    @InjectRepository(ExportWareHouse)
    private readonly exportWareHouseRepository: Repository<ExportWareHouse>,
    @InjectRepository(AccountEntity)
    private readonly accountRepository: Repository<AccountEntity>,
    @InjectRepository(RequestEntity)
    private readonly requestRepository: Repository<RequestEntity>,
    @InjectRepository(DeviceEntity)
    private readonly deviceRepository: Repository<DeviceEntity>,
    @InjectRepository(DeviceWarrantyCardEntity)
    private readonly deviceWarrantyCardRepository: Repository<DeviceWarrantyCardEntity>,

    private readonly headGateway: HeadNotificationGateway,
  ) {
    super(issueRepository);
  }

  async resolveIssue(
    userId: string,
    issueId: string,
    dto: IssueRequestDto.ResolveIssue,
  ) {
    const issue = await this.issueRepository.findOne({
      where: {
        id: issueId,
      },
      relations: [
        'task',
        'task.fixer',
        'typeError',
        'request',
        'request.device',
        'request.deviceWarrantyCards',
        'request.deviceWarrantyCards.device',
      ],
    });
    if (!issue || issue.task.fixer.id !== userId) {
      throw new HttpException('Issue not found', HttpStatus.NOT_FOUND);
    }
    // issue.status = IssueStatus.RESOLVED;
    // issue.imagesVerify = dto.imagesVerify;
    // issue.videosVerify = dto.videosVerify;
    // issue.resolvedNote = dto.resolvedNote;

    if (issue.typeError.id === Warranty.dismantle_replacement) {
      // remove the positionX and Y and area of current device in request
      await this.deviceRepository.update(
        {
          id: issue.request.device.id,
        },
        {
          positionX: null,
          positionY: null,
          area: null,
        },
      );
    }

    console.log(issue);

    if (issue.typeError.id === Warranty.assemble.toLowerCase()) {
      // get the currently warranted device
      const warrantyCards = issue.request.deviceWarrantyCards;
      const latestWarrantyCard = warrantyCards.sort((a, b) => {
        return b.createdAt.getTime() - a.createdAt.getTime();
      })[0];

      if (!latestWarrantyCard) {
        throw new HttpException(
          'Warranty card not found',
          HttpStatus.NOT_FOUND,
        );
      }

      // add back the positionX and Y and area of current device in request
      await this.deviceRepository.update(
        {
          id: latestWarrantyCard.device.id,
        },
        {
          positionX: issue.request.old_device.positionX,
          positionY: issue.request.old_device.positionY,
          isWarranty: false,
          area: {
            id: issue.request.old_device.area.id,
          },
        },
      );

      // update the device in request
      await this.requestRepository.update(
        {
          id: issue.request.id,
        },
        {
          device: latestWarrantyCard.device,
        },
      );

      console.log(latestWarrantyCard);
    }

    return this.issueRepository.update(
      {
        id: issueId,
      },
      {
        status: IssueStatus.RESOLVED,
        imagesVerify: dto.imagesVerify,
        videosVerify: dto.videosVerify,
        resolvedNote: dto.resolvedNote,
      },
    );
  }

  async resolveWarrantyDisassembleIssue(
    userId: string,
    issueId: string,
    dto: IssueRequestDto.ResolveIssue,
  ) {
    const issue = await this.issueRepository.findOne({
      where: {
        id: issueId,
      },
      relations: [
        'task',
        'task.fixer',
        'request',
        'request.temporary_replacement_device',
        'request.temporary_replacement_device.machineModel',
        'request.device',
        'request.device.area',
        'request.device.machineModel',
        'request.issues',
      ],
    });
    if (!issue || issue.task.fixer.id !== userId) {
      throw new HttpException('Issue not found', HttpStatus.NOT_FOUND);
    }

    // after disassembling device AND request has temporary replacement device, automatically create a new task to assemble the temporary device
    if (issue.request.temporary_replacement_device) {
      const installIssue = await this.issueRepository.save({
        fixType: FixItemType.REPLACE,
        typeError: {
          id: Warranty.install_replacement,
        },
        description:
          issue.request.temporary_replacement_device.machineModel.name,
        status: IssueStatus.PENDING,
        request: {
          id: issue.request.id,
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
          // skip current fixer
          if (cur.id === issue.task.fixer.id) {
            return acc;
          }

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
        request: issue.request,
        issues: [installIssue],
        operator: 0,
        device: issue.request.device,
        device_renew: issue.request.temporary_replacement_device,
        device_static: issue.request.device,
        totalTime: 60,
        priority: false,
        status: TaskStatus.ASSIGNED,
        name: TaskNameGenerator.generateInstallReplacement(issue.request),
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

    // remove active device positionX and positionY
    await this.deviceRepository.update(
      {
        id: issue.request.device.id,
      },
      {
        positionX: null,
        positionY: null,
        area: null,
        isWarranty: true,
      },
    );

    return this.issueRepository.update(
      {
        id: issueId,
      },
      {
        status: IssueStatus.RESOLVED,
        imagesVerify: dto.imagesVerify,
        videosVerify: dto.videosVerify,
        resolvedNote: dto.resolvedNote,
      },
    );
  }

  async failIssue(
    userId: string,
    issueId: string,
    dto: IssueRequestDto.FailIssue,
  ) {
    const issue = await this.issueRepository.findOne({
      where: {
        id: issueId,
      },
      relations: [
        'task',
        'task.fixer',
        'issueSpareParts',
        'issueSpareParts.sparePart',
        'issueSpareParts.issue',
      ],
    });
    if (!issue || issue?.task?.fixer.id !== userId) {
      throw new HttpException('Issue not found', HttpStatus.NOT_FOUND);
    }
    let task = await this.taskRepository.findOne({
      where: { id: issue.task.id },
    });
    if (!task) {
      throw new HttpException('Task not found', HttpStatus.NOT_FOUND);
    }
    let return_spare_part_data = task.return_spare_part_data;
    // if null convert to empty array
    if (!return_spare_part_data) {
      return_spare_part_data = [];
    }
    // flat array issue.issueSpareParts
    let newIssueSpareParts = issue.issueSpareParts;

    // push new return spare part data
    return_spare_part_data.push(newIssueSpareParts);

    // update task
    await this.taskRepository.update(
      {
        id: issue.task.id,
      },
      {
        return_spare_part_data: return_spare_part_data.flat(),
      },
    );
    issue.status = IssueStatus.FAILED;
    issue.failReason = dto.failReason;
    return this.issueRepository.save(issue);
  }

  async failIssueWarranty(
    userId: string,
    issueId: string,
    dto: IssueRequestDto.FailIssueWarranty,
  ) {
    // update issue
    const issue = await this.issueRepository.findOne({
      where: {
        id: issueId,
      },
      relations: [
        'task',
        'task.fixer',
        'task.issues',
        'request',
        'request.deviceWarrantyCards',
        'request.deviceWarrantyCards.device',
      ],
    });
    if (!issue || issue?.task?.fixer.id !== userId) {
      throw new HttpException('Issue not found', HttpStatus.NOT_FOUND);
    }

    // get current warranty card
    const warrantyCard = RequestUtil.getCurrentWarrantyCard(issue.request);

    if (!warrantyCard) {
      throw new HttpException('Warranty card not found', HttpStatus.NOT_FOUND);
    }

    issue.status = IssueStatus.FAILED;
    issue.failReason = dto.failReason;
    issue.imagesVerifyFail = dto.imagesVerify;
    const save = await this.issueRepository.save(issue);

    if (
      issue.task.type === TaskType.WARRANTY_RECEIVE &&
      dto.failReason.includes(WarrantyFailedReasonsList.CHANGE_RECEIVE_DATE)
    ) {
      // close the current task and release all issues
      await this.taskRepository.update(
        {
          id: issue.task.id,
        },
        {
          status: TaskStatus.CANCELLED,
        },
      );

      issue.task.issues.forEach(async (issue) => {
        await this.issueRepository.update(
          {
            id: issue.id,
          },
          {
            status: IssueStatus.CANCELLED,
          },
        );
      });

      console.log(dto.failReason)
      const newDate = dto.failReason.split(":")[1].trim();
      const [day, month, year] = newDate.split("/");
      const dateObj = new Date(`${year}-${month}-${day}`);
      await this.deviceWarrantyCardRepository.update(
        {
          id: warrantyCard.id,
        },
        {
          receive_date: dateObj,
        },
      );
    }

    if (
      issue.task.type === TaskType.WARRANTY_SEND &&
      dto.failReason.includes(
        WarrantyFailedReasonsList.WARRANTY_REJECTED_ON_ARRIVAL,
      )
    ) {
      // add issues: bring device to warehouse
      const bringDeviceToWarehouseIssue = await this.issueRepository.save({
        typeError: {
          id: Warranty.return_to_warehouse,
        },
        fixType: FixItemType.REPLACE,
        status: IssueStatus.PENDING,
        description: '',
        request: {
          id: issue.request.id,
        },
        task: {
          id: issue.task.id,
        },
      });

      await this.deviceWarrantyCardRepository.update(
        {
          id: warrantyCard.id,
        },
        {
          status: DeviceWarrantyCardStatus.WC_REJECTED_ON_ARRIVAL,
          send_date: new Date(),
          send_note: dto.failReason,
          send_bill_image: dto.imagesVerify,
        },
      );

      return save;
    }

    // update task -> closed

    if (dto.shouldSkipUpdateTask) {
      return save;
    }

    const task = await this.taskRepository.findOne({
      where: {
        id: dto.taskId,
      },
    });

    task.completedAt = new Date();
    task.status = TaskStatus.HEAD_STAFF_CONFIRM;

    await this.taskRepository.save(task);

    return save;
  }

  async resolveWarrantyInstallReplacementIssue(
    userId: string,
    issueId: string,
    dto: IssueRequestDto.ResolveIssue,
  ) {
    const issue = await this.issueRepository.findOne({
      where: {
        id: issueId,
      },
      relations: [
        'task',
        'task.fixer',
        'task.issues',
        'task.issues.typeError',
        'task.device_renew',
        'request',
        'request.requester',
        'request.temporary_replacement_device',
        'request.temporary_replacement_device.machineModel',
        'request.device',
        'request.device.area',
        'request.device.machineModel',
        'request.issues',
        'request.tasks',
        'request.deviceWarrantyCards',
        'request.deviceWarrantyCards.device',
      ],
    });
    if (!issue || issue.task.fixer.id !== userId) {
      throw new HttpException('Issue not found', HttpStatus.NOT_FOUND);
    }

    // automatically complete task
    await this.taskRepository.update(
      {
        id: issue.task.id,
      },
      {
        status: TaskStatus.COMPLETED,
        completedAt: new Date(),
        last_issues_data: issue.task.issues,
        imagesVerify: dto.imagesVerify,
        videosVerify: dto.videosVerify,
        fixerNote: dto.resolvedNote,
      },
    );

    // update device in request
    await this.requestRepository.update(
      {
        id: issue.request.id,
      },
      {
        device: {
          id: issue.task.device_renew.id,
        },
      },
    );

    const isAllTasksCompleted = issue.request.tasks.every(
      (t) => t.status === TaskStatus.COMPLETED,
    );
    const completedSet = new Set([
      DeviceWarrantyCardStatus.FAIL,
      DeviceWarrantyCardStatus.SUCCESS,
      DeviceWarrantyCardStatus.WC_REJECTED_ON_ARRIVAL,
    ]);
    const isWarrantyCompleted = completedSet.has(
      RequestUtil.getCurrentWarrantyCard(issue.request)?.status,
    );

    if (isAllTasksCompleted && isWarrantyCompleted) {
      this.headGateway.emit(NotificationType.S_COMPLETE_ALL_TASKS)({
        senderId: userId,
        requestId: issue.request.id,
        receiverId: issue.request.requester.id,
      });
      await this.requestRepository.update(
        {
          id: issue.request.id,
        },
        {
          status: RequestStatus.HEAD_CONFIRM,
        },
      );
    }

    // update device positionX and Y and area
    await this.deviceRepository.update(
      {
        id: issue.task.device_renew.id,
      },
      {
        positionX: issue.request.old_device.positionX,
        positionY: issue.request.old_device.positionY,
        area: {
          id: issue.request.old_device.area.id,
        },
        isHeld: false,
        status: true,
      },
    );

    return this.issueRepository.update(
      {
        id: issueId,
      },
      {
        status: IssueStatus.RESOLVED,
        imagesVerify: dto.imagesVerify,
        videosVerify: dto.videosVerify,
        resolvedNote: dto.resolvedNote,
      },
    );
  }

  async resolveWarrantyReceiveIssue(
    userId: string,
    issueId: string,
    dto: IssueRequestDto.ResolveReceiveIssue,
  ) {
    // get current issue
    let issue = await this.issueRepository.findOne({
      where: {
        id: issueId,
      },
      relations: [
        'task',
        'task.fixer',
        'task.issues',
        'task.issues.typeError',
        'task.device_renew',
        'request',
        'request.temporary_replacement_device',
        'request.temporary_replacement_device.machineModel',
        'request.deviceWarrantyCards',
        'request.device',
        'request.device.area',
        'request.device.machineModel',
        'request.issues',
      ],
    });
    if (!issue || issue.task.fixer.id !== userId) {
      throw new HttpException('Issue not found', HttpStatus.NOT_FOUND);
    }

    // get current warranty card
    const warrantyCards = issue.request.deviceWarrantyCards;
    const activeWarrantyCard = warrantyCards.find(
      (i) => i.status === DeviceWarrantyCardStatus.WC_PROCESSING,
    );

    console.log(warrantyCards);

    if (!activeWarrantyCard) {
      throw new HttpException('Warranty card not found', HttpStatus.NOT_FOUND);
    }

    // update current warranty card
    await this.deviceWarrantyCardRepository.update(
      {
        id: activeWarrantyCard.id,
      },
      {
        status:
          dto.warranty_status === 'success'
            ? DeviceWarrantyCardStatus.SUCCESS
            : DeviceWarrantyCardStatus.FAIL,
        receive_date: new Date(),
        receive_note: dto.note,
        receive_bill_image: dto.receive_bill_images,
      },
    );

    await this.issueRepository.update(
      {
        id: issueId,
      },
      {
        status: IssueStatus.RESOLVED,
        imagesVerify: dto.receive_bill_images,
        resolvedNote: dto.note,
      },
    );

    if (dto.warranty_status === 'success') {
      return issue;
    }

    if (dto.warranty_status === 'fail') {
      // cancel all remaining tasks. Add a task: bring final device to warehouse
      const remainingIssues = issue.task.issues.filter(
        (issue) => issue.id !== issueId,
      );
      remainingIssues.forEach(async (issue) => {
        await this.issueRepository.update(
          {
            id: issue.id,
          },
          {
            status: IssueStatus.CANCELLED,
          },
        );
      });

      // add issue
      const bringDeviceToWarehouseIssue = await this.issueRepository.save({
        typeError: {
          id: Warranty.return_to_warehouse,
        },
        fixType: FixItemType.REPLACE,
        status: IssueStatus.PENDING,
        description: '',
        request: {
          id: issue.request.id,
        },
        task: {
          id: issue.task.id,
        },
      });
    }

    return issue;
  }
}
