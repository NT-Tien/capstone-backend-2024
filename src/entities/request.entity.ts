import { BaseEntity } from 'src/common/base/entity.base';
import { Column, Entity, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { DeviceEntity } from './device.entity';
import { AccountEntity } from './account.entity';
import { TaskEntity } from './task.entity';
import { IssueEntity } from './issue.entity';
import { FeedbackEntity } from './feedback.entity';

export enum RequestStatus {
  PENDING = 'PENDING', // use for request renew
  HEAD_CANCEL = 'HEAD_CANCEL',
  APPROVED = 'APPROVED', // use for request renew
  IN_PROGRESS = 'IN_PROGRESS', // use for request renew
  CLOSED = 'CLOSED', // use for request renew
  HEAD_CONFIRM = 'HEAD_CONFIRM',
  REJECTED = 'REJECTED', // use for request renew
}

export enum RequestType {
  FIX = 'FIX',
  WARRANTY = 'WARRANTY',
  RENEW = 'RENEW',
  MAINTENANCE = 'MAINTENANCE',
}

export enum RequestLevel { // only for MAINTENANCE type
  LOW = 'LOW', // rate of failure is 10% - 30%
  MEDIUM = 'MEDIUM', // rate of failure is 30% - 70%
  HIGH = 'HIGH', // rate of failure is 70% - 100%
}
@Entity({
  name: 'REQUEST',
  orderBy: {
    createdAt: 'DESC',
  },
})
export class RequestEntity extends BaseEntity {
  @OneToMany(() => IssueEntity, (issue) => issue.request)
  issues: IssueEntity[];

  @OneToMany(() => TaskEntity, (task) => task.request)
  tasks: TaskEntity[];

  @ManyToOne(() => DeviceEntity, (device) => device.id, {
    nullable: false,
  })
  device: DeviceEntity;

  @ManyToOne(() => AccountEntity, (acc) => acc.id, {
    nullable: false,
  })
  requester: AccountEntity;

  @OneToOne(() => FeedbackEntity, (feedback) => feedback.request)
  feedback?: FeedbackEntity;

  @Column({
    name: 'requester_note',
    type: 'text',
    nullable: true,
  })
  requester_note: string; // if the request is renew type, requester is headstaff

  @ManyToOne(() => AccountEntity, (acc) => acc.id, {
    nullable: true,
  })
  checker: AccountEntity;

  @Column({
    name: 'checker_date',
    nullable: true,
  })
  checker_date: Date;

  @Column({
    name: 'checker_note',
    type: 'text',
    nullable: true,
  })
  checker_note: string; // if the request is renew type, checker is admin

  @Column({
    name: 'status',
    type: 'enum',
    enum: RequestStatus,
    default: RequestStatus.PENDING,
  })
  status: RequestStatus;

  @Column({
    name: 'type',
    type: 'enum',
    enum: RequestType,
    default: RequestType.FIX,
  })
  type: RequestType;

  @Column({
    name: 'level',
    type: 'enum',
    enum: RequestLevel,
    nullable: true,
  })
  level: RequestLevel; // forestall the failure

  @Column({
    name: 'is_seen',
    type: 'boolean',
    default: false,
  })
  is_seen: boolean;

  @Column({
    name: 'is_warranty',
    type: 'boolean',
    default: false,
  })
  is_warranty: boolean;

  @Column({
    name: 'is_fix',
    type: 'boolean',
    default: false,
  })
  is_fix: boolean;

  @Column({
    name: "is_multiple_types",
    type: "boolean",
    default: false,
  })
  is_multiple_types: boolean;

  @Column({
    name: 'return_date_warranty',
    nullable: true,
  })
  return_date_warranty: Date;

  @Column({
    name: 'is_renew',
    type: 'boolean',
    default: false,
  })
  is_rennew: boolean;
}

export class RequestUtil {
  static isRunning(request?: RequestEntity): boolean | undefined {
    if(!request) return undefined;
    return request.status === RequestStatus.PENDING || request.status === RequestStatus.APPROVED || request.status === RequestStatus.IN_PROGRESS;
  }
}