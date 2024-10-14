import {
  Body,
  Controller,
  Headers,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UUID } from 'crypto';
import { StaffGuard } from '../../auth/guards/staff.guard';
import { IssueRequestDto } from './dto/request.dto';
import { IssueService } from './issue.service';

@ApiTags('staff: issue')
@UseGuards(StaffGuard)
@Controller('staff/issue')
export class IssueController {
  constructor(private readonly issueService: IssueService) {}

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Resolve an issue in a task',
    description:
      'Used to complete an issue and provide images and videos for verification.',
  })
  @Put(':issueId/resolved')
  resolveIssue(
    @Param('issueId') issueId: UUID,
    @Body() dto: IssueRequestDto.ResolveIssue,
    @Headers('user') user: any,
  ) {
    return this.issueService.resolveIssue(user.id, issueId, dto);
  }

  @ApiBearerAuth()
  @Put(':issueId/failed')
  failIssue(
    @Param('issueId') issueId: UUID,
    @Body() dto: IssueRequestDto.FailIssue,
    @Headers('user') user: any,
  ) {
    return this.issueService.failIssue(user.id, issueId, dto);
  }
}
