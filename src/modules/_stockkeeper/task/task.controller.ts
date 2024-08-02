import {
  Controller,
  Get,
  Headers,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
// import { CacheTTL } from '@nestjs/cache-manager';
import { UUID } from 'crypto';
import { StockkeeperGuard } from 'src/modules/auth/guards/stockkeeper.guard';
import { TaskResponseDto } from './dto/response.dto';
import { TaskService } from './task.service';

@ApiTags('stockkeeper: task')
@UseGuards(StockkeeperGuard)
@Controller('stockkeeper/task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @ApiBearerAuth()
  @ApiResponse({
    type: TaskResponseDto.TaskGetAll,
    status: 200,
    description: 'Get all Tasks is not confirm receipt',
  })
  @Get(':page/:limit')
  getAll(@Param('page') page: number, @Param('limit') limit: number) {
    return this.taskService.customGetAllTask(page, limit);
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
}
