import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
// import { CacheTTL } from '@nestjs/cache-manager';
import { StockkeeperGuard } from 'src/modules/auth/guards/stockkeeper.guard';
import { SparePartRequestDto } from './dto/request.dto';
import { SparePartResponseDto } from './dto/response.dto';
import { SparePartService } from './spare-part.service';

@ApiTags('stockkeeper: spare-part')
@UseGuards(StockkeeperGuard)
@Controller('stockkeeper/spare-part')
export class SparePartController {
  constructor(private readonly sparePartService: SparePartService) {}

  @ApiBearerAuth()
  @Post('/import')
  async importSpareParts(@Body() dto: SparePartRequestDto.ImportSparePartDto) {
    return await this.sparePartService.incrementQuantitySpareParts(dto);
  }

  @ApiBearerAuth()
  @Get(':page/:limit')
  async getAll(
    @Param('page') page: number,
    @Param('limit') limit: number,
    @Query() filterDto?: SparePartRequestDto.AllSparePartsFilterDto,
    @Query() orderDto?: SparePartRequestDto.AllSparePartsOrderDto,
  ) {
    return await this.sparePartService.customGetAllSparePart(
      page,
      limit,
      filterDto,
      orderDto,
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
    return await this.sparePartService.customUpdate(
      id,
      SparePartRequestDto.SparePartUpdateDto.plainToClass(body),
    );
  }

  @ApiBearerAuth()
  @Get("/today")
  async getToday() {
    return await this.sparePartService.getToday();
  }
}
