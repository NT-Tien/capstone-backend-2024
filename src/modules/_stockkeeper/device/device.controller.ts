import { Controller, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { DeviceService } from 'src/modules/_stockkeeper/device/device.service';
import { StockkeeperGuard } from 'src/modules/auth/guards/stockkeeper.guard';

@ApiTags('stockkeeper: device')
@UseGuards(StockkeeperGuard)
@Controller('stockkeeper/device')
export class DeviceController {
  constructor(private readonly deviceService: DeviceService) {}

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Dismantle device',
    description:
      'Dismantle device by removing positionX, positionY, area, and set status to false',
  })
  @Post('/:id/dismantle')
  async dismantle(@Param('id') id: string) {
    return this.deviceService.dismantle(id);
  }
}
