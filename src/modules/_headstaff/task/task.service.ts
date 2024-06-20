import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/base/service.base';
import { AccountEntity } from 'src/entities/account.entity';
import { TaskEntity, TaskStatus } from 'src/entities/task.entity';
import { Repository } from 'typeorm';
import { TaskRequestDto } from './dto/request.dto';

@Injectable()
export class TaskService extends BaseService<TaskEntity> {
  constructor(
    @InjectRepository(TaskEntity)
    private readonly taskRepository: Repository<TaskEntity>,
    @InjectRepository(AccountEntity)
    private readonly accountRepository: Repository<AccountEntity>,
  ) {
    super(taskRepository);
  }

  async customGetAllTask(page: number, limit: number, status: TaskStatus): Promise<[TaskEntity[], number]> {
    return this.taskRepository.findAndCount({
      where: {
        status: status ? status : undefined,
      },
      relations: ['request', 'fixer', 'request.requester'],
      order: {createdAt: 'DESC'},
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  async assignFixer(taskId: string, data: TaskRequestDto.TaskAssignFixerDto) {
    const task = await this.taskRepository.findOne({where: {id: taskId}});
    if (!task || task.status !== TaskStatus.AWAITING_FIXER || task.fixer) {
      throw new Error('Task not found or invalid status');
    }
    const fixer = await this.accountRepository.findOne({where: {id: data.fixer}});
    task.fixer = fixer;
    task.status = TaskStatus.ASSIGNED;
    return await this.taskRepository.save(task);
  }
}
