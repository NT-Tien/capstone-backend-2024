import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/base/service.base';
import { TaskEntity, TaskStatus } from 'src/entities/task.entity';
import { Repository } from 'typeorm';
import { TaskRequestDto } from './dto/request.dto';
import { SparePartEntity } from 'src/entities/spare-part.entity';

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

  async customGetAllTask(
    page: number,
    limit: number,
  ): Promise<[TaskEntity[], number]> {
    return this.taskRepository.findAndCount({
      where: {
        confirmReceipt: false,
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
}
