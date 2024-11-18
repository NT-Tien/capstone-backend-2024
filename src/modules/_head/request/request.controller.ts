import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Post,
  Put,
  UseGuards
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
// import { CacheTTL } from '@nestjs/cache-manager';
import { UUID } from 'crypto';
import { HeadGuard } from 'src/modules/auth/guards/head.guard';
import { RequestRequestDto } from './dto/request.dto';
import { RequestResponseDto } from './dto/response.dto';
import { RequestService } from './request.service';

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
  async addFeedback(
    @Param('id') id: UUID,
    @Body() body: RequestRequestDto.RequestAddFeedbackDto,
    @Headers('user') user: any,
  ) {
    return this.requestService.addFeedback(id, body, user.id);
  }
}
