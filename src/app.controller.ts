import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { request } from 'http';
import { AreaEntity } from 'src/entities/area.entity';
import { DeviceEntity } from 'src/entities/device.entity';
import { RequestEntity } from 'src/entities/request.entity';
import { TaskEntity } from 'src/entities/task.entity';
import { IsNull, Repository } from 'typeorm';

@ApiTags('testing only')
@Controller('globals')
export class AppController {
  constructor(
    @InjectRepository(TaskEntity)
    private readonly taskRepository: Repository<TaskEntity>,
    @InjectRepository(RequestEntity)
    private readonly requestRepository: Repository<RequestEntity>,
    @InjectRepository(AreaEntity)
    private readonly areaRepository: Repository<AreaEntity>,
  ) {}

  @Get('/update-area-request')
  async requestUpdateArea() {
    const requests = await this.requestRepository.find();

    requests.forEach((req) => {
      if (req.old_device.area === null) return;
      console.log(req.old_device.area.id);

      this.requestRepository.update(
        {
          id: req.id,
        },
        {
          area: req.old_device.area,
        },
      );
    });
  }

  @Get()
  async addDeviceStaticToTask() {
    const query = this.taskRepository.createQueryBuilder('task');
    query.leftJoinAndSelect('task.request', 'request');
    query.where('task.device_static IS NULL');
    const bad = await query.getMany();
    console.log(bad);

    for (let i = 0; i < bad.length; i++) {
      if (bad[i].request?.old_device)
        await this.taskRepository.save({
          ...bad[i],
          device_static: bad[i].request.old_device,
        });
    }
  }

  @Get('/request')
  async addOldDeviceToRequest() {
    const bad = await this.requestRepository.find({
      where: {
        old_device: IsNull(),
      },
      relations: ['device', 'device.machineModel', 'device.area'],
      withDeleted: true,
    });

    const area = await this.areaRepository.find({});
    const current = area[0];
    console.log(current);

    for (const request of bad) {
      const device = request.device;
      if (!device.positionX) device.positionX = Math.floor(Math.random() * 100);
      if (!device.positionY) device.positionY = Math.floor(Math.random() * 100);
      if (!~device.area) device.area = current;

      this.requestRepository.save({
        ...request,
        old_device: device,
      });
    }
  }

  @Get('/test')
  async idk() {
    const all = await this.requestRepository.find({});

    const bad = all.filter((req) => req.old_device.area === null);

    const area = await this.areaRepository.find({});
    const current = area[0];

    for (const request of bad) {
      const device = request.old_device;
      if (!device.positionX) device.positionX = Math.floor(Math.random() * 100);
      if (!device.positionY) device.positionY = Math.floor(Math.random() * 100);
      if (!device.area) device.area = current;

      this.requestRepository.save({
        ...request,
        old_device: device,
      });
    }
  }
}
