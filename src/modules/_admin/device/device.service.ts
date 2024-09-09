import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/base/service.base';
import { DeviceEntity } from 'src/entities/device.entity';
import { RequestStatus } from 'src/entities/request.entity';
import { TaskStatus } from 'src/entities/task.entity';
import { Repository } from 'typeorm';

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

  async getAllInfoDeviceByAreaId(areaId: string) {
    return Promise.all([
      this.deviceRepository.find({
        where: {
          area: {
            id: areaId,
          },
        },
        relations: [
          'requests',
          'requests.tasks',
        ],
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

      devices.forEach(device => {
        device.requests.forEach(request => {
          total_requests++;
          switch (request.status) {
            case RequestStatus.PENDING:
              pending_requests++;
              break;
            case RequestStatus.CHECKED:
              checked_requests++;
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
            case RequestStatus.REJECTED:
              rejected_requests++;
              break;
          }
          request.tasks.forEach(task => {
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
              case TaskStatus.STAFF_REQUEST_CANCELLED:
                staff_request_cancelled++;
                break;
              case TaskStatus.HEAD_STAFF_CONFIRM_STAFF_REQUEST_CANCELLED:
                head_staff_confirm_staff_request_cancelled++;
                break;
              case TaskStatus.CONFRIM_RECEIPT_RETURN_SPARE_PART:
                close_task_request_cancelled++;
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
        }
      };
    });
  }
}
