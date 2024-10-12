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
      .leftJoinAndSelect('task.request', 'request')
      .leftJoinAndSelect('task.fixer', 'fixer')
      .leftJoinAndSelect('task.device', 'device')
      .leftJoinAndSelect('device.area', 'area')
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

    if(searchDto.areaId) {
      query.andWhere('area.id = :areaId', {
        areaId: searchDto.areaId,
      });
    }

    if (searchDto.deviceId) {
      query.andWhere('task.device = :deviceId', {
        deviceId: searchDto.deviceId,
      });
    }

    if(searchDto.is_warranty !== undefined && searchDto.is_warranty !== null) {
      query.andWhere('request.is_warranty = :is_warranty', {
        is_warranty: searchDto.is_warranty,
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

  async getDashboardInfo(dto: TaskRequestDto.DashboardInfoDto) {
    const query = this.taskRepository
      .createQueryBuilder('task')
      .leftJoinAndSelect('task.request', 'request')
      .leftJoinAndSelect('task.device', 'device')
      .leftJoinAndSelect('device.area', 'area')
      .leftJoinAndSelect('task.issues', 'issues')
      .leftJoinAndSelect('issues.issueSpareParts', 'issueSpareParts');

    switch (dto.type) {
      case 'warranty': {
        query.where('request.is_warranty = :is_warranty', { is_warranty: true });
        break;
      }
      case 'renew': {
        query.where('request.is_renew = :is_renew', {
          is_renew: true,
        });
        break;
      }
      case 'fix': {
        query.where('request.is_warranty = :is_warranty', {
          is_warranty: false,
        });
        query.andWhere('request.is_renew = :is_renew', {
          is_renew: false,
        });
        break;
      }
      case 'all': {
        break;
      }
    }
    console.log(dto.startDate, dto.endDate);
    query.andWhere('request.createdAt >= :startDate', {
      startDate: dto.startDate,
    });

    query.andWhere('request.createdAt <= :endDate', {
      endDate: dto.endDate,
    });

    if(dto.areaId) {
      query.andWhere('area.id = :areaId', {
        areaId: dto.areaId,
      });
    }

    return {
      [TaskStatus.AWAITING_SPARE_SPART]: await query
        .andWhere('task.status = :status', {
          status: TaskStatus.AWAITING_SPARE_SPART,
        })
        .getCount(),
      [TaskStatus.AWAITING_FIXER]: await query
        .andWhere('task.status = :status', {
          status: TaskStatus.AWAITING_FIXER,
        })
        .getCount(),
      [TaskStatus.ASSIGNED]: await query
        .andWhere('task.status = :status', {
          status: TaskStatus.ASSIGNED,
        })
        .getCount(),
      // 'spare-part-fetched': await query
      //   .andWhere('task.status = :status', {
      //     status: TaskStatus.ASSIGNED,
      //   })
      //   .andWhere('task.confirmReceipt = :confirmReceipt', {
      //     confirmReceipt: true,
      //   })
      //   .getCount(),
      [TaskStatus.IN_PROGRESS]: await query
        .andWhere('task.status = :status', {
          status: TaskStatus.IN_PROGRESS,
        })
        .getCount(),
      [TaskStatus.HEAD_STAFF_CONFIRM]: await query
        .andWhere('task.status = :status', {
          status: TaskStatus.HEAD_STAFF_CONFIRM,
        })
        .getCount(),
      [TaskStatus.COMPLETED]: await query
        .andWhere('task.status = :status', {
          status: TaskStatus.COMPLETED,
        })
        .getCount(),
      [TaskStatus.CANCELLED]: await query
        .andWhere('task.status = :status', {
          status: TaskStatus.CANCELLED,
        })
        .getCount(),
    };
  }
}
