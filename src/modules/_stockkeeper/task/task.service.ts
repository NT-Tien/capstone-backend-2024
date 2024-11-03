import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/base/service.base';
import { TaskEntity, TaskStatus } from 'src/entities/task.entity';
import { Repository } from 'typeorm';
import { TaskRequestDto } from './dto/request.dto';
import { SparePartEntity } from 'src/entities/spare-part.entity';
import { IssueEntity, IssueStatus } from 'src/entities/issue.entity';
import { exportStatus, ExportWareHouse } from 'src/entities/export-warehouse.entity';

@Injectable()
export class TaskService extends BaseService<TaskEntity> {
  constructor(
    @InjectRepository(TaskEntity)
    private readonly taskRepository: Repository<TaskEntity>,
    @InjectRepository(IssueEntity)
    private readonly issueRepository: Repository<IssueEntity>,
    @InjectRepository(SparePartEntity)
    private readonly SparePartEntityRepository: Repository<SparePartEntity>,
    @InjectRepository(ExportWareHouse)
    private readonly ExportWareHouseRepository: Repository<ExportWareHouse>,
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
        'device_renew',
        'device_renew.machineModel',
      ],
    });
  }

  async confirmReceipt(
    taskId: string,
    dto: TaskRequestDto.TaskConfirmReceiptDto,
    userId: string,
  ) {
    let task = await this.taskRepository.findOne({
      where: { id: taskId.trim() },
      relations: [
        'export_warehouse_ticket',
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
        let sparePart = await this.SparePartEntityRepository.findOne({
          where: { id: issueSparePart.sparePart.id },
        });
        if (!sparePart) {
          throw new HttpException('Spare part not found', HttpStatus.NOT_FOUND);
        }
        sparePart.quantity -= issueSparePart.quantity;
        await this.SparePartEntityRepository.save(sparePart);
      }
    }

    if (task.export_warehouse_ticket && task.export_warehouse_ticket[0].status === exportStatus.ACCEPTED) {
      task.export_warehouse_ticket[0].status = exportStatus.EXPORTED;
      await this.ExportWareHouseRepository.save(task.export_warehouse_ticket[0]);
    } else {
      // rollback spare part quantity
      for (let issue of task.issues) {
        for (let issueSparePart of issue.issueSpareParts) {
          let sparePart = await this.SparePartEntityRepository.findOne({
            where: { id: issueSparePart.sparePart.id },
          });
          if (!sparePart) {
            throw new HttpException('Spare part not found', HttpStatus.NOT_FOUND);
          }
          sparePart.quantity += issueSparePart.quantity;
          await this.SparePartEntityRepository.save(sparePart);
        }
      }
      throw new HttpException('Export warehouse not found', HttpStatus.NOT_FOUND);
    }

    task.confirmReceipt = true;
    task.confirmSendBy = userId;
    task.confirmReceiptStockkeeperSignature = dto.stockkeeper_signature;
    task.confirmReceiptStaffSignature = dto.staff_signature;
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

  async returnSparePart(
    taskId: string,
    dto: TaskRequestDto.StockkeeperReturnSparePart,
    user: any,
  ) {
    const task = await this.taskRepository.findOne({
      where: { id: taskId },
      relations: ['issues', 'issues.issueSpareParts'],
    });

    if (!task) {
      throw new HttpException('Task not found', HttpStatus.NOT_FOUND);
    }

    const failedIssues = task.issues.filter(
      (issue) => issue.status === IssueStatus.FAILED,
    );
    const returnedSpareParts = failedIssues.map(
      (issue) => issue.issueSpareParts,
    );
    task.return_spare_part_data = returnedSpareParts;

    failedIssues.forEach(async (issue) => {
      issue.returnSparePartsStaffSignature = dto.staff_signature;
      issue.returnSparePartsStockkeeperSignature = dto.stockkeeper_signature;

      await this.issueRepository.save(issue);
    });

    return this.taskRepository.save(task);
  }

  async cancelTask(
    taskId: string,
    body: TaskRequestDto.StockkeeperCancelTask,
    user: any,
  ) {
    let task = await this.taskRepository.findOne({
      where: { id: taskId.trim() },
      relations: ['issues', 'issues.issueSpareParts', 'issues.typeError'],
    });

    if (!task) {
      throw new HttpException('Task not found', HttpStatus.NOT_FOUND);
    }

    task.status = TaskStatus.CANCELLED;
    task.cancelReason = body.reason;
    task.cancelBy = user.id;
    task.last_issues_data = JSON.stringify(task.issues);
    const result = await this.taskRepository.save(task);
    

    for (let issue of task.issues) {
      issue.task = null;
      await this.issueRepository.save(issue);
    }

    return result
  }
}
