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
import { AccountService } from './account.service';
import { AccountResponseDto } from './dto/response.dto';
import { HeadStaffGuard } from 'src/modules/auth/guards/headstaff.guard';

@ApiTags('head staff: account')
@UseGuards(HeadStaffGuard)
@Controller('head-staff/account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @ApiBearerAuth()
  @ApiResponse({
    type: AccountResponseDto.AccountGetAll,
    status: 200,
    description: 'Get all Accounts',
  })
  @Get()
  async getAll() {
    return await this.accountService.getAllAccountsStaff();
  }

  @ApiBearerAuth()
  @ApiResponse({
    type: AccountResponseDto.AccountGetAll,
    status: 200,
    description: 'Get all Accounts available',
  })
  @Get('get-all-avaiable/:fixDate')
  async getAllStaffAvaiable(@Param('fixDate') fixDate: string) {
    return await this.accountService.getAllAccountsStaffAvaiable(fixDate);
  }

  // @ApiResponse({
  //   type: AccountResponseDto.AccountGetAll,
  //   status: 200,
  //   description: 'Get all categories',
  // })
  // @CacheTTL(10)
  // @Get('get-all-cache')
  // async getAllForUser() {
  //   return await this.accountService.getAll();
  // }

  // @ApiBearerAuth()
  // @Get('include-deleted')
  // async getAllWithDeleted() {
  //   return await this.accountService.getAllWithDeleted();
  // }

  @ApiResponse({
    type: AccountResponseDto.AccountGetOne,
    status: 200,
    description: 'Get one Account',
  })
  @ApiBearerAuth()
  @Get(':id')
  async getOneFor(@Param('id') id: string) {
    return await this.accountService.getOne(id);
  }

  // @ApiBearerAuth()
  // @ApiResponse({
  //   type: AccountResponseDto.AccountCreate,
  //   status: 201,
  //   description: 'Create a Account',
  // })
  // @Post()
  // async create(@Body() body: AccountRequestDto.AccountCreateDto) {
  //   return await this.accountService.create(
  //     AccountRequestDto.AccountCreateDto.plainToClass(body),
  //   );
  // }

  // @ApiBearerAuth()
  // @ApiResponse({
  //   type: AccountResponseDto.AccountUpdate,
  //   status: 200,
  //   description: 'Update a Account',
  // })
  // @Put(':id')
  // async update(
  //   @Param('id') id: string,
  //   @Body() body: AccountRequestDto.AccountUpdateDto,
  // ) {
  //   return await this.accountService.update(
  //     id,
  //     AccountRequestDto.AccountUpdateDto.plainToClass(body),
  //   );
  // }

  // @ApiBearerAuth()
  // @ApiResponse({
  //   type: AccountResponseDto.AccountDelete,
  //   status: 200,
  //   description: 'Hard delete a Account',
  // })
  // @Delete(':id')
  // async deleteHard(@Param('id') id: string) {
  //   return await this.accountService.delete(id);
  // }

  // @ApiBearerAuth()
  // @ApiResponse({
  //   type: AccountResponseDto.AccountDelete,
  //   status: 200,
  //   description: 'Soft delete a Account',
  // })
  // @Delete('soft-delete/:id')
  // async delete(@Param('id') id: string) {
  //   return await this.accountService.softDelete(id);
  // }

  // @ApiBearerAuth()
  // @ApiResponse({
  //   type: AccountResponseDto.AccountRestore,
  //   status: 200,
  //   description: 'Restore a Account',
  // })
  // @Put('restore/:id')
  // async restore(@Param('id') id: string) {
  //   return await this.accountService.restore(id);
  // }
}
