import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/base/service.base';
import { FixItemType, IssueEntity } from 'src/entities/issue.entity';
import { SparePartEntity } from 'src/entities/spare-part.entity';
import { TaskEntity, TaskStatus } from 'src/entities/task.entity';
import { Repository } from 'typeorm';
import { SparePartRequestDto } from './dto/request.dto';
import { IssueSparePartEntity } from 'src/entities/issue-spare-part.entity';
import { QueryRunner } from 'typeorm';
import { isUUID } from 'class-validator';
import { NotificationEntity, NotificationType } from 'src/entities/notification.entity';


@Injectable()
export class SparePartService extends BaseService<SparePartEntity> {
  constructor(
    @InjectRepository(SparePartEntity)
    private readonly sparePartRepository: Repository<SparePartEntity>,
    @InjectRepository(IssueEntity)
    private readonly issueEntityRepository: Repository<IssueEntity>,
    @InjectRepository(TaskEntity)
    private readonly taskRepository: Repository<TaskEntity>,
    @InjectRepository(NotificationEntity)
    private readonly notificationEntityRepository: Repository<NotificationEntity>,
  ) {
    super(sparePartRepository);
  }

  async addSparepartWarranty(spare_part_id: string, issue_id: string, entity: SparePartRequestDto.SparePartUpdateDto) {
    if (!isUUID(spare_part_id)) throw new HttpException('Id is incorrect', 400);
    // find and update
    let found = await this.getOne(spare_part_id) as any;
    if (!found) throw new HttpException('Spare part not found', 404);
    entity.quantity = found.quantity + entity.quantity;
    // get issue and issueSparePart and iusse.task
    let issue = await this.issueEntityRepository.findOne({
      where: {
        id: issue_id,
      },
      relations: ['issueSpareParts', 'task', 'issueSpareParts.sparePart'],
    });
    if (!issue) throw new HttpException('Issue not found', 404);
    // find task and update spare return_spare_part_data add field returned = true and return_date = new Date() into issueSparePart
    let task = issue.task;
    // find issueSparePart in task.return_spare_part_data store [ issue1.issueSparePart[], issue2.issueSparePart[], ...] type json
    let return_spare_part_data = task.return_spare_part_data;
    if (!return_spare_part_data || return_spare_part_data.length == 0) {
      throw new HttpException('Return spare part data not found', 404);
    }
    // find and update field return_spare_part_data item with add returned and return_date for task
    let foundIssueSparePart = return_spare_part_data.find((item: any) => item.sparePart.id == spare_part_id);
    if (!foundIssueSparePart) throw new HttpException('Issue spare part not found', 404);
    // update return_spare_part_data
    foundIssueSparePart.returned = true;
    foundIssueSparePart.return_date = new Date();
    // update task.return_spare_part_data
    task.return_spare_part_data = return_spare_part_data;
    // save task
    await this.taskRepository.save(task);
    // update spare part
    return this.sparePartRepository.update(spare_part_id, entity as any).then(() => this.getOne(spare_part_id));
  }

  async incrementQuantitySpareParts(
    dto: SparePartRequestDto.ImportSparePartDto,
  ) {
    const spareParts = dto.spareParts;

    const updatedSpareParts = await Promise.allSettled(
      spareParts.map(async (part) => {
        const current = await this.sparePartRepository.findOne({
          where: {
            name: part.sparePartName,
            machineModel: {
              name: part.machineModelName,
            },
          },
          relations: ['machineModel'],
        });

        if (!current) {
          return Promise.reject({
            sparePart: part,
            message: 'Spare part not found',
          });
        }

        try {
          const updated = await this.customUpdate(current.id, {
            quantity: part.quantity + current.quantity,
          });

          return Promise.resolve(updated);
        } catch (error) {
          return Promise.reject({
            sparePart: part,
            message: error.message,
          });
        }
      }),
    );

    const returnValue: {
      success: SparePartEntity[];
      failed: any[];
    } = {
      success: [],
      failed: [],
    };

    for (const part of updatedSpareParts) {
      if (part.status === 'fulfilled') {
        returnValue.success.push(part.value);
      } else {
        returnValue.failed.push(part.reason);
      }
    }

    return returnValue;
  }

  async customGetAllSparePart(
    page: number,
    limit: number,
    filterDto?: SparePartRequestDto.AllSparePartsFilterDto,
    orderDto?: SparePartRequestDto.AllSparePartsOrderDto,
  ): Promise<[SparePartEntity[], number]> {
    console.log(filterDto.name);
    const query = this.sparePartRepository
      .createQueryBuilder('sparePart')
      .leftJoinAndSelect('sparePart.machineModel', 'machineModel')
      .where('sparePart.deletedAt IS NULL');

    if (filterDto?.id) {
      query.andWhere('sparePart.id = :id', {
        id: filterDto.id,
      });
    }

    if (filterDto?.minQuantity) {
      query.andWhere('sparePart.quantity >= :minQuantity', {
        minQuantity: filterDto.minQuantity,
      });
    }

    if (filterDto?.maxQuantity) {
      query.andWhere('sparePart.quantity <= :maxQuantity', {
        maxQuantity: filterDto.maxQuantity,
      });
    }

    if (filterDto?.machineModelId) {
      query.andWhere('machineModel.id = :machineModelId', {
        machineModelId: filterDto.machineModelId,
      });
    }

    if (filterDto?.name) {
      query.andWhere('sparePart.name LIKE :name', {
        name: `%${filterDto.name}%`,
      });
    }

    if (orderDto?.orderBy && orderDto?.order) {
      if (orderDto.orderBy === 'name') {
        query.orderBy(`sparePart.name`, orderDto.order);
      } else if (orderDto.orderBy === 'quantity') {
        query.orderBy(`sparePart.quantity`, orderDto.order);
      } else if (orderDto.orderBy === 'createdAt') {
        query.orderBy(`sparePart.createdAt`, orderDto.order);
      } else if (orderDto.orderBy === 'updatedAt') {
        query.orderBy(`sparePart.updatedAt`, orderDto.order);
      } else {
        query.orderBy(`sparePart.updatedAt`, 'DESC');
      }
    } else {
      query.orderBy(`sparePart.updatedAt`, 'DESC');
    }

    query.skip((page - 1) * limit).take(limit);

    const [data, total] = await query.getManyAndCount();

    return [data, total];
    // return this.sparePartRepository.findAndCount({
    //   where: {
    //     deletedAt: null,
    //   },
    //   order: { createdAt: 'DESC' },
    //   relations: ['machineModel'],
    //   skip: (page - 1) * limit,
    //   take: limit,
    // });
  }

