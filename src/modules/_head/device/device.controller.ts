import {
  Controller,
  Get,
  Param,
  UseGuards
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { HeadGuard } from 'src/modules/auth/guards/head.guard';
import { DeviceService } from './device.service';
import { DeviceResponseDto } from './dto/response.dto';
// import { CacheTTL } from '@nestjs/cache-manager';

@ApiTags('head: device')
@UseGuards(HeadGuard)
@Controller('head/device')
export class DeviceController {
  constructor(private readonly deviceService: DeviceService) {}

  @ApiResponse({
    type: DeviceResponseDto.DeviceGetOne,
    status: 200,
    description: 'Get one Device',
  })
  @ApiBearerAuth()
  @Get(':id')
  async getOneFor(@Param('id') id: string) {
    return await this.deviceService.getOneWithRelations(id);
  }

  @ApiResponse({
    type: DeviceResponseDto.DeviceGetOne,
    status: 200,
    description: 'Get one Device',
  })
  @ApiBearerAuth()
  @Get('history-request/:id')
  async getHistoryRequest(@Param('id') id: string) {
    return await this.deviceService.getHistoryRequest(id);
  }
}
