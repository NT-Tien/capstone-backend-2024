import { Column, Entity, ManyToOne, Unique } from 'typeorm';
import { AccountEntity, Role } from './account.entity';
import { BaseEntity } from 'src/common/base/entity.base';

export enum NotifyType {
  REQUEST = 'request',
  TASK = 'task'
}

@Entity()
export class NotifyEntity extends BaseEntity {

  @ManyToOne(() => AccountEntity, (acc) => acc.id, {
    nullable: true,
  })
  fromUser: AccountEntity;

  @ManyToOne(() => AccountEntity, (acc) => acc.id, {
    nullable: true,
  })
  receiver: AccountEntity;

  @Column({
    name: 'role_receiver',
    type: 'enum',
    enum: Role,
    nullable: true,
  })
  roleReceiver: Role;

  @Column({
    name: 'subject_id',
    type: 'text',
    nullable: true,
  })
  subjectId?: string;

  @Column({
    name: 'type',
    type: 'text',
    nullable: true,
  })
  type: string;

  @Column({
    name: 'content',
    type: 'jsonb',
    nullable: true,
  })
  content: any;

  @Column({
    name: 'seen',
    type: 'boolean',
    default: false, // false is unread, true is read
  })
  seen: boolean;

  @Column({
    name: 'identifier',
    type: 'text',
    nullable: true,
  })
  identifier: string
}
