import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/base/service.base';
import { AreaEntity } from 'src/entities/area.entity';
import { RequestAddDeviceEntity } from 'src/entities/request_add_device';
import { Repository } from 'typeorm';

@Injectable()
export class RequestAddDeviceService extends BaseService<RequestAddDeviceEntity> {
  constructor(
    @InjectRepository(RequestAddDeviceEntity)
    private readonly requestAddDeviceRepository: Repository<RequestAddDeviceEntity>,
  ) {
    super(requestAddDeviceRepository);
  }

}
