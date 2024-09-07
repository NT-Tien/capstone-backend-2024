import { BaseEntity } from 'src/common/base/entity.base';
import { Column, Entity, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { DeviceEntity } from './device.entity';
import { AccountEntity } from './account.entity';
import { RequestEntity } from './request.entity';


@Entity({
  name: 'REQUEST_ADD_DEVICE',
  orderBy: {
    createdAt: 'DESC',
  },
})
export class RequestAddDeviceEntity extends BaseEntity {

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

  @ManyToOne(() => RequestEntity, (request) => request.id, { nullable: false })
  request: RequestEntity;

  @Column({
    name: 'is_seen',
    type: 'boolean',
    default: false,
  })
  is_seen: boolean;

  @Column({
    name: 'is_renew_done',
    type: 'boolean',
    default: false,
  })
  is_renew_done: boolean;
}
