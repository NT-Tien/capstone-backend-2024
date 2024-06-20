import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
// import { CacheTTL } from '@nestjs/cache-manager';
import { TaskService } from './task.service';
import { TaskResponseDto } from './dto/response.dto';
import { TaskRequestDto } from './dto/request.dto';
import { StaffGuard } from 'src/modules/auth/guards/staff.guard';
import { TaskEntity } from 'src/entities/task.entity';

@ApiTags('staff: task')
@Controller('staff/task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @UseGuards(StaffGuard)
  @ApiBearerAuth()
  @ApiResponse({
    type: TaskResponseDto.TaskGetAll,
    status: 200,
    description: 'Get all staff task order by priority and time',
  })
  @Get()
  async getStaffTask( @Param('userId') userId: string) {
    return await this.taskService.getStaffTask(userId);
  }



  @UseGuards(StaffGuard)
  @ApiBearerAuth()
  @ApiResponse({
    type: TaskResponseDto.TaskGetAll,
    status: 200,
    description: 'Get all Tasks',
  })
  @Get("curenttask")
  async getcurrentTask( @Param('userId') userId: string) {
    return await this.taskService.getCurrentTask(userId);
  }

  @UseGuards(StaffGuard)
  @ApiBearerAuth()
  @ApiResponse({
    type: TaskResponseDto.TaskGetAll,
    status: 200,
    description: 'Get all Tasks',
  })
  @Get("status")
  async getTaskbyStatus( @Param('userId') userId: string,@Param('status') status: string) {
    return await this.taskService.getTaskByStatus(userId, status);
  }

  @UseGuards(StaffGuard)
  @ApiBearerAuth()
  @ApiResponse({
    type: TaskEntity,
    status: 200,
    description: 'Get all Tasks',
  })
  @Get("{id}")
  async getTaskbyId( @Param('id') id : string) {
    return await this.taskService.getbyid(id);
  }



  






  
 
}
