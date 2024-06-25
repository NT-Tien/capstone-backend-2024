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
import { SparePartService } from './spare-part.service';
import { SparePartResponseDto } from './dto/response.dto';

import { StaffGuard } from 'src/modules/auth/guards/staff.guard';
import { log } from 'console';
import { UUID } from 'crypto';

@ApiTags('staff: spare-part')
@Controller('staff/spare-part')
export class SparePartController {
  constructor(private readonly sparePartService: SparePartService) {}

  @UseGuards(StaffGuard)
  @ApiBearerAuth()
  @ApiResponse({
    type: SparePartResponseDto.SparePartGetAll,
    status: 200,
  })
  @Post('receipt')
  async receipt(@Body('listId') listId: string[]) {
    console.log(listId); // Đảm bảo in ra để kiểm tra listId
    log(listId);
    return await this.sparePartService.checkReceipt(listId);
  }


  //@UseGuards(StaffGuard)
  @ApiBearerAuth()
  @ApiResponse({
    type: SparePartResponseDto.SparePartUpdate,
    status: 200,
  })
  @Post('return')
  async returnSpareParts(@Body('listId') listId: UUID[]) {
    console.log(listId); // Log để kiểm tra dữ liệu nhận được
    return await this.sparePartService.checkReturn(listId);
  }
}

