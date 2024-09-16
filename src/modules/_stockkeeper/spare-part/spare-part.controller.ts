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
import { SparePartService } from './spare-part.service';
import { SparePartResponseDto } from './dto/response.dto';
import { SparePartRequestDto } from './dto/request.dto';
import { StockkeeperGuard } from 'src/modules/auth/guards/stockkeeper.guard';

@ApiTags('stockkeeper: spare-part')
@UseGuards(StockkeeperGuard)
@Controller('stockkeeper/spare-part')
export class SparePartController {
  constructor(private readonly sparePartService: SparePartService) { }


  @ApiBearerAuth()
  @Get(':page/:limit')
  async getAll(
    @Param('page') page: number,
    @Param('limit') limit: number,
  ) {
    return await this.sparePartService.customGetAllSparePart(
      page,
      limit,
    );
  }

  @ApiBearerAuth()
  @Get('need-add-more')
  async getAllSparePareNeedAddMore() {
    return await this.sparePartService.getAllSparePartNeedAddMore();
  }


  @ApiResponse({
    type: SparePartResponseDto.SparePartGetOne,
    status: 200,
    description: 'Get one SparePart',
  })
  @ApiBearerAuth()
  @Get(':id')
  async getOneFor(@Param('id') id: string) {
    return await this.sparePartService.getOne(id);
  }

  @ApiBearerAuth()
  @ApiResponse({
    type: SparePartResponseDto.SparePartUpdate,
    status: 200,
    description: 'Update a SparePart',
  })
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() body: SparePartRequestDto.SparePartUpdateDto,
  ) {
    return await this.sparePartService.update(
      id,
      SparePartRequestDto.SparePartUpdateDto.plainToClass(body),
    );
  }
}
