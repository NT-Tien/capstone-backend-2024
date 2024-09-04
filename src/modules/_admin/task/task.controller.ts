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
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
// import { CacheTTL } from '@nestjs/cache-manager';
import { TaskService } from './task.service';
import { TaskResponseDto } from './dto/response.dto';
import { TaskRequestDto } from './dto/request.dto';
import { TaskStatus } from 'src/entities/task.entity';
import { AdminGuard } from 'src/modules/auth/guards/admin.guard';

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
  getAll(
    @Param('page') page: number,
    @Param('limit') limit: number,
    @Param('status') status: TaskStatus,
  ) {
    return this.taskService.customGetAllTask(page, limit, status);
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
