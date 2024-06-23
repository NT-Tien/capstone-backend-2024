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
import { IssueResponseDto } from './dto/response.dto';
// import { CacheTTL } from '@nestjs/cache-manager';
import { IssueRequestDto } from './dto/request.dto';
import { IssueService } from './issue.service';
import { HeadStaffGuard } from 'src/modules/auth/guards/headstaff.guard';

@ApiTags('head staff: issue')
@UseGuards(HeadStaffGuard)
@Controller('head-staff/issue')
export class IssueController {
  constructor(private readonly issueService: IssueService) {}

  // @ApiBearerAuth()
  // @ApiResponse({
  //   type: IssueResponseDto.IssueGetAll,
  //   status: 200,
  //   description: 'Get all Issues',
  // })
  // @Get()
  // async getAll() {
  //   return await this.issueService.getAll();
  // }

  // @ApiResponse({
  //   type: IssueResponseDto.IssueGetAll,
  //   status: 200,
  //   description: 'Get all categories',
  // })
  // @CacheTTL(10)
  // @Get('get-all-cache')
  // async getAllForUser() {
  //   return await this.issueService.getAll();
  // }

  // @ApiBearerAuth()
  // @Get('include-deleted')
  // async getAllWithDeleted() {
  //   return await this.issueService.getAllWithDeleted();
  // }

  @ApiResponse({
    type: IssueResponseDto.IssueGetOne,
    status: 200,
    description: 'Get one Issue',
  })
  @ApiBearerAuth()
  @Get(':id')
  async getOneFor(@Param('id') id: string) {
    return await this.issueService.getOneIssueById(id);
  }

  @ApiBearerAuth()
  @ApiResponse({
    type: IssueResponseDto.IssueCreate,
    status: 201,
    description: 'Create a Issue',
  })
  @Post()
  async create(@Body() body: IssueRequestDto.IssueCreateDto) {
    return await this.issueService.create(
      IssueRequestDto.IssueCreateDto.plainToClass(body),
    );
  }

  @ApiBearerAuth()
  @ApiResponse({
    type: IssueResponseDto.IssueUpdate,
    status: 200,
    description: 'Update a Issue',
  })
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() body: IssueRequestDto.IssueUpdateDto,
  ) {
    return await this.issueService.update(
      id,
      IssueRequestDto.IssueUpdateDto.plainToClass(body),
    );
  }

  @ApiBearerAuth()
  @ApiResponse({
    type: IssueResponseDto.IssueDelete,
    status: 200,
    description: 'Hard delete a Issue',
  })
  @Delete(':id')
  async deleteHard(@Param('id') id: string) {
    return await this.issueService.delete(id);
  }

  // @ApiBearerAuth()
  // @ApiResponse({
  //   type: IssueResponseDto.IssueDelete,
  //   status: 200,
  //   description: 'Soft delete a Issue',
  // })
  // @Delete('soft-delete/:id')
  // async delete(@Param('id') id: string) {
  //   return await this.issueService.softDelete(id);
  // }

  // @ApiBearerAuth()
  // @ApiResponse({
  //   type: IssueResponseDto.IssueRestore,
  //   status: 200,
  //   description: 'Restore a Issue',
  // })
  // @Put('restore/:id')
  // async restore(@Param('id') id: string) {
  //   return await this.issueService.restore(id);
  // }
}
