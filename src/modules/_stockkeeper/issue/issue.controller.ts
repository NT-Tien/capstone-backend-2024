import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { StockkeeperGuard } from 'src/modules/auth/guards/stockkeeper.guard';
import { IssueService } from './issue.service';
import { IssueRequestDto } from './dto/request.dto';

@ApiTags('stockkeeper: issue')
@UseGuards(StockkeeperGuard)
@Controller('/stockkeeper/issue')
export class IssueController {
  constructor(private readonly issueService: IssueService) {}

  @Post('/fail-issue/:issueId')
  failIssue(
    @Param('issueId') issueId: string,
    @Body() body: IssueRequestDto.IssueFail,
  ) {
    return this.issueService.failIssue(issueId, body);
  }

  @ApiBearerAuth()
  @Put('/warranty/complete-return-device/:issueId')
  completeReturn(@Param('issueId') issueId: string) {
    return this.issueService.completeReturn(issueId);
  }
}
