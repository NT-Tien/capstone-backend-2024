import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AdminGuard } from 'src/modules/auth/guards/admin.guard';
import { UserService } from './user.service';
import { UserRequestDto } from './dto/request.dto';

@ApiTags('admin: user')
@UseGuards(AdminGuard)
@Controller('/admin/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Get user by ID' })
  @ApiBearerAuth()
  @Get('/one/:id')
  async getOne(@Param('id') id: string) {
    return await this.userService.getUserById(id);
  }

  @ApiBearerAuth()
  @Get()
  async getAll() {
    return await this.userService.getAll();
  }

  // @ApiResponse({
  //   type: UserResponseDto.UserGetAll,
  //   status: 200,
  //   description: 'Get all categories',
  // })
  // @CacheTTL(10)
  // @Get('get-all-cache')
  // async getAllForUser() {
  //   return await this.userService.getAll();
  // }

  @ApiBearerAuth()
  @Get('include-deleted')
  async getAllWithDeleted() {
    return await this.userService.getAllWithDeleted();
  }

  @ApiBearerAuth()
  @Get(':id')
  async getOneFor(@Param('id') id: string) {
    return await this.userService.getUserById(id);
  }

  @ApiBearerAuth()
  @Post()
  async create(@Body() body: UserRequestDto.UserCreateDto) {
    return await this.userService.create(
      UserRequestDto.UserCreateDto.plainToClass(body),
    );
  }

  @ApiBearerAuth()
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() body: UserRequestDto.UserUpdateDto,
  ) {
    return await this.userService.update(
      id,
      UserRequestDto.UserUpdateDto.plainToClass(body),
    );
  }

  @ApiBearerAuth()
  @Delete(':id')
  async deleteHard(@Param('id') id: string) {
    return await this.userService.delete(id);
  }

  @ApiBearerAuth()
  @Delete('soft-delete/:id')
  async delete(@Param('id') id: string) {
    return await this.userService.softDelete(id);
  }

  @ApiBearerAuth()
  @Put('restore/:id')
  async restore(@Param('id') id: string) {
    return await this.userService.restore(id);
  }

}
