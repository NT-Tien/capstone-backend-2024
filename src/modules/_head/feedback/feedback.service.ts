import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/base/service.base';
import { AreaEntity } from 'src/entities/area.entity';
import { FeedbackEntity } from 'src/entities/feedback.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FeedbackService extends BaseService<FeedbackEntity> {
  constructor(
    @InjectRepository(AreaEntity)
    private readonly feedbackRepository: Repository<FeedbackEntity>,
  ) {
    super(feedbackRepository);
  }
}
