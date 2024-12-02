import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/base/service.base';
import { AccountEntity, Role } from 'src/entities/account.entity';
import {
  exportStatus,
  ExportWareHouse,
} from 'src/entities/export-warehouse.entity';
import { IssueSparePartEntity } from 'src/entities/issue-spare-part.entity';
import { IssueEntity, IssueStatus } from 'src/entities/issue.entity';
import { NotificationType } from 'src/entities/notification.entity';
import { RequestEntity, RequestStatus } from 'src/entities/request.entity';
import { SparePartEntity } from 'src/entities/spare-part.entity';
import { TaskEntity, TaskStatus } from 'src/entities/task.entity';
import { HeadStaffNotificationGateway } from 'src/modules/notifications/gateways/head-staff.gateway';
import { HeadNotificationGateway } from 'src/modules/notifications/gateways/head.gateway';
import { Between, Repository } from 'typeorm';
import { TaskRequestDto } from './dto/request.dto';

@Injectable()
export class TaskService extends BaseService<TaskEntity> {
  constructor(
    @InjectRepository(TaskEntity)
    private readonly taskRepository: Repository<TaskEntity>,
    @InjectRepository(AccountEntity)
    private readonly accountRepository: Repository<AccountEntity>,
    @InjectRepository(IssueEntity)
    private readonly issueRepository: Repository<IssueEntity>,
    @InjectRepository(IssueSparePartEntity)
    private readonly issueSparePartRepository: Repository<IssueSparePartEntity>,
    @InjectRepository(SparePartEntity)
    private readonly sparePartRepository: Repository<SparePartEntity>,
    @InjectRepository(ExportWareHouse)
    private readonly exportWareHouseRepository: Repository<ExportWareHouse>,
    @InjectRepository(RequestEntity)
    private readonly requestRepository: Repository<RequestEntity>,

    private readonly headStaffGateway: HeadStaffNotificationGateway,
    private readonly headGateway: HeadNotificationGateway,
  ) {
    super(taskRepository);
  }

  async staffGetAllTask(userId: string) {
    console.log(userId);

    let account = await this.accountRepository.findOne({
      where: { id: userId },
    });
    if (!account || account.deletedAt || account.role !== Role.staff) {
      throw new HttpException('Account is not valid', HttpStatus.BAD_REQUEST);
    }
    return this.taskRepository
      .createQueryBuilder('task')
      .leftJoinAndSelect('task.device', 'device')
      .leftJoinAndSelect('device.area', 'area')
      .leftJoinAndSelect('task.fixer', 'fixer')
      .leftJoinAndSelect('task.issues', 'issues')
      .andWhere('fixer.id = :id', { id: userId })
      .getMany();
  }

