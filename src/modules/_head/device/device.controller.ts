import {
  Controller,
  Get,
  Param,
  UseGuards
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { HeadGuard } from 'src/modules/auth/guards/head.guard';
import { DeviceService } from './device.service';

@ApiTags('head: device')
@UseGuards(HeadGuard)
@Controller('head/device')
export class DeviceController {
  constructor(private readonly deviceService: DeviceService) {}

  @ApiOperation({
    summary: "Get device by ID",
    description: "Returns all information about a device"
  })
  @ApiBearerAuth()
  @Get(':id')
  async getOneFor(@Param('id') id: string) {
    return await this.deviceService.getOneWithRelations(id);
  }

  @ApiOperation({
    summary: "Get device with request history",
    description: "Returns all information about a device with request history from all users"
  })
  @ApiBearerAuth()
  @Get('history-request/:id')
  async getHistoryRequest(@Param('id') id: string) {
    return await this.deviceService.getHistoryRequest(id);
  }
}
