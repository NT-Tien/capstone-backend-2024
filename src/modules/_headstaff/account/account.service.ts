import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/base/service.base';
import { AccountEntity, Role } from 'src/entities/account.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AccountService extends BaseService<AccountEntity> {
  constructor(
    @InjectRepository(AccountEntity)
    private readonly accountRepository: Repository<AccountEntity>,
  ) {
    super(accountRepository);
  }

  async getAllAccountsStaff(): Promise<AccountEntity[]> {
    return this.accountRepository.find({
      relations: ['tasks'],
      where: { role: Role.staff },
      order: { createdAt: 'DESC' },
      // skip: (page - 1) * limit,
      // take: limit,
    });
  }

  async getAllAccountsStaffAvaiable(fixDate: string): Promise<AccountEntity[]> {
    let result = await this.accountRepository
      .createQueryBuilder('account')
      .leftJoinAndSelect('account.tasks', 'task')
      .where('account.role = :role', { role: Role.staff })
      .andWhere('task.fixer_date = :fixDate OR task.id IS NULL', { fixDate })
      .getMany();
    // exclude staff have a task is priority and total task not over 60 * 8 minutes
    result = result.filter((staff) => {
      const task_priority = staff?.tasks.find((task) => task.priority === true);
      const task_over = staff.tasks.reduce((total, task) => {
        return total + task.totalTime;
      }, 0);
      return !task_priority && task_over < 60 * 8;
    });
    return result;
  }
}
