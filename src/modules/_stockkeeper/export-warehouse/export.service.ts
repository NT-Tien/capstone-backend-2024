import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, ILike, Repository } from 'typeorm';
import {
  exportStatus,
  exportType,
  ExportWareHouse,
} from 'src/entities/export-warehouse.entity';
import { BaseService } from 'src/common/base/service.base';
import { SparePartEntity } from 'src/entities/spare-part.entity';
import { Not, In } from 'typeorm';
import { UUID } from 'crypto';
import { DeviceEntity } from 'src/entities/device.entity';
import { MachineModelEntity } from 'src/entities/machine-model.entity';
import { TaskEntity } from 'src/entities/task.entity';
import { HeadStaffNotificationGateway } from 'src/modules/notifications/gateways/head-staff.gateway';
import { NotificationType } from 'src/entities/notification.entity';
import { Accounts } from 'src/common/constants';

@Injectable()
export class ExportWareHouseService extends BaseService<ExportWareHouse> {
  constructor(
    @InjectRepository(ExportWareHouse)
    private readonly exportWarehouseRepository: Repository<ExportWareHouse>,
    @InjectRepository(SparePartEntity)
    private readonly sparePartRepository: Repository<SparePartEntity>,
    @InjectRepository(DeviceEntity)
    private readonly deviceRepository: Repository<DeviceEntity>,
    @InjectRepository(MachineModelEntity)
    private readonly machineModelRepository: Repository<MachineModelEntity>,
    @InjectRepository(TaskEntity)
    private readonly taskRepository: Repository<TaskEntity>,

    private readonly headStaffGateway: HeadStaffNotificationGateway,
  ) {
    super(exportWarehouseRepository);
  }

  async getAll(): Promise<ExportWareHouse[]> {
    return this.exportWarehouseRepository.find({
      where: {
        status: Not(
          In([exportStatus.WAITING_ADMIN, exportStatus.ADMIN_REJECT]),
        ),
      },
      relations: [
        'task',
        'task.fixer',
        'task.issues',
        'task.issues.issueSpareParts',
        'task.issues.issueSpareParts.sparePart',
      ],
    });
  }

