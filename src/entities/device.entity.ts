import { BaseEntity } from 'src/common/base/entity.base';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { MachineModelEntity } from './machine-model.entity';
import { AreaEntity } from './area.entity';
import { RequestEntity } from './request.entity';

@Entity({
  name: 'DEVICE',
})
export class DeviceEntity extends BaseEntity {
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
}
