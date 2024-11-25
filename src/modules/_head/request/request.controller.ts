import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags
} from '@nestjs/swagger';
// import { CacheTTL } from '@nestjs/cache-manager';
import { UUID } from 'crypto';
import { HeadGuard } from 'src/modules/auth/guards/head.guard';
import { RequestRequestDto } from './dto/request.dto';
import { RequestService } from './request.service';

@ApiTags('head: request')
@UseGuards(HeadGuard)
@Controller('head/request')
export class RequestController {
  constructor(private readonly requestService: RequestService) {}

  @ApiOperation({
    summary: 'Get all requests by user',
    description: 'Returns all requests that user has created',
  })
  @ApiBearerAuth()
  @Get()
  async getAll(@Headers('user') user: any) {
    return await this.requestService.customHeadGetAllRequest(user?.id);
  }

<<<<<<< HEAD
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
  @Get(':id')
  async getOneFor(@Param('id') id: string) {
    return await this.requestService.getOne(id);
  }

  @ApiBearerAuth()
  @ApiResponse({
    type: RequestResponseDto.RequestCreate,
    status: 201,
    description: 'Create a Request',
=======
  @ApiOperation({
    summary: "Get a request by ID",
    description: "Returns a request by a given ID and a user"
>>>>>>> refs/remotes/origin/main
  })
  @ApiBearerAuth()
  @Get('/:id')
  async getOne(@Param('id') id: UUID, @Headers('user') user: any) {
    return await this.requestService.one(id, user.id);
  }

  @ApiOperation({
    summary: "Create a request",
    description: 'Create a request with the given information. Notifies HEAD_MAINTENANCE',
  })
  @ApiBearerAuth()
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

  @ApiOperation({
    summary: "Cancels a request",
    description: "Cancels a request by a given ID. Request must be PENDING and NOT SEEN"
  })
  @ApiBearerAuth()
  @Put('/:id/cancel')
  async cancelRequest(@Param('id') id: UUID, @Headers('user') user: any) {
    return this.requestService.cancelRequest(id, user.id);
  }

  @ApiOperation({
    summary: "Close a request by giving feedback",
    description: "Close a request by giving feedback. Request must be HEAD_CONFIRM"
  })
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
