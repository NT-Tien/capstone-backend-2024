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
import { AdminGuard } from 'src/modules/auth/guards/admin.guard';

@ApiTags('admin: spare-part')
@Controller('admin/spare-part')
export class SparePartController {
  constructor(private readonly sparePartService: SparePartService) {}

  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @ApiResponse({
    type: SparePartResponseDto.SparePartGetAll,
    status: 200,
    description: 'Get all SpareParts',
  })
  @Get(':page/:limit/:searchName')
  async getAll(
    @Param('page') page: number,
    @Param('limit') limit: number,
    @Param('searchName') searchName: string,
  ) {
    return await this.sparePartService.customGetAllSparePart(page, limit, searchName);
  }

  // @ApiResponse({
  //   type: SparePartResponseDto.SparePartGetAll,
  //   status: 200,
  //   description: 'Get all categories',
  // })
  // @CacheTTL(10)
  // @Get('get-all-cache')
  // async getAllForUser() {
  //   return await this.sparePartService.getAll();
  // }

  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @Get('include-deleted')
  async getAllWithDeleted() {
    return await this.sparePartService.getAllWithDeleted();
  }

  @ApiResponse({
    type: SparePartResponseDto.SparePartGetOne,
    status: 200,
    description: 'Get one SparePart',
  })
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @Get(':id')
  async getOneFor(@Param('id') id: string) {
    return await this.sparePartService.getOne(id);
  }

  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @ApiResponse({
    type: SparePartResponseDto.SparePartCreate,
    status: 201,
    description: 'Create a SparePart',
  })
  @Post()
  async create(@Body() body: SparePartRequestDto.SparePartCreateDto) {
    return await this.sparePartService.create(
      SparePartRequestDto.SparePartCreateDto.plainToClass(body),
    );
  }

  @UseGuards(AdminGuard)
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

  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @ApiResponse({
    type: SparePartResponseDto.SparePartDelete,
    status: 200,
    description: 'Hard delete a SparePart',
  })
  @Delete(':id')
  async deleteHard(@Param('id') id: string) {
    return await this.sparePartService.delete(id);
  }

  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @ApiResponse({
    type: SparePartResponseDto.SparePartDelete,
    status: 200,
    description: 'Soft delete a SparePart',
  })
  @Delete('soft-delete/:id')
  async delete(@Param('id') id: string) {
    return await this.sparePartService.softDelete(id);
  }

  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @ApiResponse({
    type: SparePartResponseDto.SparePartRestore,
    status: 200,
    description: 'Restore a SparePart',
  })
  @Put('restore/:id')
  async restore(@Param('id') id: string) {
    return await this.sparePartService.restore(id);
  }
}
