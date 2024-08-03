import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { BaseService } from '../../../common/base/service.base';
import { IssueEntity, IssueStatus } from '../../../entities/issue.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { IssueRequestDto } from './dto/request.dto';

@Injectable()
export class IssueService extends BaseService<IssueEntity> {
  constructor(
    @InjectRepository(IssueEntity)
    private readonly issueRepository: Repository<IssueEntity>,
  ) {
    super(issueRepository);
  }

  async resolveIssue(
    userId: string,
    issueId: string,
    dto: IssueRequestDto.ResolveIssue,
  ) {
    const issue = await this.issueRepository.findOne({
      where: {
        id: issueId,
      },
      relations: ['task', 'task.fixer'],
    });
    if (!issue || issue.task.fixer.id !== userId) {
      throw new HttpException('Issue not found', HttpStatus.NOT_FOUND);
    }
    issue.status = IssueStatus.RESOLVED;
    issue.imagesVerify = dto.imagesVerify;
    issue.videosVerify = dto.videosVerify;
    return this.issueRepository.save(issue);
  }
}
