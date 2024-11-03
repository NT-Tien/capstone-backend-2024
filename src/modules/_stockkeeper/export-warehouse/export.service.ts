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

  async checkQuantityInWarehouseAndQuantiyAccepted(sparePartId: string): Promise<number> {
    const query = `
      SELECT SUM((detail->'issueSpareParts'->0->>'quantity')::numeric) AS "quantity"
      FROM "EXPORT_WAREHOUSE" "export_warehouse"
      WHERE (detail->>'status' = $1 AND (detail->'issueSpareParts'->0->'sparePart'->>'id') = $2)
      AND ("export_warehouse"."deletedAt" IS NULL)
    `;
  
    const parameters = ['ACCEPTED', sparePartId];
  
    const queryRunner = this.exportWarehouseRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    const result = await queryRunner.query(query, parameters);
    await queryRunner.release();
    return result[0]?.quantity || 0;
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
          for (const issueSparePart of issue.issueSpareParts) {
            const quantityInWarehouse = await this.checkQuantityInWarehouseAndQuantiyAccepted(issueSparePart.sparePart.id);
            if (quantityInWarehouse < issueSparePart.quantity) {
              throw new Error(`Spare part ${issueSparePart.sparePart.name} not enough in warehouse`);
            }
          }
        }
      }
    }
    return super.update(id, data);
  }

}
