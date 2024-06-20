import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/base/service.base';
import { SparePartEntity } from 'src/entities/spare-part.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SparePartService extends BaseService<SparePartEntity> {
  constructor(
    @InjectRepository(SparePartEntity)
    private readonly sparePartRepository: Repository<SparePartEntity>,
  ) {
    super(sparePartRepository);
  }

  async customGetAllSparePart(page: number, limit: number, searchName: string): Promise<[SparePartEntity[], number]> {
    return this.sparePartRepository.findAndCount({
      where: { 
        name: searchName.trim() !== '' ? searchName : null,
        deletedAt: null 
      },
      order: { createdAt: 'DESC' },
      relations: ['machineModel'],
      skip: (page - 1) * limit,
      take: limit,
    });
  }
}
