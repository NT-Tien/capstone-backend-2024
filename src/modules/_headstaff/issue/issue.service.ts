import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/base/service.base';
import { IssueEntity } from 'src/entities/issue.entity';
import { Repository } from 'typeorm';
import { IssueSparePartEntity } from '../../../entities/issue-spare-part.entity';
import { RequestEntity, RequestStatus } from '../../../entities/request.entity';
import { TypeErrorEntity } from '../../../entities/type-error.entity';
import { IssueRequestDto } from './dto/request.dto';

@Injectable()
export class IssueService extends BaseService<IssueEntity> {
  constructor(
    @InjectRepository(IssueEntity)
    private readonly issueRepository: Repository<IssueEntity>,
    @InjectRepository(IssueSparePartEntity)
    private readonly issueSparePartRepository: Repository<IssueSparePartEntity>,
    @InjectRepository(TypeErrorEntity)
    private readonly typeErrorRepository: Repository<TypeErrorEntity>,
    @InjectRepository(RequestEntity)
    private readonly requestRepository: Repository<RequestEntity>,
  ) {
    super(issueRepository);
  }

  async getOneIssueById(id: string): Promise<IssueEntity> {
    return this.issueRepository.findOne({
      where: { id },
      relations: [
        'task',
        "task.fixer",
        'typeError',
        'issueSpareParts',
        'issueSpareParts.sparePart',
      ],
    });
  }

  async createMany(dto: IssueRequestDto.IssueCreateManyDto) {
    const issues = dto.issues;
    const requestId = dto.request;

    const request = await this.requestRepository.findOne({
      where: { id: requestId },
    });

    if (!request) {
      throw new HttpException('Request not found', HttpStatus.BAD_REQUEST);
    }

    for (const issueDto of issues) {
      const typeError = await this.typeErrorRepository.findOne({
        where: { id: issueDto.typeError },
      });

      if (!typeError) {
        throw new HttpException('Type error not found', HttpStatus.BAD_REQUEST);
      }

      // create issue
      const newIssue = await this.issueRepository.save({
        description: issueDto.description,
        typeError: typeError,
        fixType: issueDto.fixType as any,
        request: {
          id: requestId,
        },
      });

      // create spare parts
      const issueSpareParts = issueDto.spareParts.map((issueSparePartDto) => {
        return {
          issue: newIssue,
          quantity: issueSparePartDto.quantity,
          sparePart: {
            id: issueSparePartDto.sparePart,
          },
        } as IssueSparePartEntity;
      });

      await this.issueSparePartRepository.save(issueSpareParts);
    }

    // update request status
    request.status = RequestStatus.APPROVED;
    await this.requestRepository.save(request);
  }
}
