import { BaseEntity } from 'src/common/base/entity.base';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { RequestEntity } from './request.entity';
import { IssueEntity } from './issue.entity';
import { AccountEntity } from './account.entity';
import { DeviceEntity } from './device.entity';

export enum TaskStatus {
  /**
 * AWAITING_SPARE_SPART
 */
  AWAITING_SPARE_SPART = 'AWAITING_SPARE_SPART',
  /**
   * AWAITING_FIXER: khi nào còn chưa gán fixer thì dược update nội dung task, ngược lại chỉ có thể cancel task
   */
  AWAITING_FIXER = 'AWAITING_FIXER',
  /**
   * ASSIGNED: khi đã gán fixer thì không thể update nội dung task, chỉ có thể update trạng thái task
   */
  ASSIGNED = 'ASSIGNED',
  /**
   *
   */
  IN_PROGRESS = 'IN_PROGRESS',
  /**
   *
   */
  COMPLETED = 'COMPLETED',
  /**
 *
 */
  HEAD_CONFIRM = 'HEAD_CONFIRM',
  /**
   *
   */
  CANCELLED = 'CANCELLED',
}

@Entity({
  name: 'TASK',
})
export class TaskEntity extends BaseEntity {
  @ManyToOne(() => DeviceEntity, (device) => device.id, {
    nullable: false,
  })
  device: DeviceEntity;

  @ManyToOne(() => RequestEntity, (request) => request.id, { nullable: false })
  request: RequestEntity;

  @OneToMany(() => IssueEntity, (issue) => issue.task)
  issues?: IssueEntity[];

  @ManyToOne(() => AccountEntity, (account) => account.id)
  fixer?: AccountEntity;

  @Column({
    name: 'fixer_note',
    type: 'text',
    nullable: true,
  })
  fixerNote?: string;

  @Column({
    name: 'fixer_date',
    type: 'timestamp',
    nullable: true,
  })
  fixerDate: Date;

  @Column({
    name: 'name',
    type: 'text',
  })
  name: string;

  @Column({
    name: 'status',
    type: 'enum',
    enum: TaskStatus,
    default: TaskStatus.AWAITING_SPARE_SPART,
  })
  status: TaskStatus;

  @Column({
    name: 'priority',
    type: 'boolean',
  })
  priority: boolean;

  @Column({
    name: 'operator',
    type: 'float',
  })
  operator: number;

  @Column({
    name: 'totalTime',
    type: 'int',
  })
  totalTime: number;

  @Column({
    name: 'completed_at',
    type: 'timestamp',
    nullable: true,
  })
  completedAt?: Date;


  // bỏ 2 column evidence


  @Column({
    name: 'confirm_receipt',
    type: 'boolean',
    default: false,
  })
  confirmReceipt?: boolean;
}
