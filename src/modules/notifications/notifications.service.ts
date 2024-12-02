import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  NotificationEntity,
  NotificationPriority,
  NotificationType,
} from 'src/entities/notification.entity';
import { NotificationsRequestDto } from 'src/modules/notifications/dto/Request.dto';
import { In, IsNull, Repository } from 'typeorm';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(NotificationEntity)
    private readonly notificationsRepository: Repository<NotificationEntity>,
  ) {}

  async getAll_filtered(
    query: NotificationsRequestDto.All_FilterQuery,
    userId: string,
  ) {
    const builder = this.notificationsRepository
      .createQueryBuilder('notification')
      .leftJoinAndSelect('notification.receiver', 'receiver')
      .leftJoinAndSelect('notification.sender', 'sender')
      .where('receiver.id = :userId', { userId });

    console.log(query);

    if (query.priority) {
      builder.andWhere('notification.priority = :priority', {
        priority: query.priority,
      });
    }

    if (query.hasSeen !== undefined) {
      builder.andWhere(
        'notification.seenDate IS ' +
          (query.hasSeen === 'true' ? 'NOT NULL' : 'NULL'),
      );
    }

    return builder.getMany();
  }

  async getUnseenCount(userId: string) {
    return this.notificationsRepository.count({
      where: {
        receiver: {
          id: userId,
        },
        seenDate: IsNull(),
      },
    });
  }

  async seenOne(id: string, userId: string) {
    const notification = await this.notificationsRepository.findOne({
      where: {
        id,
        receiver: {
          id: userId,
        },
      },
      relations: ['receiver'],
    });

    if (!notification) {
      return null;
    }

    return this.notificationsRepository.save({
      ...notification,
      seenDate: new Date(),
    });
  }

  async seenAll(userId: string) {
    const notifications = await this.notificationsRepository.find({
      where: {
        receiver: {
          id: userId,
        },
        seenDate: IsNull(),
      },
      select: {
        id: true,
      },
    });

    return this.notificationsRepository.update(
      {
        id: In(notifications.map((n) => n.id)),
      },
      {
        seenDate: new Date(),
      },
    );
  }

  async sendTestNotification(sendTo: string) {
    return await this.notificationsRepository.save({
      title: 'Test notification',
      body: 'This is a test notification',
      priority: NotificationPriority.LOW,
      type: NotificationType.SYS_TEST,
      receiver: {
        id: sendTo,
      },
      data: {
        content: 'Test content',
      },
    });
  }
}
