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
import { AdminGuard } from './guards/admin.guard';
import { FastifyRequest } from 'fastify';
import { AuthService } from './auth.service';
import { AuthResponseDto } from './dto/response.dto';
import { AuthRequestDto } from './dto/request.dto';
import { StaffGuard } from './guards/staff.guard';
import { HeadGuard } from './guards/head.guard';
import { HeadStaffGuard } from './guards/headstaff.guard';
import { StockkeeperGuard } from './guards/stockkeeper.guard';
import { ManagerGuard } from './guards/manager.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    @Inject('AUTH_SERVICE_TIENNT') private readonly authService: AuthService,
  ) {}

  @ApiResponse({ status: 201, type: AuthResponseDto.RegisterResponseDto })
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  register(@Body() data: AuthRequestDto.RegisterDataDto) {
    return this.authService.register(
      AuthRequestDto.RegisterDataDto.plainToClass(data),
    );
  }

  @ApiResponse({ status: 200, type: AuthResponseDto.LoginResponseDto })
  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() data: AuthRequestDto.LoginLocalDataDto) {
    return this.authService.login(data.username, data.password);
  }

  // ! apis for admin

  @ApiResponse({ status: 200, type: AuthResponseDto.GetAccountResponseDto })
  @Get('admin/all-accounts')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  getAllAccounts() {
    return this.authService.getAllAccounts();
  }

  @ApiResponse({ status: 200, type: AuthResponseDto.UpdateAccountResponseDto })
  @Delete('admin/delete-account/:id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  deleteAccount(@Param('id') id: string) {
    return this.authService.softDeleteAccount(id);
  }
  @ApiResponse({ status: 200, type: AuthResponseDto.UpdateAccountResponseDto })
  @Put('admin/undo-delete-account/:id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  undoDeleteAccount(@Param('id') id: string) {
    return this.authService.undoDeleteAccount(id);
  }

  // ! features for all users

  @ApiResponse({ status: 200, type: AuthResponseDto.GetAccountResponseDto })
  @Get('get-account')
  @HttpCode(HttpStatus.OK)
  @UseGuards(
    StaffGuard,
    AdminGuard,
    HeadGuard,
    HeadStaffGuard,
    StockkeeperGuard,
    ManagerGuard,
  )
  @ApiBearerAuth()
  async getAccount(@Req() req: FastifyRequest['raw']) {
    const decoded = await this.authService.decodeToken(
      req.headers.authorization?.split(' ')[1],
    );
    return this.authService.getAccount(decoded.id);
  }

  @ApiResponse({ status: 200, type: AuthResponseDto.UpdateAccountResponseDto })
  @Post('change-password')
  @HttpCode(HttpStatus.OK)
  @UseGuards(
    StaffGuard,
    AdminGuard,
    HeadGuard,
    HeadStaffGuard,
    StockkeeperGuard,
    ManagerGuard,
  )
  @ApiBearerAuth()
  async changePassword(
    @Req() req: FastifyRequest['raw'],
    @Body() password: AuthRequestDto.PasswordDto,
  ) {
    const decoded = await this.authService.decodeToken(
      req.headers.authorization?.split(' ')[1],
    );
    return this.authService.changePassword(decoded.id, password);
  }

  @ApiResponse({ status: 200, type: AuthResponseDto.UpdateAccountResponseDto })
  @Post('update-phone')
  @HttpCode(HttpStatus.OK)
  @UseGuards(
    StaffGuard,
    AdminGuard,
    HeadGuard,
    HeadStaffGuard,
    StockkeeperGuard,
    ManagerGuard,
  )
  @ApiBearerAuth()
  async changePhoneNumber(
    @Req() req: FastifyRequest['raw'],
    @Body() phone: AuthRequestDto.PhoneDto,
  ) {
    const decoded = await this.authService.decodeToken(
      req.headers.authorization?.split(' ')[1],
    );
    return this.authService.changePhoneNumber(decoded.id, phone);
  }

  // ! apis for head staffs

  @ApiResponse({ status: 200, type: AuthResponseDto.GetAccountResponseDto })
  @Get('head-staff/all-staff-accounts')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AdminGuard, HeadStaffGuard)
  @ApiBearerAuth()
  getAllStaffAccounts() {
    return this.authService.getAllStaffs();
  }
}
