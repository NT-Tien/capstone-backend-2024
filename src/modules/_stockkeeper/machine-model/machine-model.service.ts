import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/base/service.base';
import { MachineModelEntity } from 'src/entities/machine-model.entity';
import { RequestDto } from 'src/modules/_staff/request/dto/request.dto';
import { MachineModelRequestDto } from './dto/request.dto';
import { Repository } from 'typeorm';
import { DeviceEntity } from 'src/entities/device.entity';

@Injectable()
export class MachineModelService extends BaseService<MachineModelEntity> {
  constructor(
    @InjectRepository(MachineModelEntity)
    private readonly machineModelRepository: Repository<MachineModelEntity>,
  ) {
    super(machineModelRepository);
  }

  async customGetAll(page: number, limit: number) {
    return await this.machineModelRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  async customGetOne(id: string) {
    return await this.machineModelRepository.findOne({
      where: { id },
      relations: ['spareParts'],
    });
  }

  async importDevices(devices: MachineModelRequestDto.ImportDevicetDto[]): Promise<boolean> {
    const uniqueDevices = new Set(); 
    for (const device of devices) {
      
      for (let i = 0; i < device.quantity; i++) {
        const newDevice = new DeviceEntity();
        
        newDevice.machineModel = { id: device.machineModelCode } as MachineModelEntity; 
        newDevice.description = null; 
        newDevice.positionX = null; 
        newDevice.positionY = null; 
        newDevice.operationStatus = 0;
        newDevice.isWarranty = null; 
        newDevice.status = true; 

        await this.create(newDevice);
      }
    }
  
    return true;
  }
}
