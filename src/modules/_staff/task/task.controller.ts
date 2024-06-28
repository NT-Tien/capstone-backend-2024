import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
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
import { IssueStatus } from 'src/entities/issue.entity';

@ApiTags('staff: task')
@UseGuards(StaffGuard)
@Controller('staff/task')
export class TaskController {
  constructor(private readonly taskService: TaskService) { }

  @ApiBearerAuth()
  @ApiResponse({
    type: TaskResponseDto.TaskGetAll,
    status: 200,
    description: 'Get all staff task order by priority and time',
  })
  @Get('')
  getAll(
    @Headers('user') user: any,
  ) {
    return this.taskService.staffGetAllTask(user.id);
  }

  @ApiBearerAuth()
  @ApiResponse({
    type: TaskResponseDto.TaskGetOne,
    status: 200,
    description: 'Get staff task detail',
  })
  @Get(':taskId')
  getOne(
    @Headers('user') user: any,
    @Param('taskId') taskId: UUID,
  ) {
    return this.taskService.customStaffGetTaskDetail(user.id, taskId);
  }

  // confirm receipt
  @ApiBearerAuth()
  @ApiResponse({
    type: TaskResponseDto.TaskUpdate,
    status: 200,
    description: 'Confirm receipt',
  })
  @Post('receipt/:taskId')
  confirmReceipt(
    @Param('taskId') taskId: UUID,
    @Headers('user') user: any,
  ) {
    return this.taskService.confirmReceipt(user.id, taskId);
  }

  // confirm in progress
  @ApiBearerAuth()
  @ApiResponse({
    type: TaskResponseDto.TaskUpdate,
    status: 200,
    description: 'Confirm in progress',
  })
  @Post('in-progress/:taskId')
  confirmInProgress(
    @Param('taskId') taskId: UUID,
    @Headers('user') user: any,
  ) {
    return this.taskService.confirmInProcess(user.id, taskId);
  }

  // confirm done
  @ApiBearerAuth()
  @ApiResponse({
    type: TaskResponseDto.TaskUpdate,
    status: 200,
    description: 'Confirm done',
  })
  @Post('complete/:taskId')
  confirmDone(
    @Param('taskId') taskId: UUID,
    @Headers('user') user: any,
  ) {
    return this.taskService.confirmCompletion(user.id, taskId);
  }

  // update issue status
  @ApiBearerAuth()
  @ApiResponse({
    type: TaskResponseDto.TaskUpdate,
    status: 200,
    description: 'Update issue status',
  })
  @Put('issue/:issueId/:status')
  updateIssueStatus(
    @Param('issueId') issueId: UUID,
    @Param('status') status: IssueStatus,
    @Headers('user') user: any,
  ) {
    return this.taskService.updateIssueStatus(user.id, issueId, status);
  }


  // @ApiBearerAuth()
  // @ApiResponse({
  //   type: TaskResponseDto.TaskGetAll,
  //   status: 200,
  //   description: 'Get all Tasks',
  // })
  // @Get(":userid/:status")
  // async getTaskbyStatus( 
  //   @Param('userid') userId: string,
  //   @Param('status') status: string) {
  //   return await this.taskService.getTaskByStatus(userId, status);
  // }

  // @ApiBearerAuth()
  // @ApiResponse({
  //   type: TaskResponseDto.TaskGetOne,
  //   status: 200,
  //   description: 'Get all Tasks',
  // })
  // @Get("detail/:fixerid/:taskid")
  // async getTaskbyId( 
  //   @Param('fixerid') fixerid : UUID,
  //   @Param('taskid') taskid : UUID
  // ) {
  //   return await this.taskService.getbyid(taskid, fixerid);
  // }



  // @ApiBearerAuth()
  // @ApiResponse({
  //   type: TaskResponseDto.TaskUpdate,
  //   status: 200,
  // })
  // @Post('receipt/:taskid')
  // async receipt(@Param('taskid') taskid: UUID,) {
  //   console.log(taskid); // Đảm bảo in ra để kiểm tra listId
  //   log(taskid);
  //   return await this.taskService.checkReceipt(taskid);
  // }


  // @ApiBearerAuth()
  // @ApiResponse({
  //   type: TaskResponseDto.TaskUpdate,
  //   status: 200,
  // })
  // @Post('updateIssue/:issueid/:newStatus')
  // async updateIssue(
  //   @Param('issueid') issueid: UUID,
  //   @Param('newStatus') newStatus: string,
  // ) {
  //   return await this.taskService.updateissueStatus(issueid, newStatus);
  // } 
}
