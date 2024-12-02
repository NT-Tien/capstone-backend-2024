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
  HD_FEEDBACK_BAD = 'HD_FEEDBACK_BAD',
  HM_APPROVE_REQUEST_FIX = 'HM_APPROVE_REQUEST_FIX',
  HM_APPROVE_REQUEST_WARRANTY = 'HM_APPROVE_REQUEST_WARRANTY',
  HM_APPROVE_REQUEST_RENEW = 'HM_APPROVE_REQUEST_RENEW',
  HM_REJECT_REQUEST = 'HM_REJECT_REQUEST',
  HM_ASSIGN_TASK = 'HM_ASSIGN_TASK',
  HM_CREATE_RETURN_WARRANTY_TASK = 'HM_CREATE_RETURN_WARRANTY_TASK',
  STOCK_ACCEPT_EXPORT_WAREHOUSE = 'STOCK_ACCEPT_EXPORT_WAREHOUSE',
  S_START_TASK = 'S_START_TASK',
  S_COMPLETE_TASK_WITH_FAILED_ISSUE = 'S_COMPLETE_TASK_WITH_FAILED_ISSUE',
  S_COMPLETE_ALL_TASKS = 'S_COMPLETE_ALL_TASKS',
  S_COMPLETE_WARRANTY_SEND = 'S_COMPLETE_WARRANTY_SEND',
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
    name: 'subject',
    type: 'text',
    nullable: true,
  })
  subject?: string;

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
