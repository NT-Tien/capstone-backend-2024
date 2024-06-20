import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UUID } from 'crypto';
import { BaseService } from 'src/common/base/service.base';
import { SparePartEntity } from 'src/entities/spare-part.entity';
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

  async getStaffTask(userId: string): Promise<TaskEntity[]> {
    // Fetch the tasks based on the userId
    const tasks = await this.taskRepository.find({ where: { fixer: { id: userId } } 
    , order: {
      priority: 'DESC', // Adjust 'priority' column ordering
      createdAt: 'DESC', // Adjust 'time' column ordering
    }
    });
    return tasks;
  }

  async getCurrentTask(userId: string): Promise<TaskEntity> {
    // Fetch the tasks based on the userId
    const tasks = await this.taskRepository.findOne(
      { where: 
        { fixer: { id: userId }, status: TaskStatus.IN_PROGRESS }, 
        relations: ['device', 'request', 'issues', 'fixer'], 
      });
    return tasks;
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

  async getbyid(id: string): Promise<TaskEntity> {
    const tasks = await this.taskRepository.findOne({
      where:{ id : id},
      relations: ['device', 'request', 'issues', 'fixer'],
    });
    return tasks;
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
