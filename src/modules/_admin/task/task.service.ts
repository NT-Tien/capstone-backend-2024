import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { endOfDay, subMonths, subWeeks, subYears } from 'date-fns';
import { BaseService } from 'src/common/base/service.base';
import { AccountEntity } from 'src/entities/account.entity';
import { RequestEntity } from 'src/entities/request.entity';
import { TaskEntity, TaskStatus } from 'src/entities/task.entity';
import { Between, Repository } from 'typeorm';
import { TaskRequestDto } from './dto/request.dto';

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

  async getAllTasksWithFilterAndOrder(
    page: number,
    limit: number,
    searchDto: TaskRequestDto.TaskFilterDto,
    orderDto: TaskRequestDto.TaskOrderDto,
  ) {
    const query = this.taskRepository
      .createQueryBuilder('task')
      .leftJoinAndSelect('task.fixer', 'fixer')
      .leftJoinAndSelect('task.device', 'device')
      .leftJoinAndSelect('device.machineModel', 'machineModel')
      .where('task.deletedAt IS NULL');

    if (searchDto.id) {
      query.andWhere('task.id = :id', { id: searchDto.id });
    }

    if (searchDto.name) {
      query.andWhere('task.name LIKE :name', { name: `%${searchDto.name}%` });
    }

    if (searchDto.priority) {
      query.andWhere('task.priority = :priority', {
        priority: searchDto.priority,
      });
    }

    if (searchDto.status) {
      query.andWhere('task.status = :status', { status: searchDto.status });
    }

    if (searchDto.deviceId) {
      query.andWhere('task.device = :deviceId', {
        deviceId: searchDto.deviceId,
      });
    }

    if (searchDto.requestId) {
      query.andWhere('task.request = :requestId', {
        requestId: searchDto.requestId,
      });
    }

    if (searchDto.fixerName) {
      query.andWhere('fixer.username = :fixerName', {
        fixerName: searchDto.fixerName,
      });
    }

    if (
      searchDto.confirmReceipt !== undefined &&
      searchDto.confirmReceipt !== null
    ) {
      query.andWhere('task.confirmReceipt = :confirmReceipt', {
        confirmReceipt: searchDto.confirmReceipt,
      });
    }

    if (searchDto.machineModelId) {
      query.andWhere('machineModel.id = :machineModelId', {
        machineModelId: searchDto.machineModelId,
      });
    }

    if (searchDto.fixerDate) {
      query.andWhere('DATE(task.fixerDate) = :fixerDate', {
        fixerDate: searchDto.fixerDate,
      });
    }

    if (searchDto.totalTime) {
      query.andWhere('task.totalTime = :totalTime', {
        totalTime: searchDto.totalTime,
      });
    }

    if (orderDto.order && orderDto.orderBy) {
      query.orderBy(`task.${orderDto.orderBy}`, orderDto.order);
    }

    return await query
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();
  }

  async customGetAllTask(
    page: number,
    limit: number,
    status: TaskStatus,
    time: number,
  ): Promise<[TaskEntity[], number]> {
    let dateRange: { createdAt: any };

    // Tính toán khoảng thời gian dựa trên giá trị time
    const currentDate = new Date();
    if (time == 1) {
      // Lọc theo tuần (7 ngày trước)
      dateRange = {
        createdAt: Between(subWeeks(currentDate, 1), endOfDay(currentDate)),
      };
    } else if (time == 2) {
      // Lọc theo tháng (30 ngày trước)
      dateRange = {
        createdAt: Between(subMonths(currentDate, 1), endOfDay(currentDate)),
      };
    } else if (time == 3) {
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

  async getAllInfoTaskByAreaId(areaId: string) {
    return await this.taskRepository.find({
      where: {
        device: {
          area: {
            id: areaId,
          },
        },
      },
      relations: ['request'],
    });
  }
}
