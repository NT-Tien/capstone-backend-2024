import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/base/service.base';
import { AccountEntity } from 'src/entities/account.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService extends BaseService<AccountEntity> {
  constructor(
    @InjectRepository(AccountEntity)
    private readonly accountRepository: Repository<AccountEntity>,
    private readonly jwtService: JwtService,
  ) {
    super(accountRepository);
  }

  async getUserById(id: string) {
    const account = await this.accountRepository.findOne({ where: { id } });
    return account;
  }

  async hashPassword(password: string): Promise<string> {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
  }

  async create(data: any) {
    data.password = await this.hashPassword(data.password);
    return await super.create(data);
  }

  async update(id: string, data: any) {
    if (data.password) {
      data.password = await this.hashPassword(data.password);
    }
    return await super.update(id, data);
  }
}
