import { BaseEntity } from 'src/common/base/entity.base';
import { Column, Entity, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { MachineModelEntity } from './machine-model.entity';
import { AccountEntity } from './account.entity';


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
  @ManyToOne(() => MachineModelEntity, (machineModel) => machineModel.id)
  machine_model: MachineModelEntity; // 

  @Column({ type: 'enum', enum: RequestAddDeviceStatus, default: RequestAddDeviceStatus.PENDING })
  status: RequestAddDeviceStatus;

  @ManyToOne(() => AccountEntity, (account) => account.id)
  created_by: string;

}
