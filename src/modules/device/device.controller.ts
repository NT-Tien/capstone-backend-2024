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
import { DeviceResponseDto } from './dto/response.dto';
import { AdminGuard } from '../auth/guards/admin.guard';
import { DeviceService } from './device.service';
import { DeviceRequestDto } from './dto/request.dto';
// import { CacheTTL } from '@nestjs/cache-manager';

@ApiTags('device')
@Controller('device')
export class DeviceController {
  constructor(private readonly deviceService: DeviceService) {}

  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @ApiResponse({
    type: DeviceResponseDto.DeviceGetAll,
    status: 200,
    description: 'Get all Devices',
  })
  @Get()
  async getAll() {
    return await this.deviceService.getAll();
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

  @UseGuards(AdminGuard)
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
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @Get(':id')
  async getOneFor(@Param('id') id: string) {
    return await this.deviceService.getOne(id);
  }

  @UseGuards(AdminGuard)
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

  @UseGuards(AdminGuard)
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

  @UseGuards(AdminGuard)
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

  @UseGuards(AdminGuard)
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

  @UseGuards(AdminGuard)
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
