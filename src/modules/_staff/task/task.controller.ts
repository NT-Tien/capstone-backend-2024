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
import { log } from 'console';

@ApiTags('staff: task')
@UseGuards(StaffGuard)
@Controller('staff/task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

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

  @ApiBearerAuth()
  @ApiResponse({
    type: TaskResponseDto.TaskGetOne,
    status: 200,
    description: 'Get all Tasks',
  })
  @Get("detail/:fixerid/:taskid")
  async getTaskbyId( 
    @Param('fixerid') fixerid : UUID,
    @Param('taskid') taskid : UUID
  ) {
    return await this.taskService.getbyid(taskid, fixerid);
  }



  @ApiBearerAuth()
  @ApiResponse({
    type: TaskResponseDto.TaskUpdate,
    status: 200,
  })
  @Post('receipt/:taskid')
  async receipt(@Param('taskid') taskid: UUID,) {
    console.log(taskid); // Đảm bảo in ra để kiểm tra listId
    log(taskid);
    return await this.taskService.checkReceipt(taskid);
  }


  @ApiBearerAuth()
  @ApiResponse({
    type: TaskResponseDto.TaskUpdate,
    status: 200,
  })
  @Post('updateIssue/:issueid/:newStatus')
  async updateIssue(
    @Param('issueid') issueid: UUID,
    @Param('newStatus') newStatus: string,
  ) {
    return await this.taskService.updateissueStatus(issueid, newStatus);
  } 
}