  async staffGetAllTaskByDate(
    userId: string,
    dto: TaskRequestDto.TaskAllByDate,
  ) {
    let account = await this.accountRepository.findOne({
      where: { id: userId },
    });
    if (!account || account.deletedAt || account.role !== Role.staff) {
      throw new HttpException('Account is not valid', HttpStatus.BAD_REQUEST);
    }
    const startOfDay = new Date(dto.start_date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(dto.end_date);
    endOfDay.setHours(23, 59, 59, 999);

    return this.taskRepository.find({
      where: {
        fixer: { id: userId },
        fixerDate: Between(startOfDay, endOfDay),
      },
      relations: [
        'export_warehouse_ticket',
        'device',
        'device.area',
        'fixer',
        'issues',
        'issues.typeError',
      ],
    });
  }

  async staffGetAllTaskCounts(
    userId: string,
    dto: TaskRequestDto.TaskAllCount,
  ) {
    const startOfMonth = new Date(dto.year, dto.month - 1, 1);
    const endOfMonth = new Date(dto.year, dto.month, 0, 23, 59, 59, 999);
    return this.taskRepository
      .createQueryBuilder('task')
      .select('task.fixer_date', 'fixer_date')
      .addSelect('COUNT(1)', 'count')
      .where('task.fixerId = :id', { id: userId })
      .andWhere('task.fixer_date < :endOfMonth', { endOfMonth })
      .andWhere('task.fixer_date >= :startOfMonth', { startOfMonth })
      .groupBy('task.fixer_date')
      .getRawMany();
  }

  async getAllInProgressTasks(userId: string) {
    return this.taskRepository.find({
      where: {
        fixer: {
          id: userId,
        },
        status: TaskStatus.IN_PROGRESS,
      },
      relations: [
        'export_warehouse_ticket',
        'device',
        'device.area',
        'fixer',
        'issues',
        'issues.typeError',
      ],
    });
  }

  async customStaffGetTaskDetail(userId: string, taskId: string) {
    let account = await this.accountRepository.findOne({
      where: { id: userId },
    });
    if (!account || account.deletedAt || account.role !== Role.staff) {
      throw new HttpException('Account is not valid', HttpStatus.BAD_REQUEST);
    }
    return this.taskRepository
      .createQueryBuilder('task')
      .leftJoinAndSelect('task.device', 'device')
      .leftJoinAndSelect('device.area', 'area')
      .leftJoinAndSelect('device.machineModel', 'machineModel')
      .leftJoin('task.fixer', 'fixer')
      .addSelect(['fixer.id', 'fixer.username', 'fixer.phone'])
      .leftJoinAndSelect('task.issues', 'issues')
      .leftJoinAndSelect('issues.issueSpareParts', 'issueSpareParts')
      .leftJoinAndSelect('task.request', 'request')
      .leftJoin('request.requester', 'requester')
      .addSelect(['requester.id', 'requester.username', 'requester.phone'])
      .leftJoinAndSelect('request.tasks', 'tasks') // so that staff can find the "send to warranty" request
      .leftJoinAndSelect('tasks.issues', 'taskIssues')
      .leftJoinAndSelect('taskIssues.typeError', 'taskIssueTypeError')
      .leftJoinAndSelect('issues.typeError', 'typeError')
      .leftJoinAndSelect('issueSpareParts.sparePart', 'sparePart')
      .leftJoinAndSelect('task.device_renew', 'device_renew')
      .leftJoinAndSelect('device_renew.machineModel', 'renewMachineModel')
      .leftJoinAndSelect(
        'task.export_warehouse_ticket',
        'export_warehouse_ticket',
      )
      .where('task.id = :taskId', { taskId })
      .andWhere('fixer.id = :id', { id: userId })
      .getOne();
  }

  async confirmReceipt(userId: string, taskId: string) {
    let task = await this.taskRepository.findOne({
      where: { id: taskId },
      relations: [
        'fixer',
        'issues',
        'issues.issueSpareParts',
        'issues.issueSpareParts.sparePart',
      ],
    });

    if (!task || task.fixer.id !== userId) {
      throw new HttpException('Task not found', HttpStatus.NOT_FOUND);
    }
    // decrease spare part quantity in db
    for (let issue of task.issues) {
      for (let issueSparePart of issue.issueSpareParts) {
        let sparePart = await this.sparePartRepository.findOne({
          where: { id: issueSparePart.sparePart.id },
        });
        if (!sparePart) {
          throw new HttpException('Spare part not found', HttpStatus.NOT_FOUND);
        }
        sparePart.quantity -= issueSparePart.quantity;
        await this.sparePartRepository.save(sparePart);
      }
    }
    task.confirmReceipt = true;
    task.confirmReceiptBY = userId;
    return await this.taskRepository.save(task);
  }

  // update issue status
  async updateIssueStatus(
    userId: string,
    issueId: string,
    status: IssueStatus,
  ) {
    let issue = await this.issueRepository.findOne({
      where: { id: issueId },
      relations: ['task', 'task.fixer'],
    });
    if (!issue || issue.task.fixer.id !== userId) {
      throw new HttpException('Issue not found', HttpStatus.NOT_FOUND);
    }
    issue.status = status;
    return await this.issueRepository.save(issue);
  }

  // confirm in process
  async confirmInProcess(userId: string, taskId: string) {
    let task = await this.taskRepository.findOne({
      where: { id: taskId },
      relations: ['fixer', 'request'],
    });
    if (!task || task.fixer.id !== userId) {
      throw new HttpException('Task not found', HttpStatus.NOT_FOUND);
    }

    // check export-warehouse is exist or not if exist check it status is accepted
    let export_warehouse = await this.exportWareHouseRepository.findOne({
      where: {
        task: task,
      },
    });

    if (export_warehouse && export_warehouse.status != exportStatus.ACCEPTED) {
      throw new HttpException('Export ticket is not avaiable', 400);
    }

    // just only accept 1 time 1 task staff can in process
    let taskInProcess = await this.taskRepository.findOne({
      where: { fixer: { id: userId }, status: TaskStatus.IN_PROGRESS },
    });
    if (taskInProcess) {
      throw new HttpException(
        'You are already in process another task',
        HttpStatus.BAD_REQUEST,
      );
    }
    // update request status when task is started
    if (task.request.status === RequestStatus.APPROVED) {
      await this.requestRepository.update(
        {
          id: task.request.id,
        },
        {
          status: RequestStatus.IN_PROGRESS,
        },
      );
    }
    task.status = TaskStatus.IN_PROGRESS;
    const save = await this.taskRepository.save(task);
    const response = await this.taskRepository.findOne({
      where: {
        id: save.id,
      },
      relations: [
        'request',
        'request.requester',
        'fixer',
        'device',
        'device.area',
        'device.machineModel',
      ],
    });

    this.headStaffGateway.emit(NotificationType.S_START_TASK)({
      senderId: response.fixer.id,
      taskName: response.name,
      fixerName: response.fixer.username,
      requestId: response.request.id,
    });

    return save;
  }

  // confirm completion
  async confirmCompletion(
    userId: string,
    taskId: string,
    data: TaskRequestDto.TaskConfirmDoneDto,
    autoClose?: string,
  ) {
    const task = await this.taskRepository.findOne({
      where: { id: taskId, fixer: { id: userId } },
      relations: [
        'fixer',
        'issues',
        'issues.typeError',
        'issues.issueSpareParts',
        'issues.issueSpareParts.sparePart',
        'request',
      ],
    });
    if (!task) {
      throw new HttpException('Task not found', HttpStatus.NOT_FOUND);
    }

    const hasFailedIssue = !!task.issues.find(
      (i) => i.status === IssueStatus.FAILED,
    );

    // if has failed issue, return to head staff for confirmation. else, go to head department to check
    const result = await this.taskRepository.save({
      ...task,
      status: hasFailedIssue
        ? TaskStatus.HEAD_STAFF_CONFIRM
        : TaskStatus.COMPLETED,
      last_issues_data: JSON.stringify(task.issues),
      completedAt: new Date(),
      ...data,
    });

    const request = await this.requestRepository.findOne({
      where: {
        id: task.request.id,
      },
      relations: ['tasks', 'requester'],
    });

    if (hasFailedIssue) {
      // notify head maintenance and stop there
      this.headStaffGateway.emit(
        NotificationType.S_COMPLETE_TASK_WITH_FAILED_ISSUE,
      )({
        senderId: userId,
        taskId: taskId,
        requestId: request.id,
      });

      return;
    }

    // else if all tasks are completed in request then notify head_department to feedback request & set request status to HEAD_CONFIRM

    const isAllTasksCompleted = request.tasks.every(
      (t) => t.status === TaskStatus.COMPLETED,
    );
    if (isAllTasksCompleted) {
      this.headGateway.emit(NotificationType.S_COMPLETE_ALL_TASKS)({
        senderId: userId,
        requestId: request.id,
        receiverId: request.requester.id,
      });
      await this.requestRepository.save({
        ...request,
        status: RequestStatus.HEAD_CONFIRM,
      });
    }

    return result;
  }

  async completeTaskWarranty(taskId: string, userId: string) {
    const task = await this.taskRepository.findOne({
      where: {
        id: taskId,
      },
      relations: [
        'request',
        'request.tasks',
        'request.tasks.issues',
        'request.tasks.issues.typeError',
        'fixer',
        'issues',
        'issues.typeError',
      ],
    });

    if (!task) {
      throw new HttpException('Task not found', HttpStatus.NOT_FOUND);
    }

    // update current task
    task.status = TaskStatus.COMPLETED;
    task.last_issues_data = JSON.stringify(task.issues);
    task.completedAt = new Date();

    const result = await this.taskRepository.save(task);

    // notify head_maintenance
    this.headStaffGateway.emit(NotificationType.S_COMPLETE_WARRANTY_SEND)({
      senderId: userId,
      requestCode: task.request.code,
      requestId: task.request.id,
    });

    return result;
  }

  async staffRequestCanncelTask(userId: string, taskId: string) {
    let task = await this.taskRepository.findOne({
      where: { id: taskId },
      relations: ['fixer'],
    });
    if (!task || task.fixer.id !== userId) {
      throw new HttpException('Task not found', HttpStatus.NOT_FOUND);
    }
    task.status = TaskStatus.CANCELLED;
    return await this.taskRepository.save(task);
  }

  // send

  // async getTaskByStatus(userId: string, status: string): Promise<TaskEntity[]> {
  //   const parsedStatus: TaskStatus | undefined = this.parseTaskStatus(status);
  //   if (parsedStatus === undefined) {
  //     throw new Error(`Invalid status: ${status}`);
  //   }
  //   const tasks = await this.taskRepository.find(
  //     { where:
  //       { fixer: { id: userId }, status: parsedStatus }
  //     });
  //   return tasks;
  // }

  // async checkReceipt(taskid: UUID): Promise<boolean> {// Fetch the task entity to ensure the task exists
  //  try{
  //   const task = await this.taskRepository.findOne({
  //     where: { id: taskid },
  //     relations: ['issues', 'issues.issueSpareParts'],
  //   });

  //   if (!task) {
  //     throw new Error('Task not found');
  //   }

  //   // Update status of all IssueSparePartEntities associated with the task
  //   for (const issue of task.issues) {
  //     await this.issueSparePartRepository.update(
  //       { issue: { id: issue.id } },
  //       { status: IssueSparePartStatus.RECIEVED },
  //     );
  //   }
  // } catch{
  //   return false;
  // }
  // }

  // async getbyid(taskid: UUID, userid: UUID) {
  //   return  await this.taskRepository.findOne({
  //     where: {
  //       id: taskid,
  //       fixer: { id: userid },
  //     },
  //     relations: [
  //       'request',
  //       'fixer',
  //       'request.requester',
  //       'device',
  //       'device.machineModel',
  //       'device.machineModel.spareParts',
  //       'device.machineModel.typeErrors',
  //       'issues',
  //       'issues.typeError',
  //       'issues.issueSpareParts',
  //       'issues.issueSpareParts.sparePart',
  //     ],
  //   });

  // }

  // async updateissueStatus(issueid: UUID, newStatus: string) :  Promise<boolean> {

  //   try{

  //     const issueSparePart = await this.issueSparePartRepository.findOne({ where: { id: issueid } });

  //     if (!issueSparePart) {
  //       throw new Error('IssueSparePart not found');
  //     }

  //     issueSparePart.status = newStatus as IssueSparePartStatus;
  //     await this.issueSparePartRepository.save(issueSparePart);

  //     return true;

  //     return true;
  //   }
  //   catch{
  //     return false;
  //   }
  // }

  // private parseTaskStatus(statusString: string): TaskStatus | undefined {
  //   const statusMap: Record<string, TaskStatus> = {
  //     'AWAITING_FIXER': TaskStatus.AWAITING_FIXER,
  //     'PENDING_STOCK': TaskStatus.PENDING_STOCK,
  //     'ASSIGNED': TaskStatus.ASSIGNED,
  //     'IN_PROGRESS': TaskStatus.IN_PROGRESS,
  //     'COMPLETED': TaskStatus.COMPLETED,
  //     'CANCELLED': TaskStatus.CANCELLED,
  //   };

  //   return statusMap[statusString];
  // }
}
