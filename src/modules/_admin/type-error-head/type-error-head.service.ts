import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/base/service.base';
import { TypeErrorHeadEntity } from 'src/entities/type-error-head.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TypeErrorHeadService extends BaseService<TypeErrorHeadEntity> {
  constructor(
    @InjectRepository(TypeErrorHeadEntity)
    private readonly typeErrorHeadRepository: Repository<TypeErrorHeadEntity>,
  ) {
    super(typeErrorHeadRepository);
  }
}
