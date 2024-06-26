import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { log } from 'console';
import { UUID } from 'crypto';
import { promises } from 'dns';
import { BaseService } from 'src/common/base/service.base';
import { IssueSparePartEntity, IssueSparePartStatus } from 'src/entities/issue-spare-part.entity';
import { TaskEntity, TaskStatus } from 'src/entities/task.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TaskService extends BaseService<TaskEntity>{
  
  constructor(
    @InjectRepository(IssueSparePartEntity)
    private readonly issueSparePartRepository: Repository<IssueSparePartEntity>,
    @InjectRepository(TaskEntity)
    private readonly taskRepository: Repository<TaskEntity>,
  ) {
    super(taskRepository);
  }

  
  async staffGetAllTask(userId: string,page: number, limit: number, 
      status: TaskStatus): Promise<[TaskEntity[], number]> {
    return this.taskRepository.findAndCount({
      where: {
        status: status ? status : undefined,
        fixer: { id: userId }
      },
      relations: [
        'request',
        'fixer',
        'request.requester',
        'device',
        'device.area',
        'device.machineModel',
      ],
      order: {
        priority: 'DESC', // Adjust 'priority' column ordering
        createdAt: 'DESC', // Adjust 'time' column ordering
      },
      skip: (page - 1) * limit,
      take: limit,
    });
  }



  async getTaskByStatus(userId: string, status: string): Promise<TaskEntity[]> {
    const parsedStatus: TaskStatus | undefined = this.parseTaskStatus(status);
    if (parsedStatus === undefined) {
      throw new Error(`Invalid status: ${status}`);
    }
    const tasks = await this.taskRepository.find(
      { where: 
        { fixer: { id: userId }, status: parsedStatus }    
      });
    return tasks;
  }

  async checkReceipt(taskid: UUID): Promise<boolean> {// Fetch the task entity to ensure the task exists
   try{
    const task = await this.taskRepository.findOne({
      where: { id: taskid },
      relations: ['issues', 'issues.issueSpareParts'],
    });

    if (!task) {
      throw new Error('Task not found');
    }

    // Update status of all IssueSparePartEntities associated with the task
    for (const issue of task.issues) {
      await this.issueSparePartRepository.update(
        { issue: { id: issue.id } },
        { status: IssueSparePartStatus.RECIEVED },
      );
    }
  } catch{
    return false;
  }
  }
  

  async getbyid(taskid: UUID, userid: UUID) {
    return  await this.taskRepository.findOne({
      where: {
        id: taskid,
        fixer: { id: userid },
      },
      relations: [
        'request',
        'fixer',
        'request.requester',
        'device',
        'device.machineModel',
        'device.machineModel.spareParts',
        'device.machineModel.typeErrors',
        'issues',
        'issues.typeError',
        'issues.issueSpareParts',
        'issues.issueSpareParts.sparePart',
      ],
    });
    
  }


  async updateissueStatus(issueid: UUID, newStatus: string) :  Promise<boolean> {
    
    try{

      const issueSparePart = await this.issueSparePartRepository.findOne({ where: { id: issueid } });

      if (!issueSparePart) {
        throw new Error('IssueSparePart not found');
      }

      issueSparePart.status = newStatus as IssueSparePartStatus;
      await this.issueSparePartRepository.save(issueSparePart);

      return true;

      return true;
    }
    catch{
      return false;
    }
  }

  private parseTaskStatus(statusString: string): TaskStatus | undefined {
    const statusMap: Record<string, TaskStatus> = {
      'AWAITING_FIXER': TaskStatus.AWAITING_FIXER,
      'PENDING_STOCK': TaskStatus.PENDING_STOCK,
      'ASSIGNED': TaskStatus.ASSIGNED,
      'IN_PROGRESS': TaskStatus.IN_PROGRESS,
      'COMPLETED': TaskStatus.COMPLETED,
      'CANCELLED': TaskStatus.CANCELLED,
    };

    return statusMap[statusString];
  }


}
