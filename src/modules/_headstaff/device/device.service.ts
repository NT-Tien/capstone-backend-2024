import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/base/service.base';
import { DeviceEntity } from 'src/entities/device.entity';
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
      relations: ['area', 'machineModel', 'machineModel.spareParts'],
    });
  }

  // get one with relations
  async getOneWithRelations(id: string): Promise<DeviceEntity> {
    return this.deviceRepository.findOne({
      where: { id },
      relations: ['area', 'machineModel', 'machineModel.spareParts'],
    });
  }
}
