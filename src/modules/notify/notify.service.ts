import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/base/service.base';
import { NotifyEntity } from 'src/entities/notify.entity';
import { Repository } from 'typeorm';
import { NotifyDto } from './dto/request.dto';

@Injectable()
export class NotifyService extends BaseService<NotifyEntity> {
  constructor(
    @InjectRepository(NotifyEntity)
    private readonly notifyRepository: Repository<NotifyEntity>,
  ) {
    super(notifyRepository);
  }

  getNotifications(userId: string, query: NotifyDto.GetAll) {
    console.log(query)
    return this.notifyRepository.find({
      where: {
        receiver: {
          id: userId,
        },
        seen: query.seen,
      },
      relations: ['receiver', 'fromUser'],
      order: {
        createdAt: 'DESC',
      },
    });
  }

  updateSeen(id: string) {
    return this.notifyRepository.update(id, {
      seen: true,
    });
  }
}
