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
import { RequestService } from './request.service';
import { RequestResponseDto } from './dto/response.dto';
import { RequestRequestDto } from './dto/request.dto';
import { AdminGuard } from 'src/modules/auth/guards/admin.guard';

@ApiTags('admin: request')
@UseGuards(AdminGuard)
@Controller('admin/request')
export class RequestController {
  constructor(private readonly requestService: RequestService) {}

  @ApiBearerAuth()
  @ApiResponse({
    type: RequestResponseDto.RequestGetAll,
    status: 200,
    description: 'Get all Requests',
  })
  @Get()
  async getAll() {
    return await this.requestService.getAll();
  }

  // @ApiResponse({
  //   type: RequestResponseDto.RequestGetAll,
  //   status: 200,
  //   description: 'Get all categories',
  // })
  // @CacheTTL(10)
  // @Get('get-all-cache')
  // async getAllForUser() {
  //   return await this.requestService.getAll();
  // }

  @ApiBearerAuth()
  @Get('include-deleted')
  async getAllWithDeleted() {
    return await this.requestService.getAllWithDeleted();
  }

  @ApiResponse({
    type: RequestResponseDto.RequestGetOne,
    status: 200,
    description: 'Get one Request',
  })
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @Get(':id')
  async getOneFor(@Param('id') id: string) {
    return await this.requestService.getOne(id);
  }

  @ApiBearerAuth()
  @ApiResponse({
    type: RequestResponseDto.RequestCreate,
    status: 201,
    description: 'Create a Request',
  })
  @Post()
  async create(@Body() body: RequestRequestDto.RequestCreateDto) {
    return await this.requestService.customHeadCreateRequest(
      RequestRequestDto.RequestCreateDto.plainToClass(body),
    );
  }

  @ApiBearerAuth()
  @ApiResponse({
    type: RequestResponseDto.RequestUpdate,
    status: 200,
    description: 'Update a Request',
  })
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() body: RequestRequestDto.RequestUpdateDto,
  ) {
    return await this.requestService.update(
      id,
      RequestRequestDto.RequestUpdateDto.plainToClass(body),
    );
  }

  @ApiBearerAuth()
  @ApiResponse({
    type: RequestResponseDto.RequestDelete,
    status: 200,
    description: 'Hard delete a Request',
  })
  @Delete(':id')
  async deleteHard(@Param('id') id: string) {
    return await this.requestService.delete(id);
  }

  @ApiBearerAuth()
  @ApiResponse({
    type: RequestResponseDto.RequestDelete,
    status: 200,
    description: 'Soft delete a Request',
  })
  @Delete('soft-delete/:id')
  async delete(@Param('id') id: string) {
    return await this.requestService.softDelete(id);
  }

  @ApiBearerAuth()
  @ApiResponse({
    type: RequestResponseDto.RequestRestore,
    status: 200,
    description: 'Restore a Request',
  })
  @Put('restore/:id')
  async restore(@Param('id') id: string) {
    return await this.requestService.restore(id);
  }
}
