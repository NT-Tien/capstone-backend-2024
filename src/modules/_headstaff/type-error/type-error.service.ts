import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/base/service.base';
import { TypeErrorEntity } from 'src/entities/type-error.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TypeErrorService extends BaseService<TypeErrorEntity> {
  constructor(
    @InjectRepository(TypeErrorEntity)
    private readonly typeErrorRepository: Repository<TypeErrorEntity>,
  ) {
    super(typeErrorRepository);
  }
}
