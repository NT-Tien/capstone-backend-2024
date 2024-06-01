import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/base/service.base';
import { AreaEntity } from 'src/entities/area.entity';
import { PositionEntity } from 'src/entities/position.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PositionService extends BaseService<PositionEntity> {
  constructor(
    @InjectRepository(PositionEntity)
    private readonly positionRepository: Repository<PositionEntity>,
  ) {
    super(positionRepository);
  }

  // get all with relations
  async getAllWithRelations(): Promise<PositionEntity[]> {
    return this.positionRepository.find({
      relations: ['area', 'device'],
    });
  }
}
