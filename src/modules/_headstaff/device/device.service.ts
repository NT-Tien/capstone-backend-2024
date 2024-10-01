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
  async getAllWithRelationsNoPosition(): Promise<DeviceEntity[]> {
    const query = this.deviceRepository
      .createQueryBuilder('device')
      .leftJoinAndSelect('device.machineModel', 'machineModel');

    query.where('device.positionX IS NULL');
    query.andWhere('device.positionY IS NULL');

    return query.getMany();
  }

  // get one with relations
  async getOneWithRelations(id: string): Promise<DeviceEntity> {
    return this.deviceRepository.findOne({
      where: { id },
      relations: [
        'area',
        'machineModel',
        'machineModel.spareParts',
        'machineModel.typeErrors',
      ],
    });
  }

  // get history request by device id
  async getHistoryRequest(id: string): Promise<DeviceEntity> {
    return this.deviceRepository.findOne({
      where: { id },
      relations: ['requests', 'requests.requester'],
    });
  }
}
