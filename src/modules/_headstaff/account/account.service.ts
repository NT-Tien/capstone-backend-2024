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
      where: { role: Role.staff },
      order: { createdAt: 'DESC' },
      // skip: (page - 1) * limit,
      // take: limit,
    });
  }
}
