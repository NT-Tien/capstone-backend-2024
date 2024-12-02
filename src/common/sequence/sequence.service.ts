import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SequenceEntity } from 'src/entities/sequence.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SequenceService {
  constructor(
    @InjectRepository(SequenceEntity)
    private readonly sequenceRepository: Repository<SequenceEntity>,
  ) {}

  request_get() {
    return this.sequenceRepository.findOne({ where: { name: 'request' } });
  }

  request_increment() {
    return this.sequenceRepository.increment({ name: 'request' }, 'value', 1);
  }
}
