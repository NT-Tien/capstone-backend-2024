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
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AdminGuard } from './guards/admin.guard';
import { FastifyRequest } from 'fastify';
import { AuthService } from './auth.service';
import { AuthResponseDto } from './dto/response.dto';
import { AuthRequestDto } from './dto/request.dto';
import { HeadStaffGuard } from './guards/headstaff.guard';

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

  @ApiOperation({
    description:
      'Head_DepartmentQ1: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjcyOGUyNjdlLWI4OGEtNDBmMS1iYmMwLWVlZmY4ZWMwYjNjMiIsInVzZXJuYW1lIjoiaGVhZF9kZXBhcnRtZW50UTEiLCJwaG9uZSI6Iis4NDM0NzM2NTU2NSIsInJvbGUiOiJoZWFkIiwiaWF0IjoxNzI4MDU5Nzg4LCJleHAiOjE4MTQ0NTk3ODh9.qNoYEp-K7CZtpuaqMHlc_ARFODP3DKjEp_dmzzYEUHg\n\nHead_Maintenance: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImVhMDUxZjEyLTM1NjMtNDc2ZC1hMzk3LWY1MmU3NzU2MGQ5NiIsInVzZXJuYW1lIjoiaGVhZF9tYWludGVuYW5jZSIsInBob25lIjoiKzg0MzQ3MzY1NTY1Iiwicm9sZSI6ImhlYWRzdGFmZiIsImlhdCI6MTcyODA1OTk0NiwiZXhwIjoxODE0NDU5OTQ2fQ.teP-iJRkB7dLQealw0nxP7UpXzCNBCQlYUu7olK2BDw\n\nHoang (Staff): eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImM3MWFhMzViLWI5YzAtNGFkOS1iOTUwLWNiODEzYzQyZjQzMSIsInVzZXJuYW1lIjoiSG9hbmciLCJwaG9uZSI6Iis4NDM0NzM2NTU2NSIsInJvbGUiOiJzdGFmZiIsImlhdCI6MTcyODA2MDA0NSwiZXhwIjoxODE0NDYwMDQ1fQ.zGc_mqSvV52iJIZrQoaE3xAwZVQs2jqL8n7k7Dd7R6U\n\nStockkeeper: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImViNDg4ZjdmLTRjMWItNDAzMi1iNWMwLThmNTQzOTY4YmJmOCIsInVzZXJuYW1lIjoic3RvY2tlZXBlciIsInBob25lIjoiKzg0MzQ3MzY1NTY1Iiwicm9sZSI6InN0b2Nra2VlcGVyIiwiaWF0IjoxNzI4MDYwNDYwLCJleHAiOjE4MTQ0NjA0NjB9.H7YtooDJQjon6WeFTWIhoDfYtnnIaMvC6dIq8eOXBWs\n\nAdmin: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImVlZjIwYWE4LWRjNTItNGYwYS04ZjIzLWFkZGM5NmQ5OTU2YSIsInVzZXJuYW1lIjoiYWRtaW4iLCJwaG9uZSI6Iis4NDM0NzM2NTU2NSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTcyODA2MDQ3NywiZXhwIjoxODE0NDYwNDc3fQ.zfk5Y8SRd0UWBks6Oce4nCJ6YpdjrNkYtoXTEmuU0H0',
  })
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
  @ApiBearerAuth()
  async changePassword(
    @Req() req: FastifyRequest['raw'],
    @Body() password: AuthRequestDto.PasswordDto,
  ) {
    const user = req.headers.user as any;
    return this.authService.changePassword(user.id, password);
  }

  @ApiResponse({ status: 200, type: AuthResponseDto.UpdateAccountResponseDto })
  @Post('update-phone')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  async changePhoneNumber(
    @Req() req: FastifyRequest['raw'],
    @Body() phone: AuthRequestDto.PhoneDto,
  ) {
    const user = req.headers.user as any;
    return this.authService.changePhoneNumber(user.id, phone);
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
