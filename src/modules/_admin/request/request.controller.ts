import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
// import { CacheTTL } from '@nestjs/cache-manager';
import { RequestService } from './request.service';
import { RequestResponseDto } from './dto/response.dto';
import { RequestRequestDto } from './dto/request.dto';
import { RequestStatus } from 'src/entities/request.entity';
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
    description: 'Get all Requests for renew case',
  })
  @Get(':page/:limit/:status')
  async getAll(
    @Headers('user') user: any,
    @Param('page') page: number,
    @Param('limit') limit: number,
    @Param('status') status: RequestStatus,
    @Query('time') time: number = 1,
    @Query('all') all: boolean = false,
  ) {
    console.log(all, typeof all);
    if (all) {
      const result = await this.requestService.test_all();
      console.log(JSON.stringify(result, null, 2));
      return result;
    } else {
      return await this.requestService.customHeadStaffGetAllRequest(
        user?.id,
        page,
        limit,
        status,
        time,
      );
    }
  }

  @ApiOperation({ summary: 'Get all requests with filter and sort' })
  @ApiBearerAuth()
  @Get('/all/:page/:limit')
  async getAllRequests(
    @Param('page', ParseIntPipe) page: number,
    @Param('limit', ParseIntPipe) limit: number,
    @Query() filterDto: RequestRequestDto.RequestAllFilteredDto,
    @Query() orderDto: RequestRequestDto.RequestAllOrderedDto,
  ) {
    return this.requestService.all_filtered_sorted(
      page,
      limit,
      filterDto,
      orderDto,
    );
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

  // @ApiBearerAuth()
  // @Get('include-deleted')
  // async getAllWithDeleted() {
  //   return await this.requestService.getAllWithDeleted();
  // }

  @ApiResponse({
    type: RequestResponseDto.RequestGetOne,
    status: 200,
    description: 'Get one Request',
  })
  @ApiBearerAuth()
  @Get('one/:id')
  async getOne(@Headers('user') user: any, @Param('id') id: string) {
    console.log("admin_request_one",user?.id, id);

    const response = await this.requestService.customHeadStaffGetOneRequest(user?.id, id);
    console.log(JSON.stringify(response, null, 2))
    return response
  }

  // @ApiBearerAuth()
  // @ApiResponse({
  //   type: RequestResponseDto.RequestCreate,
  //   status: 201,
  //   description: 'Create a Request',
  // })
  // @Post()
  // async create(
  //   @Headers('user') user: any,
  //   @Body() body: RequestRequestDto.RequestCreateDto
  // ) {
  //   return await this.requestService.customHeadCreateRequest(
  //     user.id,
  //     RequestRequestDto.RequestCreateDto.plainToClass(body),
  //   );
  // }

  @ApiBearerAuth()
  @Put('admin-comfirm-renew/:id')
  async update(
    @Headers('user') user: any,
    @Param('id') id: string,
    @Body() data: RequestRequestDto.AdminConfirmRenewUpdateDto,
  ) {
    // create task for request before update status
    return await this.requestService.updateStatus(user.id, id, data);
  }

  // @ApiBearerAuth()
  // @ApiResponse({
  //   type: RequestResponseDto.RequestDelete,
  //   status: 200,
  //   description: 'Hard delete a Request',
  // })
  // @Delete(':id')
  // async deleteHard(@Param('id') id: string) {
  //   return await this.requestService.delete(id);
  // }

  // @ApiBearerAuth()
  // @ApiResponse({
  //   type: RequestResponseDto.RequestDelete,
  //   status: 200,
  //   description: 'Soft delete a Request',
  // })
  // @Delete('soft-delete/:id')
  // async delete(@Param('id') id: string) {
  //   return await this.requestService.softDelete(id);
  // }

  // @ApiBearerAuth()
  // @ApiResponse({
  //   type: RequestResponseDto.RequestRestore,
  //   status: 200,
  //   description: 'Restore a Request',
  // })
  // @Put('restore/:id')
  // async restore(@Param('id') id: string) {
  //   return await this.requestService.restore(id);
  // }
}
