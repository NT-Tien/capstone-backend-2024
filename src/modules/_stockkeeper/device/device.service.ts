import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UUID } from 'crypto';
import { AreaEntity } from 'src/entities/area.entity';
import { DeviceEntity } from 'src/entities/device.entity';
import { Repository } from 'typeorm';

@Injectable()
export class DeviceService {
  constructor(
    @InjectRepository(DeviceEntity)
    private readonly deviceRepository: Repository<DeviceEntity>,
    @InjectRepository(AreaEntity)
    private readonly areaRepository: Repository<AreaEntity>,
  ) {}

  async dismantle(id: string) {
    const device = await this.deviceRepository.findOneOrFail({
      where: {
        id,
      },
      relations: ['requests'],
    });

    return this.deviceRepository.update(
      {
        id: device.id,
      },
      {
        area: null,
        positionX: null,
        positionY: null,
        status: false,
      },
    );
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
}