  async getAllSparePartNeedAddMore() {
    const noties = await this.notificationEntityRepository.find({
      where: {
        title: 'Nhập mới linh kiện',
        seenDate: null
      }
    });
    for (const noti of noties) {
      noti.seenDate = new Date();
      await this.notificationEntityRepository.save(noti);
    }

    // get all tasks with status = awaiting_spare_part
    const tasks = await this.taskRepository.find({
      where: {
        // status: TaskStatus.AWAITING_SPARE_SPART,
      },
      relations: [
        'issues',
        'issues.issueSpareParts',
        'issues.issueSpareParts.sparePart',
        'issues.issueSpareParts.sparePart.machineModel',
      ],
    });

    console.log('tasks', tasks);


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

    console.log(map);


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
        if (
          !currentSparePart ||
          currentSparePart.quantity < issueSparePart.quantity
        ) {
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


  async customUpdateTransaction(id: string, data: Partial<SparePartEntity>) {
    // Khởi tạo query runner để bắt đầu transaction
    const queryRunner = this.sparePartRepository.manager.connection.createQueryRunner();

    // Bắt đầu transaction
    await queryRunner.startTransaction('SERIALIZABLE');

    try {
      // Tìm spare part theo id
      const sparePart = await queryRunner.manager.findOne(SparePartEntity, { where: { id } });
      if (!sparePart) {
        throw new Error('Spare part not found');
      }

      // Cập nhật số lượng mới của spare part
      const updatedSparePart = await super.update(id, data);

      // Chỉ xử lý nếu số lượng mới lớn hơn hoặc bằng số lượng hiện tại
      if (data?.quantity && data.quantity >= sparePart.quantity) {
        const tasks = await queryRunner.manager.find(TaskEntity, {
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
          await this.updateTaskToAwaitingFixerTransaction(task, queryRunner);
        }
      }

      // Commit transaction khi mọi thứ đều thành công
      await queryRunner.commitTransaction();

      return updatedSparePart;
    } catch (error) {
      // Nếu có lỗi, rollback lại toàn bộ transaction
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      // Kết thúc query runner
      await queryRunner.release();
    }
  }

  async updateTaskToAwaitingFixerTransaction(task: TaskEntity, queryRunner: QueryRunner) {
    // Duyệt qua các issue có fixType là REPLACE
    const issuesReady = task.issues.filter(
      (issue) => issue.fixType === FixItemType.REPLACE,
    );

    for (const issue of issuesReady) {
      for (const issueSparePart of issue.issueSpareParts) {
        const sparePart = issueSparePart.sparePart;

        // Lấy số lượng phụ tùng hiện tại trong kho bằng queryRunner
        const currentSparePart = await queryRunner.manager.findOne(SparePartEntity, {
          where: { id: sparePart.id },
        });

        if (!currentSparePart || currentSparePart.quantity < issueSparePart.quantity) {
          return false;
        }
      }
    }

    // Tiến hành trừ số lượng phụ tùng trong kho
    for (const issue of issuesReady) {
      for (const issueSparePart of issue.issueSpareParts) {
        const sparePart = issueSparePart.sparePart;

        const currentSparePart = await queryRunner.manager.findOne(SparePartEntity, {
          where: { id: sparePart.id },
        });

        if (currentSparePart) {
          currentSparePart.quantity -= issueSparePart.quantity;
          await queryRunner.manager.save(SparePartEntity, currentSparePart);
        }
      }
    }

    // Cập nhật trạng thái của task
    task.status = TaskStatus.AWAITING_FIXER;
    await queryRunner.manager.save(TaskEntity, task);

    return true;
  }


  async getToday() {
    const query = this.taskRepository
      .createQueryBuilder('task')
      .where(
        "task.fixerDate BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '1 day' - INTERVAL '1 second'",
      )
      .leftJoinAndSelect('task.fixer', 'fixer')
      .leftJoinAndSelect('task.issues', 'issues')
      .leftJoinAndSelect('issues.issueSpareParts', 'issueSpareParts')
      .leftJoinAndSelect('issueSpareParts.sparePart', 'sparePart');

    const data = await query.getMany();

    const map: Record<
      string,
      {
        sparePart: SparePartEntity;
        quantity: number;
        task: TaskEntity[];
      }
    > = {};

    for (const task of data) {
      const { issues, ...rawTask } = task;
      for (const issue of task.issues) {
        for (const issueSparePart of issue.issueSpareParts) {
          if (!map[issueSparePart.sparePart.id]) {
            map[issueSparePart.sparePart.id] = {
              sparePart: issueSparePart.sparePart,
              quantity: issueSparePart.quantity,
              task: [rawTask as any],
            };
          } else {
            map[issueSparePart.sparePart.id].quantity +=
              issueSparePart.quantity;
            map[issueSparePart.sparePart.id].task.push(rawTask as any);
          }
        }
      }
    }

    return Object.values(map);
  }
}
