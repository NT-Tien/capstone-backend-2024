import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/base/service.base';
import { AreaEntity } from 'src/entities/area.entity';
import { StaffRequestChangeSparePartEntity, StaffRequestChangeSparePartStatus } from 'src/entities/staff_request_change_spare_part.entity';
import { Repository } from 'typeorm';

@Injectable()
export class StaffRequestChangeSparePartSerivce extends BaseService<StaffRequestChangeSparePartEntity> {
  constructor(
    @InjectRepository(StaffRequestChangeSparePartEntity)
    private readonly staffRequestChangeSparePartRepository: Repository<StaffRequestChangeSparePartEntity>,
  ) {
    super(staffRequestChangeSparePartRepository);
  }

  async customGetAllTaskReturn(
    page: number,
    limit: number,
    status: StaffRequestChangeSparePartStatus,
  ): Promise<[StaffRequestChangeSparePartEntity[], number]> {
    return this.staffRequestChangeSparePartRepository.findAndCount({
      where: {
        status: status ? status : undefined,
      },
      relations: ['fixer', 'stockkeeper', 'issueSparePart', 'issueSparePart.sparePart'],
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
  }

}
