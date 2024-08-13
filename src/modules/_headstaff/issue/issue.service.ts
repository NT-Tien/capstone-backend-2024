import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/base/service.base';
import { IssueEntity } from 'src/entities/issue.entity';
import { Repository } from 'typeorm';

@Injectable()
export class IssueService extends BaseService<IssueEntity> {
  constructor(
    @InjectRepository(IssueEntity)
    private readonly issueRepository: Repository<IssueEntity>,
  ) {
    super(issueRepository);
  }

  async getOneIssueById(id: string): Promise<IssueEntity> {
    return this.issueRepository.findOne({
      where: { id },
      relations: [
        'task',
        'typeError',
        'issueSpareParts',
        'issueSpareParts.sparePart',
      ],
    });
  }
}
