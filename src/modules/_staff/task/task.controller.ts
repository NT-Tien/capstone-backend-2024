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
import { SparePartResponseDto } from './dto/response.dto';
import { SparePartRequestDto } from './dto/request.dto';
import { StaffGuard } from 'src/modules/auth/guards/staff.guard';

@ApiTags('staff: task')
@Controller('staff/task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @UseGuards(StaffGuard)
  @ApiBearerAuth()
  @ApiResponse({
    type: SparePartResponseDto.SparePartGetAll,
    status: 200,
    description: 'Get all SpareParts',
  })
  @Get()
  async getStaffTask( @Param('userId') userId: string) {
    return await this.taskService.getStaffTask(userId);
  }

  




  
 
}
