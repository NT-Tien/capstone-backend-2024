import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/base/service.base';
import { DeviceEntity } from 'src/entities/device.entity';
import { MachineModelEntity } from 'src/entities/machine-model.entity';
import { Repository } from 'typeorm';

@Injectable()
export class DeviceService extends BaseService<DeviceEntity> {
  constructor(
    @InjectRepository(DeviceEntity)
    private readonly deviceRepository: Repository<DeviceEntity>,
    @InjectRepository(MachineModelEntity)
    private readonly machineModelRepository: Repository<MachineModelEntity>,
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

  async getAllUnused() {
    const machineModels = await this.machineModelRepository.find({
      relations: ['devices', 'devices.area'],
    });

    return machineModels.map((mm) => ({
      ...mm,
      devices: mm.devices.filter(
        (d) => !d.positionX && !d.positionY,
      ),
    }));
  }
}
