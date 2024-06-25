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
import { StaffGuard } from 'src/modules/auth/guards/staff.guard';
import { TaskEntity, TaskStatus } from 'src/entities/task.entity';
import { UUID } from 'crypto';

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
  @Get(':userid/:page/:limit/:status')
  getAll(
    @Param('userid') userid: UUID,
    @Param('page') page: number,
    @Param('limit') limit: number,
    @Param('status') status: TaskStatus,
  ) {
    return this.taskService.staffGetAllTask(userid,page, limit, status);
  }


  @UseGuards(StaffGuard)
  @ApiBearerAuth()
  @ApiResponse({
    type: TaskResponseDto.TaskGetOne,
    status: 200,
    description: 'Get curent Tasks',
  })
  @Get("curenttask")
  async getcurrentTask( @Param('userId') userId: string) {
    try{
    return await this.taskService.getCurrentTask(userId);
    }catch(error){
      return null;
    }
  }

  //@UseGuards(StaffGuard)
  @ApiBearerAuth()
  @ApiResponse({
    type: TaskResponseDto.TaskGetAll,
    status: 200,
    description: 'Get all Tasks',
  })
  @Get(":userid/:status")
  async getTaskbyStatus( 
    @Param('userid') userId: string,
    @Param('status') status: string) {
    return await this.taskService.getTaskByStatus(userId, status);
  }

  //@UseGuards(StaffGuard)
  @ApiBearerAuth()
  @ApiResponse({
    type: TaskResponseDto.TaskGetOne,
    status: 200,
    description: 'Get all Tasks',
  })
  @Get("detail")
  async getTaskbyId( 
    @Param('fixerid') fixerid : UUID,
    @Param('taskid') taskid : UUID
  ) {
    return await this.taskService.getbyid(taskid, fixerid);
  }



  






  
 
}
