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
import { TypeErrorHeadService } from './type-error-head.service';
import { TypeErrorRequestDto } from './dto/request.dto';
import { TypeErrorResponseDto } from './dto/response.dto';
import { AdminGuard } from 'src/modules/auth/guards/admin.guard';

@ApiTags('admin: type-error-head')
@UseGuards(AdminGuard)
@Controller('admin/type-error-head')
export class TypeErrorHeadController {
  constructor(private readonly typeErrorHeadService: TypeErrorHeadService) {}

  @ApiBearerAuth()
  @ApiResponse({
    type: TypeErrorResponseDto.TypeErrorGetAll,
    status: 200,
    description: 'Get all TypeErrors',
  })
  @Get()
  async getAll() {
    return await this.typeErrorHeadService.getAll();
  }

  // @ApiResponse({
  //   type: TypeErrorResponseDto.TypeErrorGetAll,
  //   status: 200,
  //   description: 'Get all categories',
  // })
  // @CacheTTL(10)
  // @Get('get-all-cache')
  // async getAllForUser() {
  //   return await this.typeErrorHeadService.getAll();
  // }

  @ApiBearerAuth()
  @Get('include-deleted')
  async getAllWithDeleted() {
    return await this.typeErrorHeadService.getAllWithDeleted();
  }

  @ApiResponse({
    type: TypeErrorResponseDto.TypeErrorGetOne,
    status: 200,
    description: 'Get one TypeError',
  })
  @ApiBearerAuth()
  @Get(':id')
  async getOneFor(@Param('id') id: string) {
    return await this.typeErrorHeadService.getOne(id);
  }

  @ApiBearerAuth()
  @ApiResponse({
    type: TypeErrorResponseDto.TypeErrorCreate,
    status: 201,
    description: 'Create a TypeError',
  })
  @Post()
  async create(@Body() body: TypeErrorRequestDto.TypeErrorCreateDto) {
    return await this.typeErrorHeadService.create(
      TypeErrorRequestDto.TypeErrorCreateDto.plainToClass(body),
    );
  }

  @ApiBearerAuth()
  @ApiResponse({
    type: TypeErrorResponseDto.TypeErrorUpdate,
    status: 200,
    description: 'Update a TypeError',
  })
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() body: TypeErrorRequestDto.TypeErrorUpdateDto,
  ) {
    return await this.typeErrorHeadService.update(
      id,
      TypeErrorRequestDto.TypeErrorUpdateDto.plainToClass(body),
    );
  }

  @ApiBearerAuth()
  @ApiResponse({
    type: TypeErrorResponseDto.TypeErrorDelete,
    status: 200,
    description: 'Hard delete a TypeError',
  })
  @Delete(':id')
  async deleteHard(@Param('id') id: string) {
    return await this.typeErrorHeadService.delete(id);
  }

  @ApiBearerAuth()
  @ApiResponse({
    type: TypeErrorResponseDto.TypeErrorDelete,
    status: 200,
    description: 'Soft delete a TypeError',
  })
  @Delete('soft-delete/:id')
  async delete(@Param('id') id: string) {
    return await this.typeErrorHeadService.softDelete(id);
  }

  @ApiBearerAuth()
  @ApiResponse({
    type: TypeErrorResponseDto.TypeErrorRestore,
    status: 200,
    description: 'Restore a TypeError',
  })
  @Put('restore/:id')
  async restore(@Param('id') id: string) {
    return await this.typeErrorHeadService.restore(id);
  }
}
