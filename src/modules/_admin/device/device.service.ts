import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/base/service.base';
import { DeviceEntity } from 'src/entities/device.entity';
import { RequestStatus } from 'src/entities/request.entity';
import { TaskStatus } from 'src/entities/task.entity';
import { Repository } from 'typeorm';
import { DeviceRequestDto } from './dto/request.dto';

@Injectable()
export class DeviceService extends BaseService<DeviceEntity> {
  constructor(
    @InjectRepository(DeviceEntity)
    private readonly deviceRepository: Repository<DeviceEntity>,
  ) {
    super(deviceRepository);
  }

  // get all with relations
  async getAllWithRelations(): Promise<DeviceEntity[]> {
    return this.deviceRepository.find({
      relations: ['area', 'machineModel'],
    });
  }

  // get one with relations
  async getOneWithRelations(id: string): Promise<DeviceEntity> {
    return this.deviceRepository.findOne({
      where: { id },
      relations: ['area', 'machineModel'],
    });
  }

  async getAllInfoDeviceByAreaId(areaId: string, time: number = 1) {
    return Promise.all([
      this.deviceRepository.find({
        where: {
          area: {
            id: areaId,
          },
        },
        relations: ['requests', 'requests.tasks'],
      }),
    ]).then(([devices]) => {
      let total_requests = 0;
      let total_tasks = 0;
      let total_devices = devices.length;

      // status of requests
      let pending_requests = 0;
      let checked_requests = 0;
      let approved_requests = 0;
      let in_progress_requests = 0;
      let closed_requests = 0;
      let head_confirm_requests = 0;
      let rejected_requests = 0;
      let head_cancel_requests = 0;

      // status of tasks
      let awaiting_spare_spart = 0;
      let awaiting_fixer = 0;
      let assigned = 0;
      let in_progress = 0;
      let completed = 0;
      let head_staff_confirm = 0;
      let cancelled = 0;
      let staff_request_cancelled = 0;
      let head_staff_confirm_staff_request_cancelled = 0;
      let close_task_request_cancelled = 0;

      // filter requests by time (1: this week, 2: last month, 3: this year)
      devices = devices.map((device) => {
        device.requests = device.requests.filter((request) => {
          // const endDate = new Date('2024-09-07T02:24:40.298Z');
          // const startDate = new Date();
          // startDate.setDate(startDate.getDate() + 1);
          // return new Date(request.createdAt) >= endDate && new Date(request.createdAt) <= startDate;
          const requestTime = new Date(request.createdAt).getTime();
            const currentTime = new Date().getTime();
            switch (time) {
              case 1:
                return requestTime >= currentTime - 7 * 24 * 60 * 60 * 1000;
              case 2:
                return requestTime >= currentTime - 30 * 24 * 60 * 60 * 1000;
              case 3:
                return requestTime >= currentTime - 365 * 24 * 60 * 60 * 1000;
              default:
                return true;
            }
        });
        return device;
      });

      devices.forEach((device) => {
        device.requests.forEach((request) => {
          total_requests++;
          switch (request.status) {
            case RequestStatus.PENDING:
              pending_requests++;
              break;
            case RequestStatus.APPROVED:
              approved_requests++;
              break;
            case RequestStatus.IN_PROGRESS:
              in_progress_requests++;
              break;
            case RequestStatus.CLOSED:
              closed_requests++;
              break;
            case RequestStatus.HEAD_CONFIRM:
              head_confirm_requests++;
              break;
            case RequestStatus.HEAD_CANCEL:
              head_cancel_requests++;
              break;
            case RequestStatus.REJECTED:
              rejected_requests++;
              break;
          }
          request.tasks.forEach((task) => {
            total_tasks++;
            switch (task.status) {
              case TaskStatus.AWAITING_SPARE_SPART:
                awaiting_spare_spart++;
                break;
              case TaskStatus.AWAITING_FIXER:
                awaiting_fixer++;
                break;
              case TaskStatus.ASSIGNED:
                assigned++;
                break;
              case TaskStatus.IN_PROGRESS:
                in_progress++;
                break;
              case TaskStatus.COMPLETED:
                completed++;
                break;
              case TaskStatus.HEAD_STAFF_CONFIRM:
                head_staff_confirm++;
                break;
              case TaskStatus.CANCELLED:
                cancelled++;
                break;
            }
          });
        });
      });
      return {
        total_requests,
        total_tasks,
        total_devices,
        request: {
          pending_requests,
          checked_requests,
          approved_requests,
          in_progress_requests,
          closed_requests,
          head_confirm_requests,
          head_cancel_requests,
          rejected_requests,
        },
        task: {
          awaiting_spare_spart,
          awaiting_fixer,
          assigned,
          in_progress,
          completed,
          head_staff_confirm,
          cancelled,
          staff_request_cancelled,
          head_staff_confirm_staff_request_cancelled,
          close_task_request_cancelled,
        },
      };
    });
  }

  async getAllFilteredAndSorted(
    page: number,
    limit: number,
    filter: DeviceRequestDto.DeviceFilterDto,
    order: DeviceRequestDto.DeviceOrderDto,
  ) {
    const query = this.deviceRepository
      .createQueryBuilder('device')
      .leftJoinAndSelect('device.machineModel', 'machineModel')
      .leftJoinAndSelect('device.area', 'area');

    if (filter.id) {
      query.andWhere('device.id = :id', {
        id: filter.id,
      });
    }

    if (filter.areaId) {
      query.andWhere('device.area = :areaId', {
        areaId: filter.areaId,
      });
    }

    if (filter.machineModelId) {
      query.andWhere('device.machineModel = :machineModelId', {
        machineModelId: filter.machineModelId,
      });
    }

    if (filter.positionX && (filter.positionX as any) !== 'NaN') {
      query.andWhere('device.positionX = :positionX', {
        positionX: filter.positionX,
      });
    }

    if (filter.positionY && (filter.positionY as any) !== 'NaN') {
      query.andWhere('device.positionY = :positionY', {
        positionY: filter.positionY,
      });
    }

    if (order.order && order.orderBy) {
      if (order.orderBy === 'position') {
        query.orderBy(`device.positionX`, order.order);
        query.addOrderBy(`device.positionY`, order.order);
      } else {
        query.orderBy(`device.${order.orderBy}`, order.order);
      }
    }

    return await query
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();
  }
}
