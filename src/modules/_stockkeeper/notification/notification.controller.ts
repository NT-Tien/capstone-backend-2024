import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
// import { CacheTTL } from '@nestjs/cache-manager';
import { UUID } from 'crypto';
import { StockkeeperGuard } from 'src/modules/auth/guards/stockkeeper.guard';
import { NotificationResponseDto } from './dto/response.dto';
import { NotificationService } from './notification.service';
import { NotificationRequestDto } from './dto/request.dto';
import { TaskStatus } from 'src/entities/task.entity';

@ApiTags('stockkeeper: task')
@UseGuards(StockkeeperGuard)
@Controller('stockkeeper/notification')
export class NotificationController {
  constructor(private readonly taskService: NotificationService) {}

  @ApiBearerAuth()
  @Get('/search/:page/:limit')
  getAllTasks(
    @Param('page') page: number,
    @Param('limit') limit: number
  ) {
    return this.taskService.stockeeperGetAllNoti(
      page,
      limit
    );
  }

  @ApiResponse({
    type: NotificationResponseDto.NotificationGetOne,
    status: 200,
    description: 'Get one Task',
  })
  @ApiBearerAuth()
  @Get(':id')
  async getOneFor(@Param('id') id: string) {
    return await this.taskService.getOneNotification(id);
  }

  @ApiResponse({
    type: NotificationResponseDto.NotificationGetOne,
    status: 200,
    description: 'Get one Task',
  })
  @ApiBearerAuth()
  @Get('dashboard/:from/:to')
  async getDashboard(
    @Param('from') from: Date,
    @Param('to') to: Date
  ) {
    return await this.taskService.getDashboard(from,to);
  }

  @ApiResponse({
    type: NotificationResponseDto.NotificationGetOne,
    status: 200,
    description: 'Get noti count',
  })
  @ApiBearerAuth()
  @Get('getNotiNumber"')
  async getNotiNumber(
  ) {
    return await this.taskService.getNotiNumber();
  }
}