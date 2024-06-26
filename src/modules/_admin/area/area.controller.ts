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
import { AreaResponseDto } from './dto/response.dto';
// import { CacheTTL } from '@nestjs/cache-manager';
import { AreaService } from './area.service';
import { AreaRequestDto } from './dto/request.dto';
import { AdminGuard } from 'src/modules/auth/guards/admin.guard';

@ApiTags('admin: area')
@UseGuards(AdminGuard)
@Controller('admin/area')
export class AreaController {
  constructor(private readonly areaService: AreaService) {}

  @ApiBearerAuth()
  @ApiResponse({
    type: AreaResponseDto.AreaGetAll,
    status: 200,
    description: 'Get all Areas',
  })
  @Get()
  async getAll() {
    return await this.areaService.getAll();
  }

  // @ApiResponse({
  //   type: AreaResponseDto.AreaGetAll,
  //   status: 200,
  //   description: 'Get all categories',
  // })
  // @CacheTTL(10)
  // @Get('get-all-cache')
  // async getAllForUser() {
  //   return await this.areaService.getAll();
  // }

  @ApiBearerAuth()
  @Get('include-deleted')
  async getAllWithDeleted() {
    return await this.areaService.getAllWithDeleted();
  }

  @ApiResponse({
    type: AreaResponseDto.AreaGetOne,
    status: 200,
    description: 'Get one Area',
  })
  @ApiBearerAuth()
  @Get(':id')
  async getOneFor(@Param('id') id: string) {
    return await this.areaService.getOneAreaById(id);
  }

  @ApiBearerAuth()
  @ApiResponse({
    type: AreaResponseDto.AreaCreate,
    status: 201,
    description: 'Create a Area',
  })
  @Post()
  async create(@Body() body: AreaRequestDto.AreaCreateDto) {
    return await this.areaService.create(
      AreaRequestDto.AreaCreateDto.plainToClass(body),
    );
  }

  @ApiBearerAuth()
  @ApiResponse({
    type: AreaResponseDto.AreaUpdate,
    status: 200,
    description: 'Update a Area',
  })
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() body: AreaRequestDto.AreaUpdateDto,
  ) {
    return await this.areaService.update(
      id,
      AreaRequestDto.AreaUpdateDto.plainToClass(body),
    );
  }

  @ApiBearerAuth()
  @ApiResponse({
    type: AreaResponseDto.AreaDelete,
    status: 200,
    description: 'Hard delete a Area',
  })
  @Delete(':id')
  async deleteHard(@Param('id') id: string) {
    return await this.areaService.delete(id);
  }

  @ApiBearerAuth()
  @ApiResponse({
    type: AreaResponseDto.AreaDelete,
    status: 200,
    description: 'Soft delete a Area',
  })
  @Delete('soft-delete/:id')
  async delete(@Param('id') id: string) {
    return await this.areaService.softDelete(id);
  }

  @ApiBearerAuth()
  @ApiResponse({
    type: AreaResponseDto.AreaRestore,
    status: 200,
    description: 'Restore a Area',
  })
  @Put('restore/:id')
  async restore(@Param('id') id: string) {
    return await this.areaService.restore(id);
  }
}
