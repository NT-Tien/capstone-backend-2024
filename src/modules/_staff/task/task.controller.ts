import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  ParseBoolPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
// import { CacheTTL } from '@nestjs/cache-manager';
import { TaskService } from './task.service';
import { TaskResponseDto } from './dto/response.dto';
import { StaffGuard } from 'src/modules/auth/guards/staff.guard';
import { TaskEntity, TaskStatus } from 'src/entities/task.entity';
import { UUID } from 'crypto';
import { log } from 'console';
import { IssueStatus } from 'src/entities/issue.entity';
import { TaskRequestDto } from './dto/request.dto';

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
  @Get('')
  getAll(@Headers('user') user: any) {
    console.log(user);

    return this.taskService.staffGetAllTask(user.id);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: "Get all staff's task by date" })
  @Get('/all-by-date')
  getAllByDate(
    @Headers('user') user: any,
    @Query() dto: TaskRequestDto.TaskAllByDate,
  ) {
    return this.taskService.staffGetAllTaskByDate(user.id, dto);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: "Get staff's task counts" })
  @Get('/all-counts')
  getAllCounts(
    @Headers('user') user: any,
    @Query() dto: TaskRequestDto.TaskAllCount,
  ) {
    return this.taskService.staffGetAllTaskCounts(user.id, dto);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current in-progress tasks for user' })
  @Get('/all/in-progress')
  getAllInProgress(@Headers('user') user: any) {
    return this.taskService.getAllInProgressTasks(user.id)
  }

  @ApiBearerAuth()
  @ApiResponse({
    type: TaskResponseDto.TaskGetOne,
    status: 200,
    description: 'Get staff task detail',
  })
  @Get(':taskId')
  getOne(@Headers('user') user: any, @Param('taskId') taskId: UUID) {
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
  confirmReceipt(@Param('taskId') taskId: UUID, @Headers('user') user: any) {
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
  confirmInProgress(@Param('taskId') taskId: UUID, @Headers('user') user: any) {
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
    @Body() body: TaskRequestDto.TaskConfirmDoneDto,
    @Query() query?: TaskRequestDto.TaskCompleteQuery,
  ) {
    return this.taskService.confirmCompletion(
      user.id,
      taskId,
      body,
      query.autoClose,
    );
  }

  @ApiOperation({ summary: 'Complete a SEND warranty task' })
  @ApiBearerAuth()
  @Post('/complete/:taskId/warranty')
  confirmDoneWarranty(
    @Param('taskId') taskId: UUID,
    @Headers('user') user: any,
    @Body() body: TaskRequestDto.FinishSendWarrantyDto,
  ) {
    return this.taskService.completeTaskWarranty(taskId, user.id, body);
  }

  @ApiBearerAuth()
  @ApiResponse({
    type: TaskResponseDto.TaskUpdate,
    status: 200,
    description: 'Confirm done',
  })
  @Post('request-task-cancel/:taskId')
  requestTaskCancel(@Param('taskId') taskId: UUID, @Headers('user') user: any) {
    return this.taskService.staffRequestCanncelTask(user.id, taskId);
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
