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
import { AdminGuard } from 'src/modules/auth/guards/admin.guard';
import { StaffRequestChangeSparePartSerivce } from './staff-request-change-spare-part.service';
import { StaffRequestChangeSparePartRequestDto } from './dto/request.dto';
import { BaseDTO } from 'src/common/base/dto.base';
import { StaffRequestChangeSparePartStatus } from 'src/entities/staff_request_change_spare_part.entity';
import { StaffGuard } from 'src/modules/auth/guards/staff.guard';

@ApiTags('staff: staff-request-change-spare-part')
@UseGuards(StaffGuard)
@Controller('staff/staff-request-change-spare-part')
export class StaffRequestChangeSparePartController {
  constructor(private readonly staffReqeuestChangeSparePartSerivce: StaffRequestChangeSparePartSerivce) { }

  @ApiBearerAuth()
  @Get()
  async getAll() {
    return await this.staffReqeuestChangeSparePartSerivce.getAll();
  }

  @ApiBearerAuth()
  @Get(':page/:limit/:status')
  getAllTaskForReturn(
    @Param('page') page: number,
    @Param('limit') limit: number,
    @Param('status') status: StaffRequestChangeSparePartStatus,
  ) {
    return this.staffReqeuestChangeSparePartSerivce.customGetAllTaskReturn(page, limit, status);
  }

  // @ApiResponse({
  //   type: AreaResponseDto.AreaGetAll,
  //   status: 200,
  //   description: 'Get all categories',
  // })
  // @CacheTTL(10)
  // @Get('get-all-cache')
  // async getAllForUser() {
  //   return await this.staffReqeuestChangeSparePartSerivce.getAll();
  // }

  @ApiBearerAuth()
  @Get('include-deleted')
  async getAllWithDeleted() {
    return await this.staffReqeuestChangeSparePartSerivce.getAllWithDeleted();
  }


  @ApiBearerAuth()
  @Get(':id')
  async getOneFor(@Param('id') id: string) {
    return await this.staffReqeuestChangeSparePartSerivce.getOne(id);
  }

  @ApiBearerAuth()

  @Post()
  async create(@Body() body: StaffRequestChangeSparePartRequestDto.StaffRequestChangeSparePartCreateDto) {
    return await this.staffReqeuestChangeSparePartSerivce.create(
      StaffRequestChangeSparePartRequestDto.StaffRequestChangeSparePartCreateDto.plainToClass(body),
    );
  }

  @ApiBearerAuth()
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() body: StaffRequestChangeSparePartRequestDto.StaffRequestChangeSparePartUpdateDto,
  ) {
    return await this.staffReqeuestChangeSparePartSerivce.update(
      id,
      BaseDTO.plainToClass(body),
    );
  }

  @ApiBearerAuth()
  @Delete(':id')
  async deleteHard(@Param('id') id: string) {
    return await this.staffReqeuestChangeSparePartSerivce.delete(id);
  }

}
