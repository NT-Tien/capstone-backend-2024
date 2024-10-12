import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/base/service.base';
import { AreaEntity } from 'src/entities/area.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AreaService extends BaseService<AreaEntity> {
  constructor(
    @InjectRepository(AreaEntity)
    private readonly areaRepository: Repository<AreaEntity>,
  ) {
    super(areaRepository);
  }

  async getOneAreaById(id: string): Promise<AreaEntity> {
    return this.areaRepository.findOne({
      where: { id },
      relations: ['devices', 'devices.requests'],
    });
  }

}
