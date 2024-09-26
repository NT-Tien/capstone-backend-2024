import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
// import { CacheTTL } from '@nestjs/cache-manager';
import { AdminGuard } from 'src/modules/auth/guards/admin.guard';
import { RequestAddDeviceRequestDto } from './dto/request.dto';
import { RequestAddDeviceService } from './request-add-device.service';

@ApiTags('admin: request-add-device')
@UseGuards(AdminGuard)
@Controller('admin/request-add-device')
export class RequestAddDeviceController {
  constructor(private readonly requestAddDeviceService: RequestAddDeviceService) { }

  @ApiBearerAuth()
  @Get()
  async getAll() {
    return await this.requestAddDeviceService.getAll();
  }

  // @ApiResponse({
  //   type: RequestAddDeviceResponseDto.RequestAddDeviceGetAll,
  //   status: 200,
  //   description: 'Get all categories',
  // })
  // @CacheTTL(10)
  // @Get('get-all-cache')
  // async getAllForUser() {
  //   return await this.RequestAddDeviceService.getAll();
  // }

  @ApiBearerAuth()
  @Get('include-deleted')
  async getAllWithDeleted() {
    return await this.requestAddDeviceService.getAllWithDeleted();
  }


  @ApiBearerAuth()
  @Get(':id')
  async getOneFor(@Param('id') id: string) {
    return await this.requestAddDeviceService.getOne(id);
  }

  @ApiBearerAuth()
  @Post()
  async create(
    @Body() body: RequestAddDeviceRequestDto.RequestAddDeviceCreateDto,
    @Headers('user') user: any,
  ) {
    return await this.requestAddDeviceService.create(
      RequestAddDeviceRequestDto.RequestAddDeviceCreateDto.plainToClass({ ...body, created_by: user.id }),
    );
  }

  @ApiBearerAuth()
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() body: RequestAddDeviceRequestDto.RequestAddDeviceUpdateDto,
  ) {
    return await this.requestAddDeviceService.update(
      id,
      RequestAddDeviceRequestDto.RequestAddDeviceUpdateDto.plainToClass(body),
    );
  }

  @ApiBearerAuth()
  @Delete(':id')
  async deleteHard(@Param('id') id: string) {
    return await this.requestAddDeviceService.delete(id);
  }

  @ApiBearerAuth()
  @Delete('soft-delete/:id')
  async delete(@Param('id') id: string) {
    return await this.requestAddDeviceService.softDelete(id);
  }

  @ApiBearerAuth()
  @Put('restore/:id')
  async restore(@Param('id') id: string) {
    return await this.requestAddDeviceService.restore(id);
  }
}
