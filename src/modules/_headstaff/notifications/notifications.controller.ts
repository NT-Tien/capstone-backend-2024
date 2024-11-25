import {
  Controller,
  Get,
  Headers,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { NotificationsRequestDto } from 'src/modules/_headstaff/notifications/dto/request.dto';
import { NotificationsService } from 'src/modules/_headstaff/notifications/notifications.service';
import { HeadStaffGuard } from 'src/modules/auth/guards/headstaff.guard';

@ApiTags('head-staff: notifications')
@UseGuards(HeadStaffGuard)
@Controller('head-staff/notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @ApiOperation({
    summary: 'Get notifications for Head Staff',
    description: 'Get all notifications for Head Staff with filtering',
  })
  @ApiBearerAuth()
  @Get()
  async getNotifications(
    @Query() query: NotificationsRequestDto.All_FilterQuery,
    @Headers('user') user: any,
  ) {
    return this.notificationsService.getAll_filtered(query, user.id);
  }

  @ApiBearerAuth()
  @Post('/send-test')
  async test(@Headers('user') user: any) {
    return this.notificationsService.sendTestNotification(user.id);
  }

  @ApiOperation({
    summary: 'Mark all notifications as seen',
    description: 'Mark all notifications as seen for Head Staff',
  })
  @ApiBearerAuth()
  @Put('/seen-all')
  async seenAll(@Headers('user') user: any) {
    return this.notificationsService.seenAll(user.id);
  }

  @ApiOperation({
    summary: 'Mark one notification as seen',
    description: 'Mark one notification as seen for Head Staff',
  })
  @ApiBearerAuth()
  @Put('/:id/seen')
  async seenOne(@Query('id') id: string, @Headers('user') user: any) {
    return this.notificationsService.seenOne(id, user.id);
  }
}
