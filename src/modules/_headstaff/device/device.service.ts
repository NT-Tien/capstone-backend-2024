import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/base/service.base';
import { AreaEntity } from 'src/entities/area.entity';
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
    @InjectRepository(AreaEntity)
    private readonly areaRepository: Repository<AreaEntity>
  ) {
    super(deviceRepository);
  }

    // get all with relations
    async getAllToChooseRenewDevice(machine_model_id: string): Promise<any> {
      const querySuggest = this.deviceRepository
        .createQueryBuilder('device')
        .leftJoinAndSelect('device.machineModel', 'machineModel');
        querySuggest.where('device.positionX IS NULL');
        querySuggest.andWhere('device.positionY IS NULL');
        querySuggest.andWhere('device.machineModelId = :machine_model_id', { machine_model_id });
      let result_suggest = await querySuggest.getMany();

      const queryOther = this.deviceRepository
        .createQueryBuilder('device')
        .leftJoinAndSelect('device.machineModel', 'machineModel');
        queryOther.where('device.positionX IS NOT NULL');
        queryOther.andWhere('device.positionY IS NOT NULL');
        // != machine_model_id
        queryOther.andWhere('device.machineModelId != :machine_model_id', { machine_model_id });
      let result_other = await queryOther.getMany();
  
      return {
        result_suggest,
        result_other
      }
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

  async checkKeyPosition
  (areaId: string, positionX: string, positionY: string,
  ): Promise<boolean> {{
    const isKey = false;
      const model = await this.areaRepository.findOneOrFail({
        where: {
          id: areaId,
        }
      });

      if(model.keyPosition == null ){
        return false;
      }

      const cobineKey = positionX + "_" + positionY;
      if (model.keyPosition && model.keyPosition.includes(cobineKey)) {
        return true;
      }

      return isKey;
    }
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
      relations: ['devices', 'devices.area', 'devices.machineModel', 'devices.requests'],
    });

    return machineModels.map((mm) => ({
      ...mm,
      devices: mm.devices.filter(
        (d) => !d.positionX && !d.positionY && !d.area,
      ),
    }));
  }

  async getAllSatusFalse() {
    return this.deviceRepository.find({
      where: { status: false },
      relations: ['area', 'machineModel'],
    });

  }
}
