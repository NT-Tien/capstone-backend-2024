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
import { HeadStaffGuard } from 'src/modules/auth/guards/headstaff.guard';
import { TaskResponseDto } from './dto/response.dto';
import { TaskRequestDto } from './dto/request.dto';

@ApiTags('head staff: task')
@UseGuards(HeadStaffGuard)
@Controller('head-staff/task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @ApiBearerAuth()
  @ApiResponse({
    type: TaskResponseDto.TaskGetAll,
    status: 200,
    description: 'Get all Tasks',
  })
  @Get()
  async getAll() {
    return await this.taskService.getAll();
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
    return await this.taskService.getOne(id);
  }

  @ApiBearerAuth()
  @ApiResponse({
    type: TaskResponseDto.TaskCreate,
    status: 201,
    description: 'Create a Task',
  })
  @Post()
  async create(@Body() body: TaskRequestDto.TaskCreateDto) {
    return await this.taskService.create(
      TaskRequestDto.TaskCreateDto.plainToClass(body),
    );
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

  @ApiBearerAuth()
  @ApiResponse({
    type: TaskResponseDto.TaskDelete,
    status: 200,
    description: 'Hard delete a Task',
  })
  @Delete(':id')
  async deleteHard(@Param('id') id: string) {
    return await this.taskService.delete(id);
  }

  @ApiBearerAuth()
  @ApiResponse({
    type: TaskResponseDto.TaskDelete,
    status: 200,
    description: 'Soft delete a Task',
  })
  @Delete('soft-delete/:id')
  async delete(@Param('id') id: string) {
    return await this.taskService.softDelete(id);
  }

  @ApiBearerAuth()
  @ApiResponse({
    type: TaskResponseDto.TaskRestore,
    status: 200,
    description: 'Restore a Task',
  })
  @Put('restore/:id')
  async restore(@Param('id') id: string) {
    return await this.taskService.restore(id);
  }
}
