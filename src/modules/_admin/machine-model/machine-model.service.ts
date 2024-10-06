import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/base/service.base';
import { MachineModelEntity } from 'src/entities/machine-model.entity';
import { Repository } from 'typeorm';
import { MachineModelRequestDto } from './dto/request.dto';

@Injectable()
export class MachineModelService extends BaseService<MachineModelEntity> {
  constructor(
    @InjectRepository(MachineModelEntity)
    private readonly machineModelRepository: Repository<MachineModelEntity>,
  ) {
    super(machineModelRepository);
  }

  async getAllBasic(dto: MachineModelRequestDto.MachineModelBasicAllQuery) {
    console.log(dto.withDevices)
    if(dto.withDevices === 'true') {
      return await this.machineModelRepository.find({
        relations: ['devices'],
      });
    } else {
      return await this.machineModelRepository.find({
      });
    }
  }

  async getOneWithRelations(id: string) {
    return await this.machineModelRepository.findOne({
      where: { id },
      relations: ['devices', 'typeErrors', 'spareParts']
    })
  }
}
