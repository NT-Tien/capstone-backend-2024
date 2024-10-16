import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Post,
  Put,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
// import { CacheTTL } from '@nestjs/cache-manager';
import { RequestService } from './request.service';
import { RequestResponseDto } from './dto/response.dto';
import { RequestRequestDto } from './dto/request.dto';
import { HeadGuard } from 'src/modules/auth/guards/head.guard';
import { UUID } from 'crypto';

@ApiTags('head: request')
@UseGuards(HeadGuard)
@Controller('head/request')
export class RequestController {
  constructor(private readonly requestService: RequestService) {}

  @ApiBearerAuth()
  @ApiResponse({
    type: RequestResponseDto.RequestGetAll,
    status: 200,
    description: 'Get all Requests',
  })
  @Get()
  async getAll(@Headers('user') user: any) {
    return await this.requestService.customHeadGetAllRequest(user?.id);
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

  // @ApiResponse({
  //   type: RequestResponseDto.RequestGetOne,
  //   status: 200,
  //   description: 'Get one Request',
  // })
  // @ApiBearerAuth()
  // @Get(':id')
  // async getOneFor(@Param('id') id: string) {
  //   return await this.requestService.getOne(id);
  // }

  @ApiBearerAuth()
  @ApiResponse({
    type: RequestResponseDto.RequestCreate,
    status: 201,
    description: 'Create a Request',
  })
  @Post()
  async create(
    @Headers('user') user: any,
    @Body() body: RequestRequestDto.RequestCreateDto,
  ) {
    return await this.requestService.customHeadCreateRequest(
      user.id,
      RequestRequestDto.RequestCreateDto.plainToClass(body),
    );
  }

  @ApiBearerAuth()
  @Put('/:id/cancel')
  async cancelRequest(@Param('id') id: UUID, @Headers('user') user: any) {
    return this.requestService.cancelRequest(id, user.id);
  }

  @ApiBearerAuth()
  @Put('/:id/close')
  async confirmRequest(
    @Param('id') id: UUID,
    @Body() body: RequestRequestDto.RequestConfirmDto,
    @Headers('user') user: any,
  ) {
    return this.requestService.confirmRequest(id, body, user.id);
  }

  // @ApiBearerAuth()
  // @ApiResponse({
  //   type: RequestResponseDto.RequestUpdate,
  //   status: 200,
  //   description: 'Update a Request',
  // })
  // @Put(':id')
  // async update(
  //   @Param('id') id: string,
  //   @Body() body: RequestRequestDto.RequestUpdateDto,
  // ) {
  //   return await this.requestService.update(
  //     id,
  //     RequestRequestDto.RequestUpdateDto.plainToClass(body),
  //   );
  // }

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
