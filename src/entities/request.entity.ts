import { BaseEntity } from 'src/common/base/entity.base';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { DeviceEntity } from './device.entity';
import { AccountEntity } from './account.entity';
import { TaskEntity } from './task.entity';
import { IssueEntity } from './issue.entity';

export enum RequestStatus {
  PENDING = 'PENDING',
  HEAD_CANCEL = 'HEAD_CANCEL',
  CHECKED = 'CHECKED',
  APPROVED = 'APPROVED',
  IN_PROGRESS = 'IN_PROGRESS',
  CLOSED = 'CLOSED',
  HEAD_CONFIRM = 'HEAD_CONFIRM',
  REJECTED = 'REJECTED',
}

export enum RequestType {
  FIX = 'FIX',
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

  @Column({
    name: 'requester_note',
    type: 'text',
  })
  requester_note: string;

  @ManyToOne(() => AccountEntity, (acc) => acc.id, {
    nullable: true,
  })
  checker: AccountEntity;

  @Column({
    name: 'checker_date',
    type: 'timestamp',
    nullable: true,
  })
  checker_date: Date;

  @Column({
    name: 'checker_note',
    type: 'text',
    nullable: true,
  })
  checker_note: string;

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
    name: 'during_warranty',
    type: 'boolean',
    default: false,
  })
  during_warranty: boolean;

  @Column({
    name: 'is_renew',
    type: 'boolean',
    default: false,
  })
  is_rennew: boolean;

  @Column({
    name: 'wait_renew',
    type: 'boolean',
    default: false,
  })
  wait_renew: boolean;
}
