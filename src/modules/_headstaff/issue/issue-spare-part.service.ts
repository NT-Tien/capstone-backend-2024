import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/base/service.base';
import { IssueSparePartEntity } from 'src/entities/issue-spare-part.entity';
import { Repository } from 'typeorm';

@Injectable()
export class IssueSparePartService extends BaseService<IssueSparePartEntity> {
  constructor(
    @InjectRepository(IssueSparePartEntity)
    private readonly issueSparePartRepository: Repository<IssueSparePartEntity>,
  ) {
    super(issueSparePartRepository);
  }

  async getOneIssueById(id: string): Promise<IssueSparePartEntity> {
    return this.issueSparePartRepository.findOne({
      where: { id },
      relations: ['task'],
    });
  }
}
