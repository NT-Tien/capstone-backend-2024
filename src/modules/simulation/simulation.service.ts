import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeviceEntity } from 'src/entities/device.entity';
import { RequestEntity } from 'src/entities/request.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SimulationService {
  constructor(
    @InjectRepository(RequestEntity)
    private readonly requestRepository: Repository<RequestEntity>,
    @InjectRepository(DeviceEntity)
    private readonly deviceRepository: Repository<DeviceEntity>,
  ) {}
}
