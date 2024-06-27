import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/base/service.base';
import { AccountEntity, Role } from 'src/entities/account.entity';
import { TaskEntity, TaskStatus } from 'src/entities/task.entity';
import { In, Repository } from 'typeorm';

@Injectable()
export class TaskService extends BaseService<TaskEntity>{
  
  constructor(
    @InjectRepository(TaskEntity)
    private readonly taskRepository: Repository<TaskEntity>,
    @InjectRepository(AccountEntity)
    private readonly accountRepository: Repository<AccountEntity>,
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
      .andWhere('request.createdAt BETWEEN :start AND :end', {
        start: new Date(new Date().setDate(new Date().getDate() - 30)),
        end: new Date(),
      })
      .getMany();
  }

  async customStaffGetTaskDetail(userId: string, taskId: string) {
    let account = await this.accountRepository.findOne({
      where: { id: userId },
    });
    if (!account || account.deletedAt || account.role !== Role.staff) {
      throw new HttpException('Account is not valid', HttpStatus.BAD_REQUEST);
    }
    return this.taskRepository.createQueryBuilder('task')
      .leftJoinAndSelect('task.device', 'device')
      .leftJoinAndSelect('task.fixer', 'fixer')
      .leftJoinAndSelect('task.issues', 'issues')
      .leftJoinAndSelect('issues.issueSpareParts', 'issueSpareParts')
      .leftJoinAndSelect('issues.typeError', 'typeError')
      .leftJoinAndSelect('issueSpareParts.sparePart', 'sparePart')
      .where('task.id = :taskId', { taskId })
      .andWhere('fixer.id = :id', { id: userId })
      .getOne();
  }

  async confirmReceipt(userId: string,taskId: string) {
    let task = await this.taskRepository.findOne({
      where: { id: taskId },
      relations: ['fixer'],
    });
    console.log(task);
    
    if (!task || task.fixer.id !== userId) {
      throw new HttpException('Task not found', HttpStatus.NOT_FOUND);
    }
    task.confirmReceipt = true;
    return await this.taskRepository.save(task);;
  }



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
