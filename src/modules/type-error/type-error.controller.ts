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
import { AdminGuard } from '../auth/guards/admin.guard';
// import { CacheTTL } from '@nestjs/cache-manager';
import { TypeErrorService } from './type-error.service';
import { TypeErrorRequestDto } from './dto/request.dto';
import { TypeErrorResponseDto } from './dto/response.dto';

@ApiTags('type-error')
@Controller('type-error')
export class TypeErrorController {
  constructor(private readonly typeErrorService: TypeErrorService) {}

  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @ApiResponse({
    type: TypeErrorResponseDto.TypeErrorGetAll,
    status: 200,
    description: 'Get all TypeErrors',
  })
  @Get()
  async getAll() {
    return await this.typeErrorService.getAll();
  }

  // @ApiResponse({
  //   type: TypeErrorResponseDto.TypeErrorGetAll,
  //   status: 200,
  //   description: 'Get all categories',
  // })
  // @CacheTTL(10)
  // @Get('get-all-cache')
  // async getAllForUser() {
  //   return await this.typeErrorService.getAll();
  // }

  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @Get('include-deleted')
  async getAllWithDeleted() {
    return await this.typeErrorService.getAllWithDeleted();
  }

  @ApiResponse({
    type: TypeErrorResponseDto.TypeErrorGetOne,
    status: 200,
    description: 'Get one TypeError',
  })
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @Get(':id')
  async getOneFor(@Param('id') id: string) {
    return await this.typeErrorService.getOne(id);
  }

  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @ApiResponse({
    type: TypeErrorResponseDto.TypeErrorCreate,
    status: 201,
    description: 'Create a TypeError',
  })
  @Post()
  async create(@Body() body: TypeErrorRequestDto.TypeErrorCreateDto) {
    return await this.typeErrorService.create(
      TypeErrorRequestDto.TypeErrorCreateDto.plainToClass(body),
    );
  }

  @UseGuards(AdminGuard)
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
    return await this.typeErrorService.update(
      id,
      TypeErrorRequestDto.TypeErrorUpdateDto.plainToClass(body),
    );
  }

  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @ApiResponse({
    type: TypeErrorResponseDto.TypeErrorDelete,
    status: 200,
    description: 'Hard delete a TypeError',
  })
  @Delete(':id')
  async deleteHard(@Param('id') id: string) {
    return await this.typeErrorService.delete(id);
  }

  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @ApiResponse({
    type: TypeErrorResponseDto.TypeErrorDelete,
    status: 200,
    description: 'Soft delete a TypeError',
  })
  @Delete('soft-delete/:id')
  async delete(@Param('id') id: string) {
    return await this.typeErrorService.softDelete(id);
  }

  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @ApiResponse({
    type: TypeErrorResponseDto.TypeErrorRestore,
    status: 200,
    description: 'Restore a TypeError',
  })
  @Put('restore/:id')
  async restore(@Param('id') id: string) {
    return await this.typeErrorService.restore(id);
  }
}
