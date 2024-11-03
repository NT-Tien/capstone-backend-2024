import { BaseEntity } from 'src/common/base/entity.base';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { TaskEntity } from './task.entity';

export enum exportType {
  DEVICE = 'DEVICE',
  SPARE_PART = 'SPARE_PART',
}
export enum exportStatus {
  WAITING = 'WAITING',
  DELAY = 'DELAY',
  ACCEPTED = 'ACCEPTED',
  EXPORTED = 'EXPORTED',
  CANCEL = 'CANCEL',
}
@Entity({
  name: 'EXPORT_WAREHOUSE',
})
export class ExportWareHouse extends BaseEntity {
  
  @ManyToOne(() => TaskEntity, (task) => task.id, {
    nullable: false,
  })
  task: TaskEntity;

  @Column({
    name: 'detail',
    type: 'jsonb',
  })
  detail: any;

  @Column({
    name: 'export_type',
    type: 'enum',
    enum: exportType,
  })
  export_type: exportType;

  @Column({
    name: 'reason_delay',
    type: 'text',
    nullable: true,
  })
  reason_delay: string;

  @Column({
    name: 'reason_cancel',
    type: 'text',
    nullable: true,
  })
  reason_cancel: string;

  @Column({
    name: 'status',
    type: 'enum',
    enum: exportStatus,
    default: exportStatus.WAITING,
  })
  status: exportStatus;

}
