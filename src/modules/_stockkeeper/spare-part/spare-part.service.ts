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
    // Tìm spare part theo id
    const sparePart = await this.sparePartRepository.findOne({ where: { id } });
    if (!sparePart) {
      throw new Error('Spare part not found');
    }
  
    // Cập nhật số lượng mới của spare part
    let result = await super.update(id, data);
  
    // Chỉ xử lý nếu số lượng mới lớn hơn số lượng hiện tại
    if (data?.quantity && data.quantity > sparePart.quantity) {
      const tasks = await this.taskRepository.find({
        where: { status: TaskStatus.AWAITING_SPARE_SPART },
        relations: ['issues', 'issues.spareParts', 'issues.spareParts.sparePart'],
      });
  
      // Sắp xếp task theo priority và createdAt
      tasks.sort((a, b) => {
        if (a.priority !== b.priority) {
          return a.priority ? -1 : 1;
        }
        return b.createdAt.getTime() - a.createdAt.getTime();
      });
  
      // Số lượng phụ tùng sau khi cập nhật
      let updatedQuantity = sparePart.quantity;
  
      // Duyệt qua từng task đã sắp xếp
      for (const task of tasks) {
        let isTaskUpdated = false;
  
        // Duyệt qua từng issue trong task
        for (const issue of task.issues) {
          // Duyệt qua từng spare part trong issue
          for (const issueSparePart of issue.issueSpareParts) {
            if (issueSparePart.sparePart.id === sparePart.id) {
              // Tính toán số lượng phụ tùng cần thêm cho nhiệm vụ
              const quantityNeedToAdd = issueSparePart.quantity - issueSparePart.sparePart.quantity;
  
              if (quantityNeedToAdd > 0 && updatedQuantity < data.quantity) {
                const quantityToAdd = Math.min(quantityNeedToAdd, data.quantity - updatedQuantity);
                issueSparePart.sparePart.quantity += quantityToAdd;
                updatedQuantity += quantityToAdd;
                await this.sparePartRepository.save(issueSparePart.sparePart);
                isTaskUpdated = true;
              }
            }
          }
        }
  
        // Nếu task đã được cập nhật phụ tùng
        if (isTaskUpdated) {
          // Kiểm tra nếu tất cả phụ tùng trong task đã đủ số lượng
          const allSparePartsReady = task.issues.every(issue =>
            issue.issueSpareParts.every(
              issueSparePart => issueSparePart.sparePart.quantity >= issueSparePart.quantity
            )
          );
  
          // Nếu tất cả phụ tùng đủ, cập nhật trạng thái task
          if (allSparePartsReady) {
            task.status = TaskStatus.AWAITING_FIXER;
            await this.taskRepository.save(task);
  
            // Trừ số lượng phụ tùng đã dùng trong kho
            for (const issue of task.issues) {
              for (const issueSparePart of issue.issueSpareParts) {
                issueSparePart.sparePart.quantity -= issueSparePart.quantity;
                await this.sparePartRepository.save(issueSparePart.sparePart);
              }
            }
          }
        }
  
        // Nếu số lượng phụ tùng đã cập nhật hết thì dừng lại
        if (updatedQuantity >= data.quantity) break;
      }
  
      // Cập nhật lại số lượng phụ tùng cuối cùng sau khi xử lý
      sparePart.quantity = updatedQuantity;
      await this.sparePartRepository.save(sparePart);
    }
  
    return result;
  }
  
}
