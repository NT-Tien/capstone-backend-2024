import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/base/service.base';
import { TaskEntity, TaskStatus } from 'src/entities/task.entity';
import { Repository } from 'typeorm';
import { TaskRequestDto } from './dto/request.dto';
import { SparePartEntity } from 'src/entities/spare-part.entity';
import { IssueStatus } from 'src/entities/issue.entity';

@Injectable()
export class TaskService extends BaseService<TaskEntity> {
  constructor(
    @InjectRepository(TaskEntity)
    private readonly taskRepository: Repository<TaskEntity>,
    @InjectRepository(SparePartEntity)
    private readonly sparePartRepository: Repository<SparePartEntity>,
  ) {
    super(taskRepository);
  }

  async getAllTasksWithSearchAndOrder(
    page: number,
    limit: number,
    searchDto: TaskRequestDto.TaskSearchQueryDto,
    orderDto: TaskRequestDto.TaskOrderQueryDto,
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

    if (searchDto.confirmReceipt) {
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
  ): Promise<[TaskEntity[], number]> {
    return this.taskRepository.findAndCount({
      where: {
        confirmReceipt: false,
      },
      relations: [
        'fixer',
        'device.machineModel',
        'issues',
        'issues.issueSpareParts',
        'issues.issueSpareParts.sparePart',
      ],
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  async customGetAllTaskReturn(
    page: number,
    limit: number,
    status: TaskStatus,
  ): Promise<[TaskEntity[], number]> {
    return this.taskRepository.findAndCount({
      where: {
        status: status ? status : undefined,
      },
      relations: ['fixer', 'device.machineModel'],
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  async getOneTask(id: string) {
    return await this.taskRepository.findOne({
      where: { id },
      relations: [
        'fixer',
        'device.machineModel',
        'device.machineModel.spareParts',
        'issues',
        'issues.typeError',
        'issues.issueSpareParts',
        'issues.issueSpareParts.sparePart',
      ],
    });
  }

  async confirmReceipt(taskId: string, userId: string) {
    let task = await this.taskRepository.findOne({
      where: { id: taskId.trim() },
      relations: [
        'fixer',
        'issues',
        'issues.issueSpareParts',
        'issues.issueSpareParts.sparePart',
      ],
    });

    if (!task) {
      throw new HttpException('Task not found', HttpStatus.NOT_FOUND);
    }

    // decrease spare part quantity in db
    // for (let issue of task.issues) {
    //   for (let issueSparePart of issue.issueSpareParts) {
    //     let sparePart = await this.sparePartRepository.findOne({
    //       where: { id: issueSparePart.sparePart.id },
    //     });
    //     if (!sparePart) {
    //       throw new HttpException('Spare part not found', HttpStatus.NOT_FOUND);
    //     }
    //     sparePart.quantity -= issueSparePart.quantity;
    //     await this.sparePartRepository.save(sparePart);
    //   }
    // }
    task.confirmReceipt = true;
    task.confirmReceiptBY = userId;
    return await this.taskRepository.save(task);
  }

  async confirmReceiptReturn(taskId: string, userId: string) {
    let task = await this.taskRepository.findOne({
      where: { id: taskId.trim() },
      relations: [
        'fixer',
        'issues',
        'issues.issueSpareParts',
        'issues.issueSpareParts.sparePart',
      ],
    });

    if (!task) {
      throw new HttpException('Task not found', HttpStatus.NOT_FOUND);
    }

    // check spare part
    for (let issue of task.issues) {
      if (issue.status === IssueStatus.FAILED) {
        for (let issueSparePart of issue.issueSpareParts) {
          let sparePart = await this.sparePartRepository.findOne({
            where: { id: issueSparePart.sparePart.id },
          });
          if (!sparePart) {
            throw new HttpException(
              'Spare part not found',
              HttpStatus.NOT_FOUND,
            );
          }
        }
      }
    }
    // return spare part quantity in db
    for (let issue of task.issues) {
      if (issue.status === IssueStatus.FAILED) {
        for (let issueSparePart of issue.issueSpareParts) {
          let sparePart = await this.sparePartRepository.findOne({
            where: { id: issueSparePart.sparePart.id },
          });
          if (!sparePart) {
            throw new HttpException(
              'Spare part not found',
              HttpStatus.NOT_FOUND,
            );
          }
          sparePart.quantity += issueSparePart.quantity;
          await this.sparePartRepository.save(sparePart);
        }
      }
    }
    task.confirm_recieve_return_spare_part = userId;
    task.status = TaskStatus.CONFRIM_RECEIPT_RETURN_SPARE_PART;
    return await this.taskRepository.save(task);
  }

  async pendingSparePart(
    taskId: string,
    payload: TaskRequestDto.StockkeeperPendingSparePart,
    userId: string,
  ) {
    let task = await this.taskRepository.findOne({
      where: { id: taskId.trim() },
    });

    if (!task) {
      throw new HttpException('Task not found', HttpStatus.NOT_FOUND);
    }
    task.status = TaskStatus.AWAITING_SPARE_SPART;
    task.stockkeeperNote = payload.stockkeeperNote;
    task.stockkeeperNoteId = userId;
    return await this.taskRepository.save(task);
  }
}
