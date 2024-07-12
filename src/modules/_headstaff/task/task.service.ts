import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/base/service.base';
import { AccountEntity } from 'src/entities/account.entity';
import { TaskEntity, TaskStatus } from 'src/entities/task.entity';
import { Repository } from 'typeorm';
import { TaskRequestDto } from './dto/request.dto';
import { RequestEntity, RequestStatus } from 'src/entities/request.entity';

@Injectable()
export class TaskService extends BaseService<TaskEntity> {
  constructor(
    @InjectRepository(TaskEntity)
    private readonly taskRepository: Repository<TaskEntity>,
    @InjectRepository(AccountEntity)
    private readonly accountRepository: Repository<AccountEntity>,
    @InjectRepository(RequestEntity)
    private readonly requestRepository: Repository<RequestEntity>,
  ) {
    super(taskRepository);
  }

  async customGetAllTask(page: number, limit: number, status: TaskStatus): Promise<[TaskEntity[], number]> {
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
      ]
    });
  }

  async customCreateTask(data: TaskRequestDto.TaskCreateDto) {
    // check request has been assigned to a task (status != cancelled or == completed)
    const request = await this.requestRepository.findOne({ where: { id: data.request }, relations: ['tasks', 'device'] });
    if (!request || request.status === RequestStatus.REJECTED) {
      throw new Error('Request not found or invalid status');
    }
    let allCancelled = true;
    for (let task of request.tasks) {
      if (task.status == TaskStatus.COMPLETED) {
        throw new Error('Request has been completed');
      }
      if (task.status !== TaskStatus.CANCELLED) {
        allCancelled = false;
      }
    }
    if (!allCancelled) {
      throw new Error('All tasks must be cancelled before creating a new task for this request');
    }

    let newTask = new TaskEntity();
    newTask.request = request;
    newTask.device = request.device;
    newTask.status = TaskStatus.AWAITING_FIXER;
    let newTaskResult = await this.taskRepository.save({ ...data, ...newTask });
    // assign issues to task
    let newIssuesAdded = await this.taskRepository.createQueryBuilder('task')
      .relation(TaskEntity, 'issues')
      .of(newTaskResult.id)
      .add(data.issueIDs);

    return { ...newTaskResult, issues: newIssuesAdded };
  }

  async assignFixer(taskId: string, data: TaskRequestDto.TaskAssignFixerDto) {
    const task = await this.taskRepository.findOne({ where: { id: taskId } });
    if (!task || task.status !== TaskStatus.AWAITING_FIXER || task.fixer) {
      throw new Error('Task not found or invalid status');
    }
    const fixer = await this.accountRepository.findOne({ where: { id: data.fixer } });
    task.fixer = fixer;
    task.status = TaskStatus.ASSIGNED;
    return await this.taskRepository.save(task);
  }
}
