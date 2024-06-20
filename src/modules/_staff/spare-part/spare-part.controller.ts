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
  @Post("receipt")
  async receipt (@Param('listId') listId: string[]) {
    return await this.sparePartService.checkReceipt(listId);
  }


  @UseGuards(StaffGuard)
  @ApiBearerAuth()
  @ApiResponse({
    type: SparePartResponseDto.SparePartGetAll,
    status: 200,
  })
  @Post("return")
  async return(@Param('listId') listId: string[]) {
    return await this.sparePartService.checkReturn(listId);
  }


}