  async filterByStaffNameAndCreatedDate(
    staff_name: string,
    created_date: Date,
  ): Promise<ExportWareHouse[]> {
    const startOfDay = new Date(created_date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(created_date);
    endOfDay.setHours(23, 59, 59, 999);
    return this.exportWarehouseRepository.find({
      relations: [
        'task',
        'task.fixer',
        'task.issues',
        'task.issues.issueSpareParts',
        'task.issues.issueSpareParts.sparePart',
      ],
      where: {
        task: {
          fixer: {
            username: ILike(`%${staff_name}%`),
          },
          fixerDate: Between(created_date, endOfDay),
        },
      },
    });
  }

  async checkQuantityInWarehouseAndQuantiyAccepted(
    sparePartId: string,
  ): Promise<number> {
    // step1 get all export warehouse status waiting
    const exportWarehouses = await this.exportWarehouseRepository.find({
      where: {
        status: exportStatus.WAITING,
      },
    });
    // get quantity of spare part in warehouse
    const sparePart = await this.sparePartRepository.findOne({
      where: { id: sparePartId },
    });
    // check detail of export warehouse have spare part same id and sum quantity
    let quantity = 0;
    for (const exportWarehouse of exportWarehouses) {
      for (const issue of exportWarehouse.detail) {
        if (Array.isArray(issue.issueSpareParts)) {
          for (const issueSparePart of issue.issueSpareParts) {
            if (issueSparePart.sparePart.id === sparePartId) {
              quantity += issueSparePart.quantity;
            }
          }
        } else {
          console.warn(
            `issueSpareParts is not iterable for issue with ID: ${issue.id}`,
          );
        }
      }
    }

    return sparePart.quantity - quantity;
  }

  async getOne(id: string): Promise<ExportWareHouse> {
    // relation with task
    return this.exportWarehouseRepository.findOne({
      where: { id },
      relations: [
        'task',
        'task.fixer',
        'task.issues',
        'task.issues.issueSpareParts',
        'task.issues.issueSpareParts.sparePart',
      ],
    });
  }

  async update(
    id: string,
    data: any,
  ): Promise<ExportWareHouse> {
    // find the entity
    const entity = await this.exportWarehouseRepository.findOne({
      where: { id },
      relations: ['task', 'task.device_renew', 'task.request'],
    });
    // check status is changed
    if (data.status && entity.status !== data.status) {
      if (data.status === exportStatus.ACCEPTED) {
        // check quantity of spare part in warehouse with other export warehouse detail quanity, status is EXPORTED
        // export warehouse detail query json in database postgres
        // detail : [
        //   {
        //     "id": "39126fee-cef5-49de-b688-a3094690b986",
        //     "status": "PENDING",
        //     "fixType": "REPLACE",
        //     "createdAt": "2024-11-03T16:18:57.192Z",
        //     "deletedAt": null,
        //     "updatedAt": "2024-11-03T16:19:07.016Z",
        //     "failReason": null,
        //     "description": "3123123",
        //     "taskHistory": null,
        //     "imagesVerify": [],
        //     "videosVerify": null,
        //     "issueSpareParts": [
        //       {
        //         "id": "0fac3b11-7208-4570-a087-f8117c8452dc",
        //         "note": null,
        //         "quantity": 50,
        //         "createdAt": "2024-11-03T16:18:57.226Z",
        //         "deletedAt": null,
        //         "sparePart":
        //         {
        //           "id": "0d1717ca-0859-4eba-a43a-cc518ac84eed",
        //           "name": "Chân vịt may vải dày",
        //           "image": "https://example.com/images/heavy_fabric_foot.jpg",
        //           "quantity": 24,
        //           "createdAt": "2024-09-08T12:27:05.042Z",
        //           "deletedAt": null,
        //           "updatedAt": "2024-09-23T01:37:53.782Z",
        //           "expirationDate": "2025-09-01T00:00:00.000Z"
        //         },
        //         "updatedAt": "2024-11-03T16:18:57.226Z"
        //       }],
        //     "returnSparePartsStaffSignature": null,
        //     "returnSparePartsStockkeeperSignature": null
        //   }
        // ]
        // check
        for (const issue of entity.detail) {
          if (Array.isArray(issue.issueSpareParts)) {
            for (const issueSparePart of issue.issueSpareParts) {
              const quantityInWarehouse =
                await this.checkQuantityInWarehouseAndQuantiyAccepted(
                  issueSparePart.sparePart.id,
                );
              console.log('quantityInWarehouse', quantityInWarehouse);

              if (quantityInWarehouse < issueSparePart.quantity) {
                throw new Error(
                  `Spare part ${issueSparePart.sparePart.name} not enough in warehouse`,
                );
              }
            }
          } else {
            console.warn(
              `issueSpareParts is not iterable for issue with ID: ${issue.id}`,
            );
          }
        }

        if (
          entity.export_type === exportType.DEVICE &&
          entity.task.device_renew
        ) {
          entity.status = exportStatus.ACCEPTED;
          await this.exportWarehouseRepository.save(entity);
        }

        this.headStaffGateway.emit(
          NotificationType.STOCK_ACCEPT_EXPORT_WAREHOUSE,
        )({
          senderId: Accounts.STOCKEEPER,
          taskName: entity.task.name,
          taskId: entity.task.id,
          requestId: entity.task.request.id,
        });
      }
    }
    return super.update(id, data);
  }

  async adminUpdateStatus(ticketId: UUID, isAccept: boolean): Promise<boolean> {
    try {
      const ticket = await this.exportWarehouseRepository.findOne({
        where: { id: ticketId },
      });
      if (!ticket) {
        return false;
      }
      ticket.status = isAccept
        ? exportStatus.WAITING
        : exportStatus.ADMIN_REJECT;
      await this.exportWarehouseRepository.save(ticket);
      console.log(`Ticket with ID ${ticketId} updated successfully`);
      return true;
    } catch (error) {
      return false;
    }
  }

  async adminGetAll(): Promise<ExportWareHouse[]> {
    return this.exportWarehouseRepository.find({
      where: {
        status: In([exportStatus.WAITING_ADMIN, exportStatus.ADMIN_REJECT]),
      },
      relations: [
        'task',
        'task.fixer',
        'task.issues',
        'task.issues.issueSpareParts',
        'task.issues.issueSpareParts.sparePart',
      ],
    });
  }

  async exportDeviceForRenewTask(ticketId: UUID): Promise<boolean> {
    const ticket = await this.exportWarehouseRepository.findOne({
      where: {
        id: ticketId,
      },
    });

    if (ticket == null) {
      return false;
    }

    var model = await this.machineModelRepository.findOne({
      where: {
        id: ticket.detail,
      },
    });

    if (model == null) {
      return false;
    }

    var renewDevice = await this.deviceRepository.findOne({
      where: {
        machineModel: model,
        positionX: null,
        positionY: null,
      },
    });

    if (renewDevice == null) {
      return false;
    }

    var task = await this.taskRepository.findOne({
      where: {
        id: ticket.task.id,
      },
    });

    if (task == null) {
      return false;
    }

    task.device_renew = renewDevice;

    await this.taskRepository.save(task);

    return true;
  }
}
