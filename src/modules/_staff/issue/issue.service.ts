import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { BaseService } from '../../../common/base/service.base';
import { IssueEntity, IssueStatus } from '../../../entities/issue.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { IssueRequestDto } from './dto/request.dto';
import { TaskEntity, TaskStatus } from 'src/entities/task.entity';

@Injectable()
export class IssueService extends BaseService<IssueEntity> {
  constructor(
    @InjectRepository(IssueEntity)
    private readonly issueRepository: Repository<IssueEntity>,
    @InjectRepository(TaskEntity)
    private readonly taskRepository: Repository<TaskEntity>,
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
    // issue.status = IssueStatus.RESOLVED;
    // issue.imagesVerify = dto.imagesVerify;
    // issue.videosVerify = dto.videosVerify;
    // issue.resolvedNote = dto.resolvedNote;
    return this.issueRepository.update(
      {
        id: issueId,
      },
      {
        status: IssueStatus.RESOLVED,
        imagesVerify: dto.imagesVerify,
        videosVerify: dto.videosVerify,
        resolvedNote: dto.resolvedNote,
      },
    );
  }

  async failIssue(
    userId: string,
    issueId: string,
    dto: IssueRequestDto.FailIssue,
  ) {
    const issue = await this.issueRepository.findOne({
      where: {
        id: issueId,
      },
      relations: ['task', 'task.fixer'],
    });
    if (!issue || issue?.task?.fixer.id !== userId) {
      throw new HttpException('Issue not found', HttpStatus.NOT_FOUND);
    }

    issue.status = IssueStatus.FAILED;
    issue.failReason = dto.failReason;
    return this.issueRepository.save(issue);
  }

  async failIssueWarranty(
    userId: string,
    issueId: string,
    dto: IssueRequestDto.FailIssueWarranty,
  ) {
    // update issue
    const issue = await this.issueRepository.findOne({
      where: {
        id: issueId,
      },
      relations: ['task', 'task.fixer'],
    });
    if (!issue || issue?.task?.fixer.id !== userId) {
      throw new HttpException('Issue not found', HttpStatus.NOT_FOUND);
    }

    issue.status = IssueStatus.FAILED;
    issue.failReason = dto.failReason;
    issue.imagesVerifyFail = dto.imagesVerify;
    const save = await this.issueRepository.save(issue);

    // update task -> closed

    if (dto.shouldSkipUpdateTask) {
      return save;
    }

    const task = await this.taskRepository.findOne({
      where: {
        id: dto.taskId,
      },
    });

    task.completedAt = new Date();
    task.status = TaskStatus.COMPLETED;

    await this.taskRepository.save(task);

    return save;
  }
}
