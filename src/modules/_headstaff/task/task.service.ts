import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/base/service.base';
import { AccountEntity, Role } from 'src/entities/account.entity';
import { TaskEntity, TaskStatus } from 'src/entities/task.entity';
import { Repository } from 'typeorm';
import { TaskRequestDto } from './dto/request.dto';
import { RequestEntity, RequestStatus } from 'src/entities/request.entity';
import { IssueStatus } from 'src/entities/issue.entity';
import { SparePartEntity } from 'src/entities/spare-part.entity';

@Injectable()
export class TaskService extends BaseService<TaskEntity> {
  constructor(
    @InjectRepository(TaskEntity)
    private readonly taskRepository: Repository<TaskEntity>,
    @InjectRepository(SparePartEntity)
    private readonly sparePartRepository: Repository<SparePartEntity>,
    @InjectRepository(AccountEntity)
    private readonly accountRepository: Repository<AccountEntity>,
    @InjectRepository(RequestEntity)
    private readonly requestRepository: Repository<RequestEntity>,
  ) {
    super(taskRepository);
  }

  async customGetAllTask(
    page: number,
    limit: number,
    status: TaskStatus,
  ): Promise<[TaskEntity[], number]> {
    return this.taskRepository.findAndCount({
      where: {
        status: status ? status : undefined,
      },
      relations: [
        'request',
        'fixer',
        'request.requester',
        'device',
        'device.area',
        'device.machineModel',
      ],
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  async customGetAllTaskDashboard(
    status: TaskStatus,
  ): Promise<[TaskEntity[], number]> {
    return this.taskRepository.findAndCount({
      where: {
        status: status ? status : undefined,
      },
    });
  }

  async getOneTask(id: string) {
    return await this.taskRepository.findOne({
      where: { id },
      relations: [
        'request',
        'fixer',
        'request.requester',
        'device',
        'device.area',
        'device.machineModel',
        'device.machineModel.spareParts',
        'device.machineModel.typeErrors',
        'issues',
        'issues.typeError',
        'issues.issueSpareParts',
        'issues.issueSpareParts.sparePart',
      ],
    });
  }

  async customCreateTask(data: TaskRequestDto.TaskCreateDto) {
    // check request has been assigned to a task (status != cancelled or == completed)
    const request = await this.requestRepository.findOne({
      where: { id: data.request },
      relations: ['tasks', 'device'],
    });
    if (!request || request.status === RequestStatus.REJECTED) {
      throw new Error('Request not found or invalid status');
    }
    // let allCancelled = true;
    // for (let task of request.tasks) {
    //   if (task.status == TaskStatus.COMPLETED) {
    //     throw new Error('Request has been completed');
    //   }
    //   if (task.status !== TaskStatus.CANCELLED) {
    //     allCancelled = false;
    //   }
    // }
    // if (!allCancelled) {
    //   throw new Error('All tasks must be cancelled before creating a new task for this request');
    // }

    let newTask = new TaskEntity();
    newTask.request = request;
    newTask.device = request.device;
    if (data.fixer) {
      const fixer = await this.accountRepository.findOne({
        where: {
          id: data.fixer,
          role: Role.staff,
        },
      });

      if (!fixer) {
        throw new Error('Fixer not found');
      }

      newTask.fixer = fixer;
      newTask.status = TaskStatus.ASSIGNED;
    } else {
      newTask.status = TaskStatus.AWAITING_FIXER;
    }
    let newTaskResult = await this.taskRepository.save({
      ...data,
      ...newTask,
    } as any);
    // assign issues to task
    let newIssuesAdded = await this.taskRepository
      .createQueryBuilder('task')
      .relation(TaskEntity, 'issues')
      .of(newTaskResult.id)
      .add(data.issueIDs);

    return { ...newTaskResult, issues: newIssuesAdded };
  }

  async updateTaskStausToAwaitingFixer(taskId: string, sparePartId: string, quantity: number) {
    // check task status is awaiting spare part and spare part quantity is enough
    const task = await this.taskRepository.findOne({
      where: { id: taskId },
    });
    if (!task || task.status == TaskStatus.AWAITING_SPARE_SPART) {
      throw new Error('Task not found or invalid status');
    }
    const sparePart = await this.sparePartRepository.findOne({
      where: { id: sparePartId },
    });
    if (!sparePart || sparePart.quantity < quantity) {
      throw new Error('Spare part not found or not enough quantity');
    }
    // update spare part quantity
    sparePart.quantity -= quantity;
    await this.sparePartRepository.save(sparePart);
    task.status = TaskStatus.AWAITING_FIXER;
    await this.taskRepository.save(task);
    return task;
  }

  async assignFixer(taskId: string, data: TaskRequestDto.TaskAssignFixerDto) {
    const task = await this.taskRepository.findOne({ where: { id: taskId } });
    if (!task || task.status !== TaskStatus.AWAITING_FIXER || task.fixer) {
      throw new Error('Task not found or invalid status');
    }
    const fixer = await this.accountRepository.findOne({
      where: { id: data.fixer },
    });
    task.fixer = fixer;
    task.status = TaskStatus.ASSIGNED;
    return await this.taskRepository.save(task);
  }

  async completeTask(id: string) {
    const task = await this.taskRepository.findOne({
      where: {
        id,
      },
      relations: ['request'],
    });

    task.status = TaskStatus.COMPLETED;
    const result = await this.taskRepository.save(task);

    const request = await this.requestRepository.findOne({
      where: { id: task.request.id },
      relations: ['issues', 'tasks'],
      select: {
        issues: {
          id: true,
          status: true,
        },
        tasks: {
          id: true,
          status: true
        }
      },
    });

    const hasUncompletedIssue = request.issues.find((issue) => {
      return issue.status === IssueStatus.PENDING;
    });
    const hasUncompletedTask = request.tasks.find((task) => {
      return task.status !== TaskStatus.COMPLETED;
    })
    if (!hasUncompletedIssue && !hasUncompletedTask) {
      request.status = RequestStatus.HEAD_CONFIRM;
      await this.requestRepository.save(request);
    }


    return result;
  }
}
