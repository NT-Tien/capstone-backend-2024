import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/base/service.base';
import { FixItemType, IssueStatus } from 'src/entities/issue.entity';
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
      relations: [
        'issues',
        'issues.issueSpareParts',
        'issues.issueSpareParts.sparePart',
        'issues.issueSpareParts.sparePart.machineModel',
      ],
    });

    const map: {
      [key: string]: {
        sparePart: SparePartEntity;
        quantityNeedToAdd: number;
        totalNeed: number;
        tasks: TaskEntity[];
      };
    } = {};

    for (const task of tasks) {
      for (const issue of task.issues) {
        for (const issueSparePart of issue.issueSpareParts) {
          const sparePart = issueSparePart.sparePart;
          if (sparePart.quantity < issueSparePart.quantity) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { issues, ...bareTask } = task;

            if (!map[sparePart.id]) {
              map[sparePart.id] = {
                sparePart,
                totalNeed: issueSparePart.quantity,
                quantityNeedToAdd: 0,
                tasks: [bareTask as any],
              };
            } else {
              map[sparePart.id].totalNeed += issueSparePart.quantity;
              map[sparePart.id].tasks.push(bareTask as any);
            }
          }
        }
      }
    }

    const values = Object.values(map);
    for (const value of values) {
      value.quantityNeedToAdd = value.totalNeed - value.sparePart.quantity;
    }

    // const tasksNeedMoreSpareParts = [];

    // check which spare part needs to add more
    // for (const task of tasks) {
    //   for (const issue of task.issues) {
    //     for (const issueSparePart of issue.issueSpareParts) {
    //       const sparePart = issueSparePart.sparePart;
    //       if (sparePart.quantity < issueSparePart.quantity) {
    //         tasksNeedMoreSpareParts.push({
    //           task,
    //           issue,
    //           sparePart,
    //           quantityNeedToAdd: issueSparePart.quantity - sparePart.quantity,
    //         });
    //       }
    //     }
    //   }
    // }

    // return all spare part need to add more
    return map;
  }

  async customUpdate(id: string, data: Partial<SparePartEntity>) {
    // Tìm spare part theo id
    const sparePart = await this.sparePartRepository.findOne({ where: { id } });
    if (!sparePart) {
      throw new Error('Spare part not found');
    }

    // Cập nhật số lượng mới của spare part
    const updatedSparePart = await super.update(id, data);

    // Chỉ xử lý nếu số lượng mới lớn hơn hoặc bằng số lượng hiện tại
    if (data?.quantity && data.quantity >= sparePart.quantity) {
      const tasks = await this.taskRepository.find({
        where: { status: TaskStatus.AWAITING_SPARE_SPART },
        relations: [
          'issues',
          'issues.issueSpareParts',
          'issues.issueSpareParts.sparePart',
        ],
      });

      // Sắp xếp task theo priority và createdAt
      tasks.sort((a, b) => {
        if (a.priority !== b.priority) {
          return a.priority ? -1 : 1;
        }
        return b.createdAt.getTime() - a.createdAt.getTime();
      });

      // Duyệt qua từng task để kiểm tra và cập nhật trạng thái
      for (const task of tasks) {
        // Sử dụng hàm updateTaskToAwaitingFixer để kiểm tra và trừ số lượng phụ tùng nếu task sẵn sàng
        await this.updateTaskToAwaitingFixer(task);
      }
    }

    return updatedSparePart;
  }



  async updateTaskToAwaitingFixer(task: TaskEntity) {
    // Duyệt qua các issue có fixType là REPLACE
    const issuesReady = task.issues.filter(
      (issue) => issue.fixType === FixItemType.REPLACE, // Chỉ lọc các issue loại REPLACE
    );
    
    // Kiểm tra từng issue có loại REPLACE
    for (const issue of issuesReady) {
      // Nếu issue có trạng thái là PENDING thì không thể tiếp tục
      // if (issue.status === IssueStatus.PENDING) {
      //   return false;
      // }

      // Kiểm tra từng spare part của issue
      for (const issueSparePart of issue.issueSpareParts) {
        const sparePart = issueSparePart.sparePart;

        // Lấy số lượng phụ tùng hiện tại trong kho
        const currentSparePart = await this.sparePartRepository.findOne({
          where: { id: sparePart.id },
        });

        // Nếu không tìm thấy phụ tùng hoặc số lượng trong kho không đủ
        if (!currentSparePart || currentSparePart.quantity < issueSparePart.quantity) {
          return false; // Không đủ phụ tùng cho task
        }
      }
    }

    // Nếu tất cả các kiểm tra đều hợp lệ, tiến hành trừ số lượng phụ tùng trong kho
    for (const issue of issuesReady) {
      for (const issueSparePart of issue.issueSpareParts) {
        const sparePart = issueSparePart.sparePart;

        // Lấy số lượng phụ tùng hiện tại trong kho
        const currentSparePart = await this.sparePartRepository.findOne({
          where: { id: sparePart.id },
        });

        if (currentSparePart) {
          // Trừ số lượng phụ tùng theo yêu cầu của issue
          currentSparePart.quantity -= issueSparePart.quantity;
          // Cập nhật lại số lượng phụ tùng sau khi trừ
          await this.sparePartRepository.save(currentSparePart);
        }
      }
    }

    // Tất cả các phụ tùng đã đủ, cập nhật trạng thái của task thành AWAITING_FIXER
    task.status = TaskStatus.AWAITING_FIXER;
    console.log('Task', task, 'is ready for fixer');
    
    await this.taskRepository.save(task);

    return true; // Task đã sẵn sàng
  }




}
