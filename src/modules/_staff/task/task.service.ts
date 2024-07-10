import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/base/service.base';
import { AccountEntity, Role } from 'src/entities/account.entity';
import { IssueSparePartEntity } from 'src/entities/issue-spare-part.entity';
import { IssueEntity, IssueStatus } from 'src/entities/issue.entity';
import { TaskEntity, TaskStatus } from 'src/entities/task.entity';
import { In, Repository } from 'typeorm';
import { TaskRequestDto } from './dto/request.dto';
import { SparePartEntity } from 'src/entities/spare-part.entity';

@Injectable()
export class TaskService extends BaseService<TaskEntity> {

  constructor(
    @InjectRepository(TaskEntity)
    private readonly taskRepository: Repository<TaskEntity>,
    @InjectRepository(AccountEntity)
    private readonly accountRepository: Repository<AccountEntity>,
    @InjectRepository(IssueEntity)
    private readonly issueRepository: Repository<IssueEntity>,
    @InjectRepository(IssueSparePartEntity)
    private readonly issueSparePartRepository: Repository<IssueSparePartEntity>,
    @InjectRepository(SparePartEntity)
    private readonly sparePartRepository: Repository<SparePartEntity>,
  ) {
    super(taskRepository);
  }


  async staffGetAllTask(userId: string) {
    let account = await this.accountRepository.findOne({
      where: { id: userId },
    });
    if (!account || account.deletedAt || account.role !== Role.staff) {
      throw new HttpException('Account is not valid', HttpStatus.BAD_REQUEST);
    }
    return this.taskRepository.createQueryBuilder('task')
      .leftJoinAndSelect('task.device', 'device')
      .leftJoinAndSelect('task.fixer', 'fixer')
      .andWhere('fixer.id = :id', { id: userId })
      .getMany();
  }

  async customStaffGetTaskDetail(userId: string, id: string) {
    var account = await this.accountRepository.findOne({
      where: { id: userId },
    });
    if (!account || account.deletedAt || account.role !== Role.staff) {
      throw new HttpException('Account is not valid', HttpStatus.BAD_REQUEST);
    }
    return await this.taskRepository.findOne({
      where: { id },
      relations: [
        'request',
        'fixer',
        'request.requester',
        'device',
        'device.area',
        'device.machineModel',
        'device.machineModel.spareParts',
        'device.machineModel.typeErrors',
        'issues',
        'issues.typeError',
        'issues.issueSpareParts',
        'issues.issueSpareParts.sparePart',
      ]
    });
  }

  async confirmReceipt(userId: string, taskId: string) {
    let task = await this.taskRepository.findOne({
      where: { id: taskId },
      relations: ['fixer', 'issues', 'issues.issueSpareParts', 'issues.issueSpareParts.sparePart'],
    });

    if (!task || task.fixer.id !== userId) {
      throw new HttpException('Task not found', HttpStatus.NOT_FOUND);
    }
    // decrease spare part quantity in db
    for (let issue of task.issues) {
      for (let issueSparePart of issue.issueSpareParts) {
        let sparePart = await this.sparePartRepository.findOne({
          where: { id: issueSparePart.sparePart.id },
        });
        if (!sparePart) {
          throw new HttpException('Spare part not found', HttpStatus.NOT_FOUND);
        }
        sparePart.quantity -= issueSparePart.quantity;
        await this.sparePartRepository.save(sparePart);
      }
    }
    task.confirmReceipt = true;
    return await this.taskRepository.save(task);;
  }

  // update issue status
  async updateIssueStatus(userId: string, issueId: string, status: IssueStatus) {
    let issue = await this.issueRepository.findOne({
      where: { id: issueId },
      relations: ['task', 'task.fixer'],
    });
    if (!issue || issue.task.fixer.id !== userId) {
      throw new HttpException('Issue not found', HttpStatus.NOT_FOUND);
    }
    issue.status = status;
    return await this.issueRepository.save(issue);
  }

