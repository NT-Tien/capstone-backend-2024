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
import { PositionService } from './position.service';
import { PositionResponseDto } from './dto/response.dto';
import { PositionRequestDto } from './dto/request.dto';

@ApiTags('position')
@Controller('position')
export class PositionController {
  constructor(private readonly positionService: PositionService) {}

  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @ApiResponse({
    type: PositionResponseDto.PositionGetAll,
    status: 200,
    description: 'Get all Positions',
  })
  @Get()
  async getAll() {
    return await this.positionService.getAllWithRelations();
  }

  // @ApiResponse({
  //   type: PositionResponseDto.PositionGetAll,
  //   status: 200,
  //   description: 'Get all categories',
  // })
  // @CacheTTL(10)
  // @Get('get-all-cache')
  // async getAllForUser() {
  //   return await this.positionService.getAll();
  // }

  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @Get('include-deleted')
  async getAllWithDeleted() {
    return await this.positionService.getAllWithDeleted();
  }

  @ApiResponse({
    type: PositionResponseDto.PositionGetOne,
    status: 200,
    description: 'Get one Position',
  })
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @Get(':id')
  async getOneFor(@Param('id') id: string) {
    return await this.positionService.getOne(id);
  }

  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @ApiResponse({
    type: PositionResponseDto.PositionCreate,
    status: 201,
    description: 'Create a Position',
  })
  @Post()
  async create(@Body() body: PositionRequestDto.PositionCreateDto) {
    return await this.positionService.create(
      PositionRequestDto.PositionCreateDto.plainToClass(body),
    );
  }

  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @ApiResponse({
    type: PositionResponseDto.PositionUpdate,
    status: 200,
    description: 'Update a Position',
  })
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() body: PositionRequestDto.PositionUpdateDto,
  ) {
    return await this.positionService.update(
      id,
      PositionRequestDto.PositionUpdateDto.plainToClass(body),
    );
  }

  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @ApiResponse({
    type: PositionResponseDto.PositionDelete,
    status: 200,
    description: 'Hard delete a Position',
  })
  @Delete(':id')
  async deleteHard(@Param('id') id: string) {
    return await this.positionService.delete(id);
  }

  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @ApiResponse({
    type: PositionResponseDto.PositionDelete,
    status: 200,
    description: 'Soft delete a Position',
  })
  @Delete('soft-delete/:id')
  async delete(@Param('id') id: string) {
    return await this.positionService.softDelete(id);
  }

  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @ApiResponse({
    type: PositionResponseDto.PositionRestore,
    status: 200,
    description: 'Restore a Position',
  })
  @Put('restore/:id')
  async restore(@Param('id') id: string) {
    return await this.positionService.restore(id);
  }
}
