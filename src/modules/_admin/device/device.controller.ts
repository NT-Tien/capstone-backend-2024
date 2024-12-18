import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DeviceResponseDto } from './dto/response.dto';
import { DeviceService } from './device.service';
import { DeviceRequestDto } from './dto/request.dto';
import { AdminGuard } from 'src/modules/auth/guards/admin.guard';
// import { CacheTTL } from '@nestjs/cache-manager';

@ApiTags('admin: device')
@UseGuards(AdminGuard)
@Controller('admin/device')
export class DeviceController {
  constructor(private readonly deviceService: DeviceService) {}

  @ApiBearerAuth()
  @ApiResponse({
    type: DeviceResponseDto.DeviceGetAll,
    status: 200,
    description: 'Get all Devices',
  })
  @Get()
  async getAll() {
    return await this.deviceService.getAllWithRelations();
  }

  @ApiBearerAuth()
  @Get("/all/:page/:limit")
  async getAllFilteredAndSorted(
    @Param('page') page: number,
    @Param('limit') limit: number,
    @Query() filter: DeviceRequestDto.DeviceFilterDto,
    @Query() order: DeviceRequestDto.DeviceOrderDto,
  ) {
    return this.deviceService.getAllFilteredAndSorted(page, limit, filter, order);
  }
  

  @ApiBearerAuth()
  @Get('get-all-by-area-id/:areaId')
  getAllTaskInfoByAreaId(
    @Param('areaId') areaID: string,
    @Query('time') time: number = 1
  ) {
    return this.deviceService.getAllInfoDeviceByAreaId(areaID, time);
  }

  // @ApiResponse({
  //   type: DeviceResponseDto.DeviceGetAll,
  //   status: 200,
  //   description: 'Get all categories',
  // })
  // @CacheTTL(10)
  // @Get('get-all-cache')
  // async getAllForUser() {
  //   return await this.deviceService.getAll();
  // }

  @ApiBearerAuth()
  @Get('include-deleted')
  async getAllWithDeleted() {
    return await this.deviceService.getAllWithDeleted();
  }

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

  @ApiBearerAuth()
  @ApiResponse({
    type: DeviceResponseDto.DeviceCreate,
    status: 201,
    description: 'Create a Device',
  })
  @Post()
  async create(@Body() body: DeviceRequestDto.DeviceCreateDto) {
    return await this.deviceService.create(
      DeviceRequestDto.DeviceCreateDto.plainToClass(body),
    );
  }

  @ApiBearerAuth()
  @ApiResponse({
    type: DeviceResponseDto.DeviceUpdate,
    status: 200,
    description: 'Update a Device',
  })
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() body: DeviceRequestDto.DeviceUpdateDto,
  ) {
    return await this.deviceService.update(
      id,
      DeviceRequestDto.DeviceUpdateDto.plainToClass(body),
    );
  }

  @ApiBearerAuth()
  @ApiResponse({
    type: DeviceResponseDto.DeviceDelete,
    status: 200,
    description: 'Hard delete a Device',
  })
  @Delete(':id')
  async deleteHard(@Param('id') id: string) {
    return await this.deviceService.delete(id);
  }

  @ApiBearerAuth()
  @ApiResponse({
    type: DeviceResponseDto.DeviceDelete,
    status: 200,
    description: 'Soft delete a Device',
  })
  @Delete('soft-delete/:id')
  async delete(@Param('id') id: string) {
    return await this.deviceService.softDelete(id);
  }

  @ApiBearerAuth()
  @ApiResponse({
    type: DeviceResponseDto.DeviceRestore,
    status: 200,
    description: 'Restore a Device',
  })
  @Put('restore/:id')
  async restore(@Param('id') id: string) {
    return await this.deviceService.restore(id);
  }
}
