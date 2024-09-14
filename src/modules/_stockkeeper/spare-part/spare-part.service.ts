import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/base/service.base';
import { SparePartEntity } from 'src/entities/spare-part.entity';
import { TaskEntity, TaskStatus } from 'src/entities/task.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SparePartService extends BaseService<SparePartEntity> {
  constructor(
    @InjectRepository(SparePartEntity)
    private readonly sparePartRepository: Repository<SparePartEntity>,
    @InjectRepository(TaskEntity)
    private readonly taskRepository: Repository<TaskEntity>,
  ) {
    super(sparePartRepository);
  }

  async customGetAllSparePart(
    page: number,
    limit: number,
  ): Promise<[SparePartEntity[], number]> {
    return this.sparePartRepository.findAndCount({
      where: {
        deletedAt: null,
      },
      order: { createdAt: 'DESC' },
      relations: ['machineModel'],
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  async getAllSparePartNeedAddMore() {
    // get all tasks with status = awaiting_spare_part
    const tasks = await this.taskRepository.find({
      where: {
        status: TaskStatus.AWAITING_SPARE_SPART,
      },
      relations: ['issues', 'issues.issueSpareParts', 'issues.issueSpareParts.sparePart'],
    });

    const tasksNeedMoreSpareParts = [];

    // check which spare part needs to add more
    for (const task of tasks) {
      for (const issue of task.issues) {
        for (const issueSparePart of issue.issueSpareParts) {
          const sparePart = issueSparePart.sparePart;
          if (sparePart.quantity < issueSparePart.quantity) {
            tasksNeedMoreSpareParts.push({
              task,
              issue,
              sparePart,
              quantityNeedToAdd: issueSparePart.quantity - sparePart.quantity,
            });
          }
        }
      }
    }

    // return all spare part need to add more
    return tasksNeedMoreSpareParts;
  }

  async customUpdate(id: string, data: Partial<SparePartEntity>) {
    // find the spare part by id
    const sparePart = await this.sparePartRepository.findOne({ where: { id } });
    if (!sparePart) {
      throw new Error('Spare part not found');
    }
    if (data?.quantity && data.quantity > sparePart.quantity) {
      const tasks = await this.taskRepository.find({
        where: {
          status: TaskStatus.AWAITING_SPARE_SPART,
        },
        relations: ['issues', 'issues.spareParts', 'issues.spareParts.sparePart'],
      });
      // sort tasks by field priority = true and then sort by createdAt follow by DESC
      tasks.sort((a, b) => {
        if (a.priority && !b.priority) {
          return -1;
        }
        if (!a.priority && b.priority) {
          return 1;
        }
        return b.createdAt.getTime() - a.createdAt.getTime();
      });
      let result = await super.update(id, data);

      // kiếm các task đầu cần thêm spare part cho cái spare part đang được cập nhật nếu số lượng cập nhật thêm số lượng cần cho task đó thì tìm thêm task tiếp theo cho đến khi nào không đủ, 

      // sau đó check lại task đó các spare bên trong đã ở trạng thái đủ hết chưa nếu rồi thì cập nhật trạng thái task 
      // nếu 


      return result;
    }
    return super.update(id, data);
  }

  async updateTaskStausToAwaitingFixer(taskId: string) {
    // check task status is awaiting spare part and spare part quantity is enough
    const task = await this.taskRepository.findOne({
      where: { id: taskId },
      relations: ['issues', 'issues.issueSpareParts', "issues.issueSpareParts.sparePart"],
    });
    let issues = task.issues;
    // check issueSpareParts of each issues is enought 
    for (let issue of issues) {
      for (let issueSparePart of issue.issueSpareParts) {
        const sparePart = await this.sparePartRepository.findOne({
          where: { id: issueSparePart.sparePart.id },
        });
        if (sparePart.quantity < issueSparePart.quantity) {
          throw new Error('Not enough spare part');
        }
      }
    }
    // decrease spare part quantity
    for (let issue of issues) {
      for (let issueSparePart of issue.issueSpareParts) {
        const sparePart = await this.sparePartRepository.findOne({
          where: { id: issueSparePart.sparePart.id },
        });
        sparePart.quantity -= issueSparePart.quantity;
        await this.sparePartRepository.save(sparePart);
      }
    }
    task.status = TaskStatus.AWAITING_FIXER;
    return await this.taskRepository.save(task);
  }

}
