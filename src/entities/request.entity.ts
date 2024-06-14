import { BaseEntity } from 'src/common/base/entity.base';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { DeviceEntity } from './device.entity';
import { AccountEntity } from './account.entity';
import { TaskEntity } from './task.entity';

export enum RequestStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export enum TaskType {
  FIX = 'FIX',
  MAINTENANCE = 'MAINTENANCE',
}
@Entity({
  name: 'REQUEST',
  orderBy: {
    createdAt: 'DESC',
  },
})
export class RequestEntity extends BaseEntity {
  @OneToMany(() => TaskEntity, (task) => task.request)
  tasks: TaskEntity[];

  @ManyToOne(() => DeviceEntity, (device) => device.id, {
    nullable: false,
    eager: true,
  })
  device: DeviceEntity;

  @ManyToOne(() => AccountEntity, (acc) => acc.id, {
    nullable: false,
    eager: true,
  })
  requester: AccountEntity;

  @Column({
    name: 'requester_note',
    type: 'text',
  })
  requester_note: string;

  @ManyToOne(() => AccountEntity, (acc) => acc.id, {
    nullable: true,
    eager: true,
  })
  checker: AccountEntity;

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
    enum: TaskType,
  })
  type: TaskType;
}
