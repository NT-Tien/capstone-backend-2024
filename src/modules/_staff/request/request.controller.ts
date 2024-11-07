import {
  Body,
  Controller,
  HttpException,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { RequestEntity } from 'src/entities/request.entity';
import { StaffGuard } from 'src/modules/auth/guards/staff.guard';
import { Repository } from 'typeorm';
import { RequestDto } from './dto/request.dto';
import { Warranty } from 'src/common/constants';
import { TaskEntity } from 'src/entities/task.entity';

@ApiTags('staff: request')
@UseGuards(StaffGuard)
@Controller('staff/request')
export class RequestController {
  constructor(
    @InjectRepository(RequestEntity)
    private readonly requestRepository: Repository<RequestEntity>,
    @InjectRepository(TaskEntity)
    private readonly taskRepository: Repository<TaskEntity>,
  ) {}

  @Put('/update-warranty-date/:id')
  async updateWarrantyDate(
    @Param('id') id: string,
    @Body() dto: RequestDto.RequestUpdateWarrantyDate,
  ) {
    const request = await this.requestRepository.findOne({
      where: {
        id,
      },
      relations: ['tasks', 'tasks.issues', 'tasks.issues.typeError'],
    });

    console.log(request)

    if (!request) {
      throw new HttpException('Request not found', 404);
    }

    // update request
    request.return_date_warranty = new Date(dto.warrantyDate);
    await this.requestRepository.save(request);

    // update receive warranty task
    const receiveWarrantyTask = request.tasks.find((task) => task.issues.filter((i) => i.typeError.id === Warranty.receive).length > 0)
    receiveWarrantyTask.fixerDate = new Date(dto.warrantyDate);
    await this.taskRepository.save(receiveWarrantyTask);

    return request;
  }
}
