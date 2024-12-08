import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/base/service.base';
import { TaskEntity, TaskStatus } from 'src/entities/task.entity';
import { Between, Repository } from 'typeorm';
import { NotificationRequestDto } from './dto/request.dto';
import { SparePartEntity } from 'src/entities/spare-part.entity';
import { IssueEntity, IssueStatus } from 'src/entities/issue.entity';
import {
  exportStatus,
  exportType,
  ExportWareHouse,
} from 'src/entities/export-warehouse.entity';
import { NotificationEntity } from 'src/entities/notification.entity';
import { NotificationResponseDto } from './dto/response.dto';
import { AccountEntity, Role } from 'src/entities/account.entity';
import { RequestEntity, RequestStatus } from 'src/entities/request.entity';

@Injectable()
export class NotificationService extends BaseService<TaskEntity> {
  constructor(
    @InjectRepository(TaskEntity)
    private readonly taskRepository: Repository<TaskEntity>,
    @InjectRepository(IssueEntity)
    private readonly issueRepository: Repository<IssueEntity>,
    @InjectRepository(SparePartEntity)
    private readonly SparePartEntityRepository: Repository<SparePartEntity>,
    @InjectRepository(ExportWareHouse)
    private readonly ExportWareHouseRepository: Repository<ExportWareHouse>,
    @InjectRepository(NotificationEntity)
    private readonly NotificationEntityRepository: Repository<NotificationEntity>,
    @InjectRepository(AccountEntity)
    private readonly AccountEntityRepository: Repository<AccountEntity>,
    @InjectRepository(RequestEntity)
    private readonly RequestEntityRepository: Repository<RequestEntity>,
    
  ) {
    super(taskRepository);
  }

  
  async getDashboard(
    from: Date, to: Date
  ): Promise<NotificationResponseDto.StockkeeperDashboard> {
    const result = new NotificationResponseDto.StockkeeperDashboard();
    const sparePartNeeded = await this.getAllSparePartNeedAddMore();
    result.sparepartNeedAdded =  Object.keys(sparePartNeeded).length;


    const taskDeviceInPeriod = await this.ExportWareHouseRepository.find({
      where:{
        createdAt: Between(from, to),
        export_type : exportType.DEVICE
      }
      ,relations: ['task']
    });

    const taskDeviceNotYet = taskDeviceInPeriod
    .filter(task => task.task.confirmReceiptStockkeeperSignature === 'false' 
      && task.task.confirmReceiptStaffSignature === 'false' 
    ).length;
    result.taskDeviceNotYet = taskDeviceNotYet;

    const taskDeviceDone = taskDeviceInPeriod
    .filter(task => task.task.confirmReceiptStockkeeperSignature != 'false' 
      && task.task.confirmReceiptStaffSignature != 'false' 
    ).length;
    result.taskDeviceDone = taskDeviceDone;

    const taskSPInPeriod = await this.ExportWareHouseRepository.find({
      where:{
        createdAt: Between(from, to),
        export_type : exportType.SPARE_PART
      }
      ,relations: ['task']
    });

    const taskSPNotYet = taskSPInPeriod
    .filter(task => task.task.confirmReceiptStockkeeperSignature === 'false' 
      && task.task.confirmReceiptStaffSignature === 'false' 
    ).length;
    result.taskSparePartNotYet = taskSPNotYet;

    const taskSPeDone = taskSPInPeriod
    .filter(task => task.task.confirmReceiptStockkeeperSignature != 'false' 
      && task.task.confirmReceiptStaffSignature != 'false' 
    ).length;
    result.taskSparePartDone = taskSPeDone;

    const hotFixDevice = (await this.RequestEntityRepository.find({
      where:{
        status: RequestStatus.IN_PROGRESS || RequestStatus.APPROVED|| RequestStatus.PENDING,
        device:{
          status : false
        }
      }
      ,relations: ['device']
    })).length;
    result.hotFixDevice = hotFixDevice;

    return result;
  }

  async getOneNotification(id: string) : Promise<NotificationResponseDto.NotificationGetOne> {
    const notification = await this.NotificationEntityRepository.findOne({
      where: { id }
    });

    notification.seenDate = new Date();
    const taskid = notification.data as string;
    
    const task = await this.taskRepository.findOne({
      where: { id : taskid},
      relations: [
        'export_warehouse_ticket',
        'fixer',
        'issues',
        'issues.issueSpareParts',
        'issues.issueSpareParts.sparePart',
        'device_renew',
      ],
    });

    const result = new NotificationResponseDto.NotificationGetOne();
    result.task = task;
    result.notification = notification;
    
    const lacked = this.getAllSparePartNeedAddMore();
    
    if (notification.title.includes("vui lòng kiểm tra")) {
      result.sparePartLacked = Object.keys(lacked).length;
    }    

    return result;
  }

  async getAllSparePartNeedAddMore() {
    const tasks = await this.taskRepository.find({
      where: {
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

    const values = Object.values(map);
    for (const value of values) {
      value.quantityNeedToAdd = value.totalNeed - value.sparePart.quantity;
    }
    return map;
  }

  async stockeeperGetAllNoti(
    page: number,
    limit: number,
  ): Promise<[NotificationEntity[], number]> {
    const notifications = await this.NotificationEntityRepository.find({
      where: {
        receiver: {
          id: 'eb488f7f-4c1b-4032-b5c0-8f543968bbf8',
        },
        deletedAt: null,
      },
      order: { createdAt: 'DESC' },
      relations: ['receiver'],
      skip: (page - 1) * limit,
      take: limit,
    });
  
    const count = notifications.filter(notification => notification.seenDate === null).length;

  
    // Trả về mảng thay vì object
    return [notifications, count];
  }
  

  async getNotiNumber(
  ): Promise< number> {
    const data = await this.NotificationEntityRepository.findAndCount({
      where: {
        receiver: {
          id: 'eb488f7f-4c1b-4032-b5c0-8f543968bbf8'
        }, 
        deletedAt: null,
        seenDate : null
      }
    });
    return data.length;
  }
}
