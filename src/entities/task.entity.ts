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
import { ExportWareHouse } from './export-warehouse.entity';

export enum TaskType {
  FIX = 'FIX',
  WARRANTY_SEND = 'WARRANTY_SEND',
  WARRANTY_RECEIVE = 'WARRANTY_RECEIVE',
  RENEW = 'RENEW',
}

export enum TaskStatus {
  // /**
  //  * !only apply for case renew device , after get new device head staff assign to fixer, update status to ASSIGNED
  //  */
  // IN_PROGRESS_WARRANTY_DONE = 'IN_PROGRESS_WARRANTY_DONE', // ADMIN update status to IN_PROGRESS_RENEW_DEVICE_DONE
  // /**
  // * !only apply for case renew device
  // */
  // IN_PROGRESS_RENEW_DEVICE = 'IN_PROGRESS_RENEW_DEVICE', // HEAD_STAFF update status to IN_PROGRESS_RENEW_DEVICE
  // /**
  //  * !only apply for case renew device , after get new device head staff assign to fixer, update status to ASSIGNED
  //  */
  // IN_PROGRESS_RENEW_DEVICE_DONE = 'IN_PROGRESS_RENEW_DEVICE_DONE', // ADMIN update status to IN_PROGRESS_RENEW_DEVICE_DONE
  // /**
  // * AWAITING_SPARE_SPART
  // */
  AWAITING_SPARE_SPART = 'AWAITING_SPARE_SPART', // not use anymore
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
  HEAD_STAFF_CONFIRM = 'HEAD_STAFF_CONFIRM',
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

  @ManyToOne(() => DeviceEntity, (device) => device.id, {
    nullable: true,
  })
  device_renew?: DeviceEntity; // only apply for case renew device

  @ManyToOne(() => RequestEntity, (request) => request.id, { nullable: false })
  request: RequestEntity;

  @OneToMany(() => IssueEntity, (issue) => issue.task)
  issues?: IssueEntity[];

  @ManyToOne(() => AccountEntity, (account) => account.id)
  fixer?: AccountEntity;

  @OneToMany(() => ExportWareHouse, (export_warehouse) => export_warehouse.id)
  export_warehouse_ticket?: ExportWareHouse[];

  @Column({
    name: 'fixer_note',
    type: 'text',
    nullable: true,
  })
  fixerNote?: string;

  @Column({
    name: 'fixer_date',
    nullable: true,
  })
  fixerDate: Date;

  @Column({
    name: 'name',
    type: 'text',
  })
  name: string;

  @Column({
    name: "type",
    type: "enum",
    enum: TaskType,
    default: TaskType.FIX
  })
  type: TaskType;

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
  totalTime: number; // minutes

  @Column({
    name: 'completed_at',
    nullable: true,
  })
  completedAt?: Date;

  @Column({
    name: 'images_verify',
    type: 'text',
    array: true,
    nullable: true,
    default: [],
  })
  imagesVerify?: string[];

  @Column({
    name: 'videos_verify',
    type: 'text',
    nullable: true,
  })
  videosVerify?: string;

  @Column({
    name: 'confirm_receipt',
    type: 'boolean',
    default: false,
  })
  confirmReceipt?: boolean;

  @Column({
    name: 'confirmReceipt_stockkeeper_signature',
    type: 'text',
    default: false,
  })
  confirmReceiptStockkeeperSignature?: string;

  @Column({
    name: 'confirm_receipt_staff_signature',
    type: 'text',
    default: false,
  })
  confirmReceiptStaffSignature?: string;

  @Column({
    name: 'confirm_receipt_by',
    type: 'text',
    nullable: true,
  })
  confirmReceiptBY?: string; 

  @Column({
    name: 'confirm_send_by',
    type: 'text',
    nullable: true,
  })
  confirmSendBy?: string;

  @Column({
    name: 'stockkeeper_note',
    type: 'text',
    nullable: true,
  })
  stockkeeperNote?: string;

  @Column({
    name: 'stockkeeper_note_id',
    type: 'text',
    nullable: true,
  })
  stockkeeperNoteId?: string;

  @Column({
    name: 'last_issues_data',
    type: 'jsonb',
    nullable: true,
  })
  last_issues_data?: any;

  @Column({
    name: 'return_spare_part_data',
    type: 'jsonb',
    nullable: true,
  })
  return_spare_part_data?: any;

  @Column({
    name: "cancel_reason",
    type: "text",
    nullable: true
  })
  cancelReason?: string;

  @Column({
    name: "cancel_by",
    type: "text",
    nullable: true
  })
  cancelBy?: string;
}
