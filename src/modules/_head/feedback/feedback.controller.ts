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
import { HeadGuard } from 'src/modules/auth/guards/head.guard';
import { FeedbackService } from './feedback.service';
import { FeedbackResponseDto } from './dto/response.dto';
import { FeedbackRequestDto } from './dto/request.dto';

@ApiTags('head: Feedback')
@UseGuards(HeadGuard)
@Controller('head/feedback')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @ApiBearerAuth()
  @ApiResponse({
    type: FeedbackResponseDto.FeedbackCreate,
    status: 201,
    description: 'Create a Feedback',
  })
  @Post()
  async create(@Body() body: FeedbackRequestDto.FeedbackCreateDto) {
    return await this.feedbackService.create(
      FeedbackRequestDto.FeedbackCreateDto.plainToClass(body),
    );
  }

  @ApiBearerAuth()
  @ApiResponse({
    type: FeedbackResponseDto.FeedbackUpdate,
    status: 200,
    description: 'Update a Feedback',
  })
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() body: FeedbackRequestDto.FeedbackUpdateDto,
  ) {
    return await this.feedbackService.update(
      id,
      FeedbackRequestDto.FeedbackUpdateDto.plainToClass(body),
    );
  }

  @ApiBearerAuth()
  @ApiResponse({
    type: FeedbackResponseDto.FeedbackDelete,
    status: 200,
    description: 'Hard delete a Feedback',
  })
  @Delete(':id')
  async deleteHard(@Param('id') id: string) {
    return await this.feedbackService.delete(id);
  }
}
