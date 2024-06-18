import {
    Body,
    Controller,
    Delete,
    Get,
    Headers,
    HttpCode,
    HttpStatus,
    Inject,
    Param,
    Post,
    Put,
    Req,
    UseGuards,
  } from '@nestjs/common';
  import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthResponseDto } from '../auth/dto/response.dto';
import { StaffService } from './staff.service';
import { AuthRequestDto } from '../auth/dto/request.dto';

  @ApiTags('staff')
  @Controller('staff')
  export class StaffController {
    constructor(
      @Inject('STAFF_SERVICE_MAIDTS') private readonly staffService: StaffService,
    ) {}
  
    @ApiResponse({ status: 201, type: AuthResponseDto.RegisterResponseDto })
    @Post('currentTask')
    @HttpCode(HttpStatus.CREATED)
    register(@Body() data: AuthRequestDto.RegisterDataDto) {
      
    }
}