import { Controller, Get, Headers, HttpException, Param, Put, Query, UseGuards } from '@nestjs/common';
import { NotifyService } from './notify.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { HeadStaffGuard } from '../auth/guards/headstaff.guard';
import { HeadGuard } from '../auth/guards/head.guard';
import { StaffGuard } from '../auth/guards/staff.guard';
import { NotifyDto } from './dto/request.dto';

@ApiTags('notification')
@Controller('notify')
export class NotifyController {
  constructor(private readonly notifyService: NotifyService) {}

  @UseGuards(HeadStaffGuard)
  @ApiOperation({ summary: 'Get all notifications for head-staff' })
  @ApiBearerAuth()
  @Get('head-staff')
  getNotificationsHeadStaff(@Headers('user') user: any, @Query() query: NotifyDto.GetAll) {
    console.log(user)
    return this.notifyService.getNotifications(user.id, query);
  }

  @UseGuards(HeadStaffGuard)
  @Put('head-staff/:id/seen')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update seen for head-staff' })
  updateSeen(@Param("id") id: string) {
    return this.notifyService.updateSeen(id);
  }

  @UseGuards(StaffGuard)
  @Put('staff/:id/seen')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update seen for staff' })
  updateSeenStaff(@Param("id") id: string) {
    return this.notifyService.updateSeen(id);
  }

  @UseGuards(StaffGuard)
  @ApiOperation({ summary: 'Get all notifications for staff' })
  @ApiBearerAuth()
  @Get('staff')
  getNotificationsStaff(@Headers('user') user: any, @Query() query: NotifyDto.GetAll) {
    console.log(user)
    return this.notifyService.getNotifications(user.id, query);
  }

  @UseGuards(HeadGuard)
  @Put('head/:id/seen')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update seen for head' })
  updateSeenHead(@Param("id") id: string) {
    return this.notifyService.updateSeen(id);
  }

  @UseGuards(HeadGuard)
  @ApiOperation({ summary: 'Get all notifications for head' })
  @ApiBearerAuth()
  @Get('head')
  getNotificationsHead(@Headers('user') user: any, @Query() query: NotifyDto.GetAll) {
    console.log(user)
    return this.notifyService.getNotifications(user.id, query);
  }
}
