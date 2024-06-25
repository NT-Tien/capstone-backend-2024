import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { log } from 'console';
import { UUID } from 'crypto';
import { BaseService } from 'src/common/base/service.base';
import { TaskEntity, TaskStatus } from 'src/entities/task.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TaskService extends BaseService<TaskEntity> {
  constructor(
    @InjectRepository(TaskEntity)
    private readonly taskRepository: Repository<TaskEntity>,

  ) {
    
    super(taskRepository);
  }

  
  async staffGetAllTask(userId: string,page: number, limit: number, 
      status: TaskStatus): Promise<[TaskEntity[], number]> {
    return this.taskRepository.findAndCount({
      where: {
        status: status ? status : undefined,
        fixer: { id: userId }
      },
      relations: [
        'request',
        'fixer',
        'request.requester',
        'device',
        'device.machineModel',
        'device.machineModel.spareParts',
        'device.machineModel.typeErrors',
      ],
      order: {
        priority: 'DESC', // Adjust 'priority' column ordering
        createdAt: 'DESC', // Adjust 'time' column ordering
      },
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  async getCurrentTask(userId: string): Promise<TaskEntity> {
    return await this.taskRepository.findOne({
      where: {
        fixer: { id: userId },
        status: TaskStatus.IN_PROGRESS
      },
      relations: [
        'request',
        'fixer',
        'request.requester',
        'device',
        'device.machineModel',
        'device.machineModel.spareParts',
        'device.machineModel.typeErrors',
      ],
    });
  }

  async getTaskByStatus(userId: string, status: string): Promise<TaskEntity[]> {
    const parsedStatus: TaskStatus | undefined = this.parseTaskStatus(status);
    if (parsedStatus === undefined) {
      throw new Error(`Invalid status: ${status}`);
    }
    const tasks = await this.taskRepository.find(
      { where: 
        { fixer: { id: userId }, status: parsedStatus }    
      });
    return tasks;
  }

  async getbyid(taskid: UUID, userid: UUID) {
    return await this.taskRepository.findOneOrFail({
      where: {
        id: taskid,
        fixer: { id: userid },
      },
      relations: [
        'request',
        'fixer',
        'request.requester',
        'device',
        'device.machineModel',
        'device.machineModel.spareParts',
        'device.machineModel.typeErrors',
      ],
    });
  }

  private parseTaskStatus(statusString: string): TaskStatus | undefined {
    const statusMap: Record<string, TaskStatus> = {
      'AWAITING_FIXER': TaskStatus.AWAITING_FIXER,
      'PENDING_STOCK': TaskStatus.PENDING_STOCK,
      'ASSIGNED': TaskStatus.ASSIGNED,
      'IN_PROGRESS': TaskStatus.IN_PROGRESS,
      'COMPLETED': TaskStatus.COMPLETED,
      'CANCELLED': TaskStatus.CANCELLED,
    };

    return statusMap[statusString];
  }


}
