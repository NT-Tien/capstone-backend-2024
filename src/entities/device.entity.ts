import { BaseEntity } from 'src/common/base/entity.base';
import { Column, Entity, Index, ManyToOne, OneToMany } from 'typeorm';
import { MachineModelEntity } from './machine-model.entity';
import { AreaEntity } from './area.entity';
import { RequestEntity } from './request.entity';
import { TaskEntity } from './task.entity';

@Entity({
  name: 'DEVICE',
})
// @Index(['area', 'positionX', 'positionY'], { unique: true })
export class DeviceEntity extends BaseEntity {

  @OneToMany(() => TaskEntity, (task) => task.device)
  task_renew: TaskEntity; // for renew

  @OneToMany(() => TaskEntity, (task) => task.device)
  task: TaskEntity; // for normal get

  @ManyToOne(() => AreaEntity, (area) => area.id, {
    nullable: true,
  })
  area: AreaEntity;

  @OneToMany(() => RequestEntity, (request) => request.device)
  requests: RequestEntity[];

  @Column({
    name: 'position_x',
    type: 'int',
    nullable: true,
  })
  positionX: number;

  @Column({
    name: 'position_y',
    nullable: true,
    type: 'int',
  })
  positionY: number;

  @ManyToOne(() => MachineModelEntity, (machineModel) => machineModel.id, {
    nullable: false,
  })
  machineModel: MachineModelEntity;

  @Column({
    name: 'description',
    type: 'text',
  })
  description: string;

  @Column({
    name: 'operation_info',
    type: 'float',
  })
  operationStatus: number;

  @Column({
    name: 'is_warranty',
    type: 'boolean',
    nullable: true,
  })
  isWarranty: boolean; // true: warranty, false: not warranty

  @Column({
    name: 'status',
    type: 'boolean',
    default: true,
    nullable: true,
  })
  status: boolean;

  @Column({
    name: 'warranty_term',
    nullable: true,
  })
  warrantyTerm: Date;

  @Column({
    name: 'device_code',
    nullable: true,
    type: 'text',
  })
  deviceCode: string;
}
