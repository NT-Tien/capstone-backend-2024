import {
  Controller,
  Get,
  Headers,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoggedInGuard } from 'src/modules/auth/guards/logged-in.guard';
import { NotificationsRequestDto } from 'src/modules/notifications/dto/Request.dto';
import { HeadStaffNotificationGateway } from 'src/modules/notifications/gateways/head-staff.gateway';
import { HeadNotificationGateway } from 'src/modules/notifications/gateways/head.gateway';
import { StaffNotificationGateway } from 'src/modules/notifications/gateways/staff.gateway';
import { NotificationsService } from 'src/modules/notifications/notifications.service';

@UseGuards(LoggedInGuard)
@ApiTags('notifications')
@Controller('notifications')
export class NotificationsController {
  constructor(
    private readonly notificationsService: NotificationsService,
    private readonly headGateway: HeadNotificationGateway,
    private readonly headStaffGateway: HeadStaffNotificationGateway,
    private readonly staffGateway: StaffNotificationGateway,
  ) {}

  @ApiOperation({
    summary: 'Get notifications',
    description: 'Get all notifications with filtering',
  })
  @ApiBearerAuth()
  @Get()
  async getNotifications(
    @Query() query: NotificationsRequestDto.All_FilterQuery,
    @Headers('user') user: any,
  ) {
    return this.notificationsService.getAll_filtered(query, user.id);
  }

  @ApiOperation({
    summary: 'Get number of unseen notifications',
    description: 'Get number of unseen notifications',
  })
  @ApiBearerAuth()
  @Get('/unseen-count')
  async getUnseenCount(@Headers('user') user: any) {
    return this.notificationsService.getUnseenCount(user.id);
  }

  @ApiOperation({
    summary: 'Mark all notifications as seen',
    description: 'Mark all notifications as seen',
  })
  @ApiBearerAuth()
  @Put('/seen-all')
  async seenAll(@Headers('user') user: any) {
    return this.notificationsService.seenAll(user.id);
  }

  @ApiOperation({
    summary: 'Mark one notification as seen',
    description: 'Mark one notification as seen',
  })
  @ApiBearerAuth()
  @Put('/:id/seen')
  async seenOne(@Param('id') id: string, @Headers('user') user: any) {
    console.log(id, user)
    return this.notificationsService.seenOne(id, user.id);
  }

  @ApiBearerAuth()
  @Post('/send-test/HD')
  async testHD(@Query() query: NotificationsRequestDto.TestNotification) {
    return this.headGateway.emit_test(query.sendTo);
  }

  @ApiBearerAuth()
  @Post('/send-test/HM')
  async testHM(@Query() query: NotificationsRequestDto.TestNotification) {
    return this.headStaffGateway.emit_test(query.sendTo);
  }

  @ApiBearerAuth()
  @Post('/send-test/S')
  async testS(@Query() query: NotificationsRequestDto.TestNotification) {
    return this.staffGateway.emit_test(query.sendTo);
  }
}
