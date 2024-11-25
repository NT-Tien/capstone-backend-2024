import { HttpException, Injectable } from '@nestjs/common';
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
    @InjectRepository(DeviceEntity)
    private readonly deviceRepository: Repository<DeviceEntity>,
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
      let model = await this.machineModelRepository.findOne({
        where: { id : device.machineModelCode }
      });
      if (!model){
        throw new HttpException(`Machine model is not exist ${device.machineModelCode} `, 404);
      }
      for (let i = 0; i < device.quantity; i++) {
        let newDevice = new DeviceEntity();
        newDevice.machineModel = model; 
        newDevice.description = device.description; 
        newDevice.positionX = null; 
        newDevice.positionY = null; 
        newDevice.operationStatus = 0;
        newDevice.isWarranty = null; 
        newDevice.status = true; 
      }
    }
  
    return true;
  }
}
