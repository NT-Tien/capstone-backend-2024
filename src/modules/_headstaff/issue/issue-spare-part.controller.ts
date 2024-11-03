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
import { IssueSparePartResponseDto } from './dto/response.dto';
// import { CacheTTL } from '@nestjs/cache-manager';
import { IssueSparePartRequestDto } from './dto/request.dto';
import { HeadStaffGuard } from 'src/modules/auth/guards/headstaff.guard';
import { IssueSparePartService } from './issue-spare-part.service';

@ApiTags('head staff: issue spare part')
@UseGuards(HeadStaffGuard)
@Controller('head-staff/issue-spare-part')
export class IssueSparePartController {
  constructor(private readonly issueSparePartService: IssueSparePartService) {}

  // @ApiBearerAuth()
  // @ApiResponse({
  //   type: IssueSparePartResponseDto.IssueGetAll,
  //   status: 200,
  //   description: 'Get all Issues',
  // })
  // @Get()
  // async getAll() {
  //   return await this.issueSparePartService.getAll();
  // }

  // @ApiResponse({
  //   type: IssueSparePartResponseDto.IssueGetAll,
  //   status: 200,
  //   description: 'Get all categories',
  // })
  // @CacheTTL(10)
  // @Get('get-all-cache')
  // async getAllForUser() {
  //   return await this.issueSparePartService.getAll();
  // }

  // @ApiBearerAuth()
  // @Get('include-deleted')
  // async getAllWithDeleted() {
  //   return await this.issueSparePartService.getAllWithDeleted();
  // }

  // @ApiResponse({
  //   type: IssueSparePartResponseDto.IssueGetOne,
  //   status: 200,
  //   description: 'Get one Issue',
  // })
  // @ApiBearerAuth()
  // @Get(':id')
  // async getOneFor(@Param('id') id: string) {
  //   return await this.issueSparePartService.getOneIssueById(id);
  // }

  @ApiBearerAuth()
  @ApiResponse({
    type: IssueSparePartResponseDto.IssueSparePartCreate,
    status: 201,
    description: 'Create a Issue',
  })
  @Post()
  async create(@Body() body: IssueSparePartRequestDto.IssueSparePartCreateDto) {
    return await this.issueSparePartService.create(
      IssueSparePartRequestDto.IssueSparePartCreateDto.plainToClass(body),
    );
  }

  @ApiBearerAuth()
  @ApiResponse({
    type: IssueSparePartResponseDto.IssueSparePartUpdate,
    status: 200,
    description: 'Update a Issue',
  })
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() body: IssueSparePartRequestDto.IssueSparePartUpdateDto,
  ) {
    return await this.issueSparePartService.update(
      id,
      IssueSparePartRequestDto.IssueSparePartUpdateDto.plainToClass(body),
    );
  }

  @ApiBearerAuth()
  @ApiResponse({
    type: IssueSparePartResponseDto.IssueSparePartDelete,
    status: 200,
    description: 'Hard delete a Issue',
  })
  @Delete(':id')
  async deleteHard(@Param('id') id: string) {
    return await this.issueSparePartService.delete(id);
  }

  // @ApiBearerAuth()
  // @ApiResponse({
  //   type: IssueSparePartResponseDto.IssueDelete,
  //   status: 200,
  //   description: 'Soft delete a Issue',
  // })
  // @Delete('soft-delete/:id')
  // async delete(@Param('id') id: string) {
  //   return await this.issueSparePartService.softDelete(id);
  // }

  // @ApiBearerAuth()
  // @ApiResponse({
  //   type: IssueSparePartResponseDto.IssueRestore,
  //   status: 200,
  //   description: 'Restore a Issue',
  // })
  // @Put('restore/:id')
  // async restore(@Param('id') id: string) {
  //   return await this.issueSparePartService.restore(id);
  // }
}
