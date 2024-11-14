import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeviceEntity } from 'src/entities/device.entity';
import { Repository } from 'typeorm';

@Injectable()
export class DeviceService {
  constructor(
    @InjectRepository(DeviceEntity)
    private readonly deviceRepository: Repository<DeviceEntity>,
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
}