  // confirm in process
  async confirmInProcess(userId: string, taskId: string){
    let task = await this.taskRepository.findOne({
      where: { id: taskId },
      relations: ['fixer'],
    });
    if (!task || task.fixer.id !== userId) {
      throw new HttpException('Task not found', HttpStatus.NOT_FOUND);
    }
    task.status = TaskStatus.IN_PROGRESS;
    return await this.taskRepository.save(task);
  }

  // confirm completion
  async confirmCompletion(userId: string, taskId: string, data: TaskRequestDto.TaskConfirmDoneDto) {
    let task = await this.taskRepository.findOne({
      where: { id: taskId },
      relations: ['fixer'],
    });
    if (!task || task.fixer.id !== userId) {
      throw new HttpException('Task not found', HttpStatus.NOT_FOUND);
    }
    task.status = TaskStatus.COMPLETED;
    return await this.taskRepository.save({...task, ...data});
  }

  // send 


  // async getTaskByStatus(userId: string, status: string): Promise<TaskEntity[]> {
  //   const parsedStatus: TaskStatus | undefined = this.parseTaskStatus(status);
  //   if (parsedStatus === undefined) {
  //     throw new Error(`Invalid status: ${status}`);
  //   }
  //   const tasks = await this.taskRepository.find(
  //     { where: 
  //       { fixer: { id: userId }, status: parsedStatus }    
  //     });
  //   return tasks;
  // }

  // async checkReceipt(taskid: UUID): Promise<boolean> {// Fetch the task entity to ensure the task exists
  //  try{
  //   const task = await this.taskRepository.findOne({
  //     where: { id: taskid },
  //     relations: ['issues', 'issues.issueSpareParts'],
  //   });

  //   if (!task) {
  //     throw new Error('Task not found');
  //   }

  //   // Update status of all IssueSparePartEntities associated with the task
  //   for (const issue of task.issues) {
  //     await this.issueSparePartRepository.update(
  //       { issue: { id: issue.id } },
  //       { status: IssueSparePartStatus.RECIEVED },
  //     );
  //   }
  // } catch{
  //   return false;
  // }
  // }


  // async getbyid(taskid: UUID, userid: UUID) {
  //   return  await this.taskRepository.findOne({
  //     where: {
  //       id: taskid,
  //       fixer: { id: userid },
  //     },
  //     relations: [
  //       'request',
  //       'fixer',
  //       'request.requester',
  //       'device',
  //       'device.machineModel',
  //       'device.machineModel.spareParts',
  //       'device.machineModel.typeErrors',
  //       'issues',
  //       'issues.typeError',
  //       'issues.issueSpareParts',
  //       'issues.issueSpareParts.sparePart',
  //     ],
  //   });

  // }


  // async updateissueStatus(issueid: UUID, newStatus: string) :  Promise<boolean> {

  //   try{

  //     const issueSparePart = await this.issueSparePartRepository.findOne({ where: { id: issueid } });

  //     if (!issueSparePart) {
  //       throw new Error('IssueSparePart not found');
  //     }

  //     issueSparePart.status = newStatus as IssueSparePartStatus;
  //     await this.issueSparePartRepository.save(issueSparePart);

  //     return true;

  //     return true;
  //   }
  //   catch{
  //     return false;
  //   }
  // }

  // private parseTaskStatus(statusString: string): TaskStatus | undefined {
  //   const statusMap: Record<string, TaskStatus> = {
  //     'AWAITING_FIXER': TaskStatus.AWAITING_FIXER,
  //     'PENDING_STOCK': TaskStatus.PENDING_STOCK,
  //     'ASSIGNED': TaskStatus.ASSIGNED,
  //     'IN_PROGRESS': TaskStatus.IN_PROGRESS,
  //     'COMPLETED': TaskStatus.COMPLETED,
  //     'CANCELLED': TaskStatus.CANCELLED,
  //   };

  //   return statusMap[statusString];
  // }


}
