import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/base/service.base';
import { AccountEntity } from 'src/entities/account.entity';
import { TaskEntity, TaskStatus } from 'src/entities/task.entity';
import { RequestEntity, RequestStatus } from 'src/entities/request.entity';
import { Between, LessThan, MoreThan, Repository } from 'typeorm';
import { subWeeks, subMonths, subYears, startOfDay, endOfDay } from 'date-fns';

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

  async customGetAllTask(
    page: number,
    limit: number,
    status: TaskStatus,
    time: number
  ): Promise<[TaskEntity[], number]> {

    let dateRange: { createdAt: any } = { createdAt: {} };

    // Tính toán khoảng thời gian dựa trên giá trị time
    const currentDate = new Date();
    if (time === 1) {
      // Lọc theo tuần (7 ngày trước)
      dateRange = {
        createdAt: Between(subWeeks(currentDate, 1), endOfDay(currentDate)),
      };
    } else if (time === 2) {
      // Lọc theo tháng (30 ngày trước)
      dateRange = {
        createdAt: Between(subMonths(currentDate, 1), endOfDay(currentDate)),
      };
    } else if (time === 3) {
      // Lọc theo năm (365 ngày trước)
      dateRange = {
        createdAt: Between(subYears(currentDate, 1), endOfDay(currentDate)),
      };
    }
    return this.taskRepository.findAndCount({
      where: {
        status: status ? status : undefined,
        ...dateRange,
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
      ],
    });
  }
}
