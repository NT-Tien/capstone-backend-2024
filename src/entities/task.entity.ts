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
  // /**
  // * !only apply for case renew device
  // */
  // IN_PROGRESS_WARRANTY = 'IN_PROGRESS_WARRANTY', // HEAD_STAFF update status to IN_PROGRESS_WARRANTY
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
  HEAD_STAFF_CONFIRM = 'HEAD_DEPARTMENT_CONFIRM',
  /**
   *
   */
  CANCELLED = 'CANCELLED',
  /**
  *
  */
  STAFF_REQUEST_CANCELLED = 'STAFF_REQUEST_CANCELLED',
  /**
  *
  */
  HEAD_STAFF_CONFIRM_STAFF_REQUEST_CANCELLED = 'HEAD_STAFF_CONFIRM_STAFF_REQUEST_CANCELLED',
  /**
  * when all spare part in issue have status FAILED is returned
  */
  CONFRIM_RECEIPT_RETURN_SPARE_PART = 'CONFRIM_RECEIPT_RETURN_SPARE_PART',
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

  // get imagesVerify(): string[] {
  //     return this._imagesVerify;
  // }

  // set imagesVerify(images: string[]) {
  //     const maxLength = 3;
  //     if (images.length > maxLength) {
  //         throw new Error(`Độ dài của mảng không thể vượt quá ${maxLength}`);
  //     }
  //     this._imagesVerify = images;
  // }

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
    name: 'confirm_receipt_by',
    type: 'text',
    nullable: true,
  })
  confirmReceiptBY?: string; // store account id of stockkeeper who confirm get renew device

  @Column({
    name: 'confirm_recieve',
    type: 'text',
    nullable: true,
  })
  confirmRecieveBy?: string; // store account id of stockkeeper who confirm get renew device

  @Column({
    name: 'confirm_recieve_return_spare_part',
    type: 'text',
    nullable: true,
  })
  confirm_recieve_return_spare_part?: string; // store account id of stockkeeper who confirm get renew device
  
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
}
