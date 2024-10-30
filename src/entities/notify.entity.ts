import { Column, Entity, ManyToOne, Unique } from 'typeorm';
import { AccountEntity, Role } from './account.entity';
import { BaseEntity } from 'src/common/base/entity.base';

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
    name: 'task_id',
    type: 'uuid',
    nullable: true,
  })
  taskId: string;

  @Column({
    name: 'request_id',
    type: 'uuid',
    nullable: true,
  })
  requestId: string;

  @Column({
    name: 'content',
    type: 'text',
    nullable: true,
  })
  content: string;

  @Column({
    name: 'status',
    type: 'boolean',
    default: false, // false is unread, true is read
  })
  status: boolean;
}
