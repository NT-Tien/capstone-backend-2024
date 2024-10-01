import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Put,
  Query,
  UseGuards
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
// import { CacheTTL } from '@nestjs/cache-manager';
import { TaskStatus } from 'src/entities/task.entity';
import { AdminGuard } from 'src/modules/auth/guards/admin.guard';
import { TaskRequestDto } from './dto/request.dto';
import { TaskResponseDto } from './dto/response.dto';
import { TaskService } from './task.service';

@ApiTags('admin: task')
@UseGuards(AdminGuard)
@Controller('admin/task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @ApiBearerAuth()
  @ApiResponse({
    type: TaskResponseDto.TaskGetAll,
    status: 200,
    description: 'Get all Tasks',
  })
  @Get(':page/:limit/:status')
  async getAll(
    @Param('page') page: number,
    @Param('limit') limit: number,
    @Param('status') status: TaskStatus,
    @Query('time') time: number = 1,
    @Query('all') all: boolean = false,
  ) {
    if (all) {
      return await this.taskService.getAll();
    }
    return await this.taskService.customGetAllTask(page, limit, status, time);
  }

  @ApiOperation({ summary: 'Get all tasks with filter and order' })
  @ApiBearerAuth()
  @Get('/all/:page/:limit')
  async getAllWithFilterAndOrder(
    @Param('page', ParseIntPipe) page: number,
    @Param('limit', ParseIntPipe) limit: number,
    @Query() filter: TaskRequestDto.TaskFilterDto,
    @Query() order: TaskRequestDto.TaskOrderDto,
  ) {
    return this.taskService.getAllTasksWithFilterAndOrder(
      page,
      limit,
      filter,
      order,
    );
  }

  @ApiBearerAuth()
  @ApiResponse({
    type: TaskResponseDto.TaskGetAll,
    status: 200,
    description: 'Get all Tasks',
  })
  @Get('get-all-by-area-id/:areaId')
  getAllTaskInfoByAreaId(@Param('areaId') areaID: string) {
    return this.taskService.getAllInfoTaskByAreaId(areaID);
  }

  // @ApiResponse({
  //   type: TaskResponseDto.TaskGetAll,
  //   status: 200,
  //   description: 'Get all categories',
  // })
  // @CacheTTL(10)
  // @Get('get-all-cache')
  // async getAllForUser() {
  //   return await this.taskService.getAll();
  // }

  @ApiBearerAuth()
  @Get('include-deleted')
  async getAllWithDeleted() {
    return await this.taskService.getAllWithDeleted();
  }

  @ApiResponse({
    type: TaskResponseDto.TaskGetOne,
    status: 200,
    description: 'Get one Task',
  })
  @ApiBearerAuth()
  @Get(':id')
  async getOneFor(@Param('id') id: string) {
    return await this.taskService.getOneTask(id);
  }

  @ApiBearerAuth()
  @ApiResponse({
    type: TaskResponseDto.TaskUpdate,
    status: 200,
    description: 'Update a Task',
  })
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() body: TaskRequestDto.TaskUpdateDto,
  ) {
    return await this.taskService.update(
      id,
      TaskRequestDto.TaskUpdateDto.plainToClass(body),
    );
  }
}
