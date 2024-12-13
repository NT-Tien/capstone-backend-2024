import { Controller, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UUID } from 'crypto';
import { get } from 'http';
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
      'Dismantle device by removing positionX, positionY, area, and set status to false, task.renewed = true',
  })
  @Post('/:id/dismantle/:task_id')
  async dismantle(
    @Param('id') id: string,
    @Param('task_id') task_id: string,
  ) {
    return this.deviceService.dismantle(id, task_id);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'define key position',
    description:
      'Get key position of area, return true / false',
  })
  @Post('/:areaId/:positionX/:positionY')
  async checkKeyPosition
  (@Param('areaId') areaId: string,
  @Param('positionX') positionX: string,
  @Param('positionY') positionY: string,
) {
    return this.deviceService.checkKeyPosition(areaId, positionX, positionY);
  }
}
