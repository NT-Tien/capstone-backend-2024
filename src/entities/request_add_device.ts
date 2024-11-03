import { BaseEntity } from 'src/common/base/entity.base';
import { Column, Entity, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { MachineModelEntity } from './machine-model.entity';
import { AccountEntity } from './account.entity';
import { RequestEntity } from './request.entity';
import { DeviceEntity } from './device.entity';


export enum RequestAddDeviceStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  DONE = 'DONE',
}

@Entity({
  name: 'REQUEST_ADD_DEVICE',
  orderBy: {
    createdAt: 'DESC',
  },
})
export class RequestAddDeviceEntity extends BaseEntity {

  @ManyToOne(() => RequestEntity, (request) => request.id)
  request: RequestEntity;

  @Column({ type: 'enum', enum: RequestAddDeviceStatus, default: RequestAddDeviceStatus.PENDING })
  status: RequestAddDeviceStatus;

  @ManyToOne(() => AccountEntity, (account) => account.id)
  created_by: string;

  @ManyToOne(() => DeviceEntity, (device) => device.id)
  new_device: DeviceEntity; // for admin update

}
