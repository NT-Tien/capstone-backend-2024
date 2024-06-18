import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/base/service.base';
import { MachineModelEntity } from 'src/entities/machine-model.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MachineModelService extends BaseService<MachineModelEntity> {
  constructor(
    @InjectRepository(MachineModelEntity)
    private readonly machineModelRepository: Repository<MachineModelEntity>,
  ) {
    super(machineModelRepository);
  }
}
