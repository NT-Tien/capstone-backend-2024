import { BaseEntity } from 'src/common/base/entity.base';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { TaskEntity } from './task.entity';
import { TypeErrorEntity } from './type-error.entity';
import { IssueSparePartEntity } from './issue-spare-part.entity';
import { RequestEntity } from './request.entity';

export enum FixItemType {
  REPLACE = 'REPLACE',
  REPAIR = 'REPAIR',
}

export enum IssueStatus {
  PENDING = 'PENDING',
  FAILED = 'FAILED',
  RESOLVED = 'RESOLVED',
  CANCELLED = 'CANCELLED',
}

export class history_issue_note {
  note: string
  time: Date
}

@Entity({
  name: 'ISSUE',
})
export class IssueEntity extends BaseEntity {
  @ManyToOne(() => RequestEntity, (request) => request.id)
  request: RequestEntity;

  @ManyToOne(() => TaskEntity, (task) => task.id, { nullable: true })
  task: TaskEntity;

  @ManyToOne(() => TypeErrorEntity, (typeError) => typeError.id)
  typeError: TypeErrorEntity;

  @OneToMany(
    () => IssueSparePartEntity,
    (issueSparePart) => issueSparePart.issue,
  )
  issueSpareParts: IssueSparePartEntity[];

  @Column({
    name: 'description',
    type: 'text',
  })
  description: string;

  @Column({
    name: 'fix_item_type',
    type: 'enum',
    enum: FixItemType,
  })
  fixType: FixItemType;

  @Column({
    name: "resolved_note",
    type: "text",
    nullable: true
  })
  resolvedNote?: string

  @Column({
    name: 'status',
    type: 'enum',
    enum: IssueStatus,
    default: IssueStatus.PENDING,
  })
  status: IssueStatus;

  @Column({
    name: 'images_verify',
    type: 'text',
    array: true,
    nullable: true,
    default: [],
  })
  imagesVerify?: string[];

  @Column({
    name: 'images_verify_fail',
    type: 'text',
    array: true,
    nullable: true,
    default: [],
  })
  imagesVerifyFail?: string[];

  @Column({
    name: 'videos_verify',
    type: 'text',
    nullable: true,
  })
  videosVerify?: string;

  @Column({
    name: "fail_reason",
    type: "text",
    nullable: true
  })
  failReason?: string;

  @Column({
    name: 'return_spare_parts_stockkeeper_signature',
    type: 'text',
    nullable: true,
  })
  returnSparePartsStockkeeperSignature?: string

  @Column({
    name: 'return_spare_parts_staff_signature',
    type: 'text',
    nullable: true,
  })
  returnSparePartsStaffSignature?: string

  @Column({
    name: "task_history",
    type: "jsonb",
    nullable: true
  })
  taskHistory?: any // any[]


  @Column({
    name: "warranty_info",
    type: "jsonb",
    nullable: true
  })
  warranty_info?: any // cách này field này dùng để lưu trong thi trong đơn biên nhận thì bắt user nhập vào, nếu nhập vào thì lưu vào đây, nếu không thì không lưu

  @Column({
    name: "warranty_history_note",
    type: "jsonb",
    nullable: true
  })
  warranty_history_note?: history_issue_note[] // cách này field này dùng để lưu trong thi trong đơn biên nhận thì bắt user nhập vào, nếu nhập vào thì lưu vào đây, nếu không thì không lưu

  
}
