import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IssueEntity, IssueStatus } from 'src/entities/issue.entity';
import { Repository } from 'typeorm';
import { IssueRequestDto } from './dto/request.dto';

@Injectable()
export class IssueService {
  constructor(
    @InjectRepository(IssueEntity)
    private readonly issueRepository: Repository<IssueEntity>,
  ) {}

  async failIssue(issueId: string, body: IssueRequestDto.IssueFail) {
    const issue = await this.issueRepository.findOne({
      where: { id: issueId },
    });
    if (!issue) {
      throw new Error('Issue not found');
    }

    issue.status = IssueStatus.FAILED;
    issue.failReason = body.reason;
    issue.returnSparePartsStaffSignature = body.staffSignature;
    issue.returnSparePartsStockkeeperSignature = body.stockkeeperSignature;

    await this.issueRepository.save(issue);
    return issue;
  }

  async completeReturn(issueId: string) {
    const issue = await this.issueRepository.findOne({
      where: {
        id: issueId,
      },
    });

    if (!issue) {
      throw new Error('Issue not found');
    }

    issue.status = IssueStatus.RESOLVED;

    return await this.issueRepository.save(issue);
  }
}
