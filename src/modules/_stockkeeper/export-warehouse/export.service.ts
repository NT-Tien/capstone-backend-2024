import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { exportStatus, ExportWareHouse } from 'src/entities/export-warehouse.entity';
import { BaseService } from 'src/common/base/service.base';
import { SparePartEntity } from 'src/entities/spare-part.entity';

@Injectable()
export class ExportWareHouseService extends BaseService<ExportWareHouse> {
  constructor(
    @InjectRepository(ExportWareHouse)
    private readonly exportWarehouseRepository: Repository<ExportWareHouse>,
    @InjectRepository(SparePartEntity)
    private readonly sparePartRepository: Repository<SparePartEntity>,
  ) {
    super(exportWarehouseRepository);
  }

  async getAll(): Promise<ExportWareHouse[]> {
    return this.exportWarehouseRepository.find({
      relations: [
        'task',
        'task.fixer',
        'task.issues',
        'task.issues.issueSpareParts',
        'task.issues.issueSpareParts.sparePart',
      ]
    });
  }

  async checkQuantityInWarehouseAndQuantiyAccepted(sparePartId: string) {
    // return number available for this spare part to accept export
    const quantityInWarehouse = await this.exportWarehouseRepository.createQueryBuilder('export_warehouse')
      .select('SUM(detail->\'issueSpareParts\'->0->>\'quantity\')', 'quantity')
      .where('detail->>\'status\' = :status', { status: exportStatus.EXPORTED })
      .andWhere('detail->>\'issueSpareParts\'->0->>\'sparePart\'->>\'id\' = :sparePartId', { sparePartId })
      .getRawOne();
    // compare with quantity of spare part in warehouse
    const sparePart_quantity = await this.sparePartRepository.findOne({ where: { id: sparePartId } });
    return sparePart_quantity.quantity - quantityInWarehouse.quantity;
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
      ]
    });
  }


  async update(id: string, data: any): Promise<ExportWareHouse> {
    // find the entity
    const entity = await this.exportWarehouseRepository.findOne({ where: { id } });
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
          const quantityInWarehouse = await this.exportWarehouseRepository.createQueryBuilder('export_warehouse')
            .select('SUM(detail->\'issueSpareParts\'->0->>\'quantity\')', 'quantity')
            .where('detail->>\'status\' = :status', { status: exportStatus.EXPORTED })
            .andWhere('detail->>\'issueSpareParts\'->0->>\'sparePart\'->>\'id\' = :sparePartId', { sparePartId: issue.issueSparePart.id })
            .getRawOne();
          if (quantityInWarehouse.quantity < issue.quantity) {
            throw new Error(`Not enough quantity of ${issue.issueSparePart.name} in warehouse`);
          }
        }
      }
    }
    return super.update(id, data);
  }

}
