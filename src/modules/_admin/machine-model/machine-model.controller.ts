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
import { MachineModelService } from './machine-model.service';
import { MachineModelResponseDto } from './dto/response.dto';
import { MachineModelRequestDto } from './dto/request.dto';
import { AdminGuard } from 'src/modules/auth/guards/admin.guard';
// import { CacheTTL } from '@nestjs/cache-manager';

@ApiTags('admin: machine-model')
// @UseGuards(AdminGuard)
@Controller('admin/machine-model')
export class MachineModelController {
  constructor(private readonly machineModelService: MachineModelService) {}

  @ApiBearerAuth()
  @ApiResponse({
    type: MachineModelResponseDto.MachineModelGetAll,
    status: 200,
    description: 'Get all MachineModels',
  })
  @Get()
  async getAll() {
    return await this.machineModelService.getAll();
  }

  // @ApiResponse({
  //   type: MachineModelResponseDto.MachineModelGetAll,
  //   status: 200,
  //   description: 'Get all categories',
  // })
  // @CacheTTL(10)
  // @Get('get-all-cache')
  // async getAllForUser() {
  //   return await this.machineModelService.getAll();
  // }

  @ApiBearerAuth()
  @Get('include-deleted')
  async getAllWithDeleted() {
    return await this.machineModelService.getAllWithDeleted();
  }

  @ApiResponse({
    type: MachineModelResponseDto.MachineModelGetOne,
    status: 200,
    description: 'Get one MachineModel',
  })
  @ApiBearerAuth()
  @Get(':id')
  async getOneFor(@Param('id') id: string) {
    return await this.machineModelService.getOne(id);
  }

  @ApiBearerAuth()
  @ApiResponse({
    type: MachineModelResponseDto.MachineModelCreate,
    status: 201,
    description: 'Create a MachineModel',
  })
  @Post()
  async create(@Body() body: MachineModelRequestDto.MachineModelCreateDto) {
    return await this.machineModelService.create(
      MachineModelRequestDto.MachineModelCreateDto.plainToClass(body),
    );
  }

  @ApiBearerAuth()
  @ApiResponse({
    type: MachineModelResponseDto.MachineModelUpdate,
    status: 200,
    description: 'Update a MachineModel',
  })
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() body: MachineModelRequestDto.MachineModelUpdateDto,
  ) {
    return await this.machineModelService.update(
      id,
      MachineModelRequestDto.MachineModelUpdateDto.plainToClass(body),
    );
  }

  @ApiBearerAuth()
  @ApiResponse({
    type: MachineModelResponseDto.MachineModelDelete,
    status: 200,
    description: 'Hard delete a MachineModel',
  })
  @Delete(':id')
  async deleteHard(@Param('id') id: string) {
    return await this.machineModelService.delete(id);
  }

  @ApiBearerAuth()
  @ApiResponse({
    type: MachineModelResponseDto.MachineModelDelete,
    status: 200,
    description: 'Soft delete a MachineModel',
  })
  @Delete('soft-delete/:id')
  async delete(@Param('id') id: string) {
    return await this.machineModelService.softDelete(id);
  }

  @ApiBearerAuth()
  @ApiResponse({
    type: MachineModelResponseDto.MachineModelRestore,
    status: 200,
    description: 'Restore a MachineModel',
  })
  @Put('restore/:id')
  async restore(@Param('id') id: string) {
    return await this.machineModelService.restore(id);
  }
}
