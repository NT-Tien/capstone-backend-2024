import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { BaseService } from '../../../common/base/service.base';
import {
  FixItemType,
  IssueEntity,
  IssueStatus,
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
import { RequestEntity } from 'src/entities/request.entity';
import { DeviceEntity } from 'src/entities/device.entity';

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
      relations: ['task', 'task.fixer'],
    });
    if (!issue || issue.task.fixer.id !== userId) {
      throw new HttpException('Issue not found', HttpStatus.NOT_FOUND);
    }
    // issue.status = IssueStatus.RESOLVED;
    // issue.imagesVerify = dto.imagesVerify;
    // issue.videosVerify = dto.videosVerify;
    // issue.resolvedNote = dto.resolvedNote;
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
      relations: ['task', 'task.fixer'],
    });
    if (!issue || issue?.task?.fixer.id !== userId) {
      throw new HttpException('Issue not found', HttpStatus.NOT_FOUND);
    }

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
      relations: ['task', 'task.fixer'],
    });
    if (!issue || issue?.task?.fixer.id !== userId) {
      throw new HttpException('Issue not found', HttpStatus.NOT_FOUND);
    }

    issue.status = IssueStatus.FAILED;
    issue.failReason = dto.failReason;
    issue.imagesVerifyFail = dto.imagesVerify;
    const save = await this.issueRepository.save(issue);

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
}
