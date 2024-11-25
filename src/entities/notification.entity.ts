import { BaseEntity } from 'src/common/base/entity.base';
import { AccountEntity } from 'src/entities/account.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

export enum NotificationPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
}

export enum NotificationType {
  SYS_TEST = 'SYS_TEST',
  HD_CREATE_REQUEST = 'HD_CREATE_REQUEST',
  HM_APPROVE_REQUEST = 'HM_APPROVE_REQUEST',
  HM_REJECT_REQUEST = 'HM_REJECT_REQUEST',
  HM_ASSIGN_TASK = 'HM_ASSIGN_TASK',
}

@Entity({ name: 'NOTIFICATION', orderBy: { createdAt: 'DESC' } })
export class NotificationEntity extends BaseEntity {
  @ManyToOne(() => AccountEntity, (acc) => acc.id, {
    nullable: true,
  })
  sender: AccountEntity;

  @ManyToOne(() => AccountEntity, (acc) => acc.id, {
    nullable: false,
  })
  receiver: AccountEntity;

  @Column({
    name: 'title',
    type: 'text',
    nullable: false,
  })
  title: string;

  @Column({
    name: 'body',
    type: 'text',
    nullable: false,
  })
  body: string;

  @Column({
    name: 'priority',
    type: 'enum',
    enum: NotificationPriority,
    nullable: false,
  })
  priority: NotificationPriority;

  @Column({
    name: 'seen_date',
    type: 'timestamp',
    nullable: true,
    default: null,
  })
  seenDate: Date;

  @Column({
    name: 'type',
    type: 'text',
    nullable: false,
  })
  type: NotificationType;

  @Column({
    name: 'data',
    type: 'jsonb',
    nullable: true,
  })
  data: any;
}
