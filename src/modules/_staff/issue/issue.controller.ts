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

  @ApiOperation({summary: "Fail an issue in a warranty task"})
  @ApiBearerAuth()
  @Put("warranty/:issueId/failed")
  failIssueWarranty(
    @Param('issueId') issueId: UUID,
    @Body() dto: IssueRequestDto.FailIssueWarranty,
    @Headers('user') user: any,
  ) {
    return this.issueService.failIssueWarranty(user.id, issueId, dto);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Resolve an DISASSEMBLE DEVICE issue in WARRANTY task',
    description:
      'Used to complete an DISASSEMBLE DEVICE issue and provide images and videos for verification.',
  })
  @Put('warrranty/disassemble/:issueId/resolved')
  resolveWarrantyDisassembleIssue(
    @Param('issueId') issueId: UUID,
    @Body() dto: IssueRequestDto.ResolveIssue,
    @Headers('user') user: any,
  ) {
    return this.issueService.resolveWarrantyDisassembleIssue(user.id, issueId, dto);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Resolve an INSTALL REPLACEMENT DEVICE issue in WARRANTY task',
    description:
      'Used to complete an INSTALL REPLACEMENT DEVICE issue and provide images and videos for verification.',
  })
  @Put('warrranty/install-replacement/:issueId/resolved')
  resolveWarrantyInstallReplacementIssue(
    @Param('issueId') issueId: UUID,
    @Body() dto: IssueRequestDto.ResolveIssue,
    @Headers('user') user: any,
  ) {
    return this.issueService.resolveWarrantyInstallReplacementIssue(user.id, issueId, dto);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Resolve an RECEIVE issue in WARRANTY task',
    description:
      'Used to complete an RECEIVE issue and provide images and videos for verification.',
  })
  @Put("warranty/receive/:issueId/resolved")
  resolveWarrantyReceiveIssue(
    @Param('issueId') issueId: UUID,
    @Body() dto: IssueRequestDto.ResolveReceiveIssue,
    @Headers('user') user: any,
  ) {
    return this.issueService.resolveWarrantyReceiveIssue(user.id, issueId, dto);
  }
}
