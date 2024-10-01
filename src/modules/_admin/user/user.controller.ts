import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AdminGuard } from 'src/modules/auth/guards/admin.guard';
import { UserService } from './user.service';

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
